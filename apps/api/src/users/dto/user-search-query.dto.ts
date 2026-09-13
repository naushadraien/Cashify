import { createZodDto } from "nestjs-zod";
import { UserSearchQuerySchema } from "@repo/schemas";

export class UserSearchQueryDto extends createZodDto(UserSearchQuerySchema) {}
