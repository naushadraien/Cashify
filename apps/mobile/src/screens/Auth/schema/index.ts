import { LoginSchema, RegisterSchema } from "@repo/schemas";

// Re-export the schemas that are shared with the backend so react-hook-form can use them.
export { LoginSchema, RegisterSchema };

// We can also extract the TypeScript types for the form data
import { z } from "zod";
export type LoginFormData = z.infer<typeof LoginSchema>;
export type RegisterFormData = z.infer<typeof RegisterSchema>;
