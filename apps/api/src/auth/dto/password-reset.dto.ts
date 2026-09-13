import { createZodDto } from "nestjs-zod";
import { ForgotPasswordSchema, ResetPasswordSchema } from "@repo/schemas";

export class ForgotPasswordDto extends createZodDto(ForgotPasswordSchema) {}
export class ResetPasswordDto extends createZodDto(ResetPasswordSchema) {}
