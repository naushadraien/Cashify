import {
  Inject,
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { randomUUID, randomBytes } from "crypto";
import * as bcrypt from "bcryptjs";
import { eq, and, isNull } from "drizzle-orm";
import { JwtRefreshPayload } from "./types/jwt-payload.type";
import type { AuthTokens } from "@repo/schemas";
import { DRIZZLE } from "../db/drizzle.provider";
import * as schema from "../db/schema";

@Injectable()
export class AuthService {
  constructor(
    @Inject(DRIZZLE) private readonly db: any,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  // Email / password auth

  async registerWithPassword(fields: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    country: string;
    phoneNumber: string;
  }) {
    const existing = await this.db.query.users.findFirst({
      where: eq(schema.users.email, fields.email),
    });
    if (existing) {
      // Don't leak whether the email belongs to an OAuth-only account vs a
      // password account -- same generic conflict either way.
      throw new ConflictException("An account with this email already exists");
    }
    const passwordHash = await bcrypt.hash(fields.password, 12);
    const name = `${fields.firstName} ${fields.lastName}`.trim();
    const [user] = await this.db
      .insert(schema.users)
      .values({
        email: fields.email,
        passwordHash,
        name,
        firstName: fields.firstName,
        lastName: fields.lastName,
        country: fields.country,
        phoneNumber: fields.phoneNumber,
        emailVerified: false,
      })
      .returning();

    return user;
  }

  async validateLocalUser(email: string, password: string) {
    const user = await this.db.query.users.findFirst({
      where: eq(schema.users.email, email),
    });
    // No user, or an OAuth-only account with no password set -- reject either way,
    // and with the same generic error from the caller so account existence isn't leaked.
    if (!user?.passwordHash) return null;
    const matches = await bcrypt.compare(password, user.passwordHash);
    return matches ? user : null;
  }

  // Token issuance + refresh rotation

  async issueTokens(user: {
    id: string;
    email: string | null;
    name: string | null;
    firstName?: string | null;
    lastName?: string | null;
    country?: string | null;
    phoneNumber?: string | null;
    avatarUrl: string | null;
  }): Promise<AuthTokens> {
    const family = randomUUID();
    const { accessToken, refreshToken, expiresIn } = await this.mintTokenPair(
      user.id,
      user.email,
      family,
    );
    return {
      accessToken,
      refreshToken,
      expiresIn,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        firstName: user.firstName ?? null,
        lastName: user.lastName ?? null,
        country: user.country ?? null,
        phoneNumber: user.phoneNumber ?? null,
        avatarUrl: user.avatarUrl,
      },
    };
  }

  private async mintTokenPair(
    userId: string,
    email: string | null,
    family: string,
  ) {
    const jti = randomUUID();
    const accessExpiresIn = this.config.get<string>("jwt.accessExpiresIn")!;
    const refreshExpiresIn = this.config.get<string>("jwt.refreshExpiresIn")!;

    const accessToken = await this.jwt.signAsync(
      { sub: userId, email },
      {
        secret: this.config.get("jwt.accessSecret"),
        expiresIn: accessExpiresIn,
      },
    );
    const refreshToken = await this.jwt.signAsync(
      { sub: userId, family, jti } as JwtRefreshPayload,
      {
        secret: this.config.get("jwt.refreshSecret"),
        expiresIn: refreshExpiresIn,
      },
    );

    const tokenHash = await bcrypt.hash(refreshToken, 10);
    const expiresAt = new Date(
      Date.now() + this.parseDurationMs(refreshExpiresIn),
    );

    await this.db.insert(schema.refreshTokens).values({
      id: jti,
      userId,
      family,
      tokenHash,
      expiresAt,
    });

    return {
      accessToken,
      refreshToken,
      expiresIn: this.parseDurationMs(accessExpiresIn) / 1000,
    };
  }

  /**
   * Rotates a refresh token: the presented token is revoked and a brand new
   * pair is issued in the same family. If a token that was ALREADY revoked
   * is presented again (token reuse -- a strong signal of theft), the
   * entire family is revoked, forcing a full re-login on every device.
   */
  async refreshTokens(
    payload: JwtRefreshPayload,
    rawToken: string,
  ): Promise<AuthTokens> {
    const stored = await this.db.query.refreshTokens.findFirst({
      where: eq(schema.refreshTokens.id, payload.jti),
    });

    if (!stored)
      throw new UnauthorizedException("Refresh token not recognized");

    const matches = await bcrypt.compare(rawToken, stored.tokenHash);
    if (!matches) throw new UnauthorizedException("Refresh token mismatch");

    if (stored.revokedAt) {
      // Reuse of a revoked token -- assume compromise, kill the whole family.
      await this.db
        .update(schema.refreshTokens)
        .set({ revokedAt: new Date() })
        .where(
          and(
            eq(schema.refreshTokens.family, stored.family),
            isNull(schema.refreshTokens.revokedAt),
          ),
        );
      throw new UnauthorizedException(
        "Refresh token reuse detected -- all sessions revoked",
      );
    }

    if (stored.expiresAt < new Date()) {
      throw new UnauthorizedException("Refresh token expired");
    }

    await this.db
      .update(schema.refreshTokens)
      .set({ revokedAt: new Date() })
      .where(eq(schema.refreshTokens.id, stored.id));

    const user = await this.db.query.users.findFirst({
      where: eq(schema.users.id, stored.userId),
    });
    if (!user) throw new UnauthorizedException("User no longer exists");

    const { accessToken, refreshToken, expiresIn } = await this.mintTokenPair(
      user.id,
      user.email,
      stored.family,
    );
    return {
      accessToken,
      refreshToken,
      expiresIn,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        firstName: user.firstName ?? null,
        lastName: user.lastName ?? null,
        country: user.country ?? null,
        phoneNumber: user.phoneNumber ?? null,
        avatarUrl: user.avatarUrl,
      },
    };
  }

  async revokeRefreshToken(rawToken: string | undefined) {
    if (!rawToken) return;
    // Best-effort: decode without verifying expiry so an already-expired
    // token can still be explicitly revoked/cleaned up on logout.
    const decoded = this.jwt.decode(rawToken) as JwtRefreshPayload | null;
    if (!decoded?.jti) return;
    await this.db
      .update(schema.refreshTokens)
      .set({ revokedAt: new Date() })
      .where(eq(schema.refreshTokens.id, decoded.jti));
  }

  /** Revokes every active refresh token for a user -- signs them out on every device/session. */
  async logoutAllDevices(userId: string) {
    await this.db
      .update(schema.refreshTokens)
      .set({ revokedAt: new Date() })
      .where(
        and(
          eq(schema.refreshTokens.userId, userId),
          isNull(schema.refreshTokens.revokedAt),
        ),
      );
  }

  async getUserById(id: string) {
    return this.db.query.users.findFirst({
      where: eq(schema.users.id, id),
      columns: { passwordHash: false },
    });
  }

  private parseDurationMs(duration: string): number {
    const match = duration.match(/^(\d+)(ms|s|m|h|d)$/);
    if (!match) return 15 * 60 * 1000;
    const value = parseInt(match[1], 10);
    const unit = match[2];
    const multipliers: Record<string, number> = {
      ms: 1,
      s: 1000,
      m: 60_000,
      h: 3_600_000,
      d: 86_400_000,
    };
    return value * multipliers[unit];
  }
}
