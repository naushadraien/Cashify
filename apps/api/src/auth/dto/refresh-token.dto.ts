import { createZodDto } from "nestjs-zod";
import { RefreshTokenSchema, LogoutSchema } from "@repo/schemas";

export class RefreshTokenDto extends createZodDto(RefreshTokenSchema) {}
export class LogoutDto extends createZodDto(LogoutSchema) {}
