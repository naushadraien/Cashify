import { z } from "zod";

export const OAuthProvider = z.enum(["google", "facebook", "apple", "github"]);
export type OAuthProviderType = z.infer<typeof OAuthProvider>;

// ---------- Mobile login payloads (native SDK token -> backend verification) ----------

export const MobileGoogleLoginSchema = z.object({
  idToken: z.string().min(1, "idToken is required"),
});
export type MobileGoogleLogin = z.infer<typeof MobileGoogleLoginSchema>;

export const MobileFacebookLoginSchema = z.object({
  accessToken: z.string().min(1, "accessToken is required"),
});
export type MobileFacebookLogin = z.infer<typeof MobileFacebookLoginSchema>;

export const MobileAppleLoginSchema = z.object({
  identityToken: z.string().min(1, "identityToken is required"),
  fullName: z
    .object({
      givenName: z.string().nullable().optional(),
      familyName: z.string().nullable().optional(),
    })
    .nullable()
    .optional(),
  email: z.string().nullable().optional(),
});
export type MobileAppleLogin = z.infer<typeof MobileAppleLoginSchema>;

export const MobileGithubLoginSchema = z.object({
  code: z.string().min(1, "authorization code is required"),
  redirectUri: z.string().url(),
  codeVerifier: z.string().min(1),
});
export type MobileGithubLogin = z.infer<typeof MobileGithubLoginSchema>;

// ---------- Email / password auth ----------

export const RegisterSchema = z
  .object({
    firstName: z
      .string({ required_error: "First name is required" })
      .min(1, "First name is required")
      .max(50, "First name must be at most 50 characters"),
    lastName: z
      .string({ required_error: "Last name is required" })
      .min(1, "Last name is required")
      .max(50, "Last name must be at most 50 characters"),
    country: z
      .string({ required_error: "Country is required" })
      .min(1, "Country is required"),
    phoneNumber: z
      .string({ required_error: "Phone number is required" })
      .min(7, "Phone number must be at least 7 digits")
      .max(15, "Phone number must be at most 15 digits")
      .regex(/^\+?[0-9]+$/, "Phone number must contain only digits"),
    email: z
      .string({ required_error: "Email is required" })
      .email("Please enter a valid email address"),
    password: z
      .string({ required_error: "Password is required" })
      .min(8, "Password must be at least 8 characters")
      .max(100, "Password must be less than 100 characters")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z
      .string({ required_error: "Please confirm your password" })
      .min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
export type RegisterInput = z.infer<typeof RegisterSchema>;

// Server-side DTO schema (no confirmPassword needed for the API layer)
export const RegisterServerSchema = z.object({
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
  country: z.string().min(1),
  phoneNumber: z
    .string()
    .min(7)
    .max(15)
    .regex(/^\+?[0-9]+$/),
  email: z.string().email(),
  password: z.string().min(8).max(100).regex(/[0-9]/),
});
export type RegisterServerInput = z.infer<typeof RegisterServerSchema>;

export const LoginSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email("Please enter a valid email address"),
  password: z
    .string({ required_error: "Password is required" })
    .min(1, "Password is required"),
});
export type LoginInput = z.infer<typeof LoginSchema>;

// ---------- Profile ----------

export const UpdateProfileSchema = z.object({
  name: z.string().min(1).optional(),
  avatarUrl: z.string().url().nullable().optional(),
});
export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>;

// ---------- Email verification ----------

export const ConfirmEmailVerificationSchema = z.object({
  token: z.string().min(1),
});
export type ConfirmEmailVerificationInput = z.infer<
  typeof ConfirmEmailVerificationSchema
>;

// ---------- Password reset ----------

export const ForgotPasswordSchema = z.object({
  email: z.string().email(),
});
export type ForgotPasswordInput = z.infer<typeof ForgotPasswordSchema>;

export const ResetPasswordSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(8, "Password must be at least 8 characters"),
});
export type ResetPasswordInput = z.infer<typeof ResetPasswordSchema>;

// ---------- Token endpoints ----------
// refreshToken is optional in the body for both: mobile always sends it
// explicitly (no cookies available), web omits it and relies on the
// httpOnly cookie set at login -- the guard/service fill in whichever is
// actually present.

export const RefreshTokenSchema = z.object({
  refreshToken: z.string().min(1).optional(),
});
export type RefreshTokenInput = z.infer<typeof RefreshTokenSchema>;

export const LogoutSchema = z.object({
  refreshToken: z.string().min(1).optional(),
});
export type LogoutInput = z.infer<typeof LogoutSchema>;

// ---------- Response shapes ----------

export const AuthUserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().nullable(),
  name: z.string().nullable(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  country: z.string().nullable(),
  phoneNumber: z.string().nullable(),
  avatarUrl: z.string().nullable(),
});
export type AuthUser = z.infer<typeof AuthUserSchema>;

export const AuthTokensSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  expiresIn: z.number(),
  user: AuthUserSchema,
});
export type AuthTokens = z.infer<typeof AuthTokensSchema>;

export const AccessTokenOnlySchema = z.object({
  accessToken: z.string(),
  expiresIn: z.number(),
});
export type AccessTokenOnly = z.infer<typeof AccessTokenOnlySchema>;
