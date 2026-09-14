import { LoginSchema, RegisterSchema } from "@repo/schemas";
import { z } from "zod";

export { LoginSchema, RegisterSchema };
export type LoginFormData = z.infer<typeof LoginSchema>;
export type RegisterFormData = z.infer<typeof RegisterSchema>;
