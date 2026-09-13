import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import type { Request } from "express";
import { AuthService } from "./auth.service";
import { CurrentUser } from "./decorators/current-user.decorator";
import { LogoutDto, RefreshTokenDto } from "./dto/refresh-token.dto";
import { LoginDto, RegisterDto } from "./dto/register.dto";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { JwtRefreshGuard } from "./guards/jwt-refresh.guard";
import { LocalAuthGuard } from "./guards/local-auth.guard";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly config: ConfigService,
  ) {}

  // =======================================================================
  // EMAIL / PASSWORD — used identically by web and mobile, no provider
  // token involved so there's nothing native-SDK-specific about it.
  // =======================================================================

  @Post("register")
  @ApiOperation({ summary: "Create an account with email + password" })
  @ApiResponse({
    status: 201,
    description: "Account created successfully.",
  })
  @ApiResponse({ status: 409, description: "Email already in use" })
  async register(@Body() body: RegisterDto) {
    await this.authService.registerWithPassword({
      email: body.email,
      password: body.password,
      firstName: body.firstName,
      lastName: body.lastName,
      country: body.country,
      phoneNumber: body.phoneNumber,
    });

    return { message: "Account created successfully. Please log in." };
  }

  @Post("login")
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @ApiOperation({ summary: "Log in with email + password" })
  @ApiResponse({ status: 200, description: "Token pair returned" })
  @ApiResponse({ status: 401, description: "Invalid email or password" })
  async login(@Req() req: Request, @Body() _body: LoginDto) {
    // LocalStrategy already validated credentials and attached the user to req.user.
    return this.authService.issueTokens(req.user as any);
  }

  // =======================================================================
  // SHARED — token refresh, logout, current user (web + mobile alike)
  // =======================================================================

  @Post("refresh")
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtRefreshGuard)
  @ApiOperation({
    summary:
      "Rotate a refresh token for a new access + refresh pair (web: reads the httpOnly cookie; mobile: reads the body)",
  })
  @ApiResponse({ status: 200, description: "New token pair" })
  @ApiResponse({
    status: 401,
    description: "Refresh token invalid, expired, or reused",
  })
  async refresh(@Req() req: Request, @Body() _body: RefreshTokenDto) {
    const payload = req.user as any;
    return this.authService.refreshTokens(payload, payload.rawToken);
  }

  @Post("logout")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: "Revoke a refresh token (sign out of this device/session)",
  })
  async logout(@Req() req: Request, @Body() body: LogoutDto) {
    const rawToken = body.refreshToken;
    if (rawToken) {
      await this.authService.revokeRefreshToken(rawToken);
    }
  }

  @Post("logout-all")
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary:
      "Revoke every refresh token for the current user (sign out everywhere)",
  })
  async logoutAll(@CurrentUser() user: { id: string }) {
    await this.authService.logoutAllDevices(user.id);
  }

  @Get("me")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get the currently authenticated user" })
  async me(@CurrentUser() user: { id: string }) {
    return this.authService.getUserById(user.id);
  }
}
