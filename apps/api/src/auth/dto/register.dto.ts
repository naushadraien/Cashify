import { createZodDto } from "nestjs-zod";
import { RegisterServerSchema, LoginSchema } from "@repo/schemas";

export class RegisterDto extends createZodDto(RegisterServerSchema) {}
export class LoginDto extends createZodDto(LoginSchema) {}
