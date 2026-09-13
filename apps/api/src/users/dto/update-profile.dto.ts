import { createZodDto } from "nestjs-zod";
import { UpdateProfileSchema } from "@repo/schemas";

export class UpdateProfileDto extends createZodDto(UpdateProfileSchema) {}
