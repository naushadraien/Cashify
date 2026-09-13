import { createZodDto } from "nestjs-zod";
import { UserIdParamSchema } from "@repo/schemas";

export class UserIdParamDto extends createZodDto(UserIdParamSchema) {}
