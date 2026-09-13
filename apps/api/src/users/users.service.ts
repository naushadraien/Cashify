import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { eq, ilike, or } from "drizzle-orm";
import { DRIZZLE } from "../db/drizzle.provider";
import * as schema from "../db/schema";

const MAX_SEARCH_RESULTS = 20;

@Injectable()
export class UsersService {
  constructor(@Inject(DRIZZLE) private readonly db: any) {}

  async getById(id: string) {
    const user = await this.db.query.users.findFirst({
      where: eq(schema.users.id, id),
      columns: { passwordHash: false },
    });
    if (!user) throw new NotFoundException("User not found");
    return user;
  }

  /**
   * email matches exactly (a partial/fuzzy email match would let someone
   * enumerate accounts by probing fragments); name matches as a case-
   * insensitive partial ("directory search"). Both filters are OR'd
   * together when both are given.
   */
  async search(params: { name?: string; email?: string }) {
    const conditions = [];
    if (params.email) conditions.push(eq(schema.users.email, params.email));
    if (params.name)
      conditions.push(ilike(schema.users.name, `%${params.name}%`));

    return this.db.query.users.findMany({
      where: or(...conditions),
      columns: { passwordHash: false },
      limit: MAX_SEARCH_RESULTS,
    });
  }

  async updateProfile(
    id: string,
    updates: { name?: string; avatarUrl?: string | null },
  ) {
    const [updated] = await this.db
      .update(schema.users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(schema.users.id, id))
      .returning({
        id: schema.users.id,
        email: schema.users.email,
        name: schema.users.name,
        avatarUrl: schema.users.avatarUrl,
        emailVerified: schema.users.emailVerified,
        createdAt: schema.users.createdAt,
        updatedAt: schema.users.updatedAt,
      });
    if (!updated) throw new NotFoundException("User not found");
    return updated;
  }

  async deleteAccount(id: string) {
    // Cascades to refresh_tokens via FK onDelete: 'cascade'.
    await this.db.delete(schema.users).where(eq(schema.users.id, id));
  }
}
