import { createZodDto } from "nestjs-zod";
import { ConfirmEmailVerificationSchema } from "@repo/schemas";

export class ConfirmEmailVerificationDto extends createZodDto(
  ConfirmEmailVerificationSchema,
) {}
