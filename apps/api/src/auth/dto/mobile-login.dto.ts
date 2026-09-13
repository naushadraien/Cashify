import { createZodDto } from "nestjs-zod";
import {
  MobileGoogleLoginSchema,
  MobileFacebookLoginSchema,
  MobileAppleLoginSchema,
  MobileGithubLoginSchema,
} from "@repo/schemas";

export class MobileGoogleLoginDto extends createZodDto(
  MobileGoogleLoginSchema,
) {}
export class MobileFacebookLoginDto extends createZodDto(
  MobileFacebookLoginSchema,
) {}
export class MobileAppleLoginDto extends createZodDto(MobileAppleLoginSchema) {}
export class MobileGithubLoginDto extends createZodDto(
  MobileGithubLoginSchema,
) {}
