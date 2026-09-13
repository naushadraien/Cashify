import { z } from "zod";

// ---------- Path param: GET /users/:id ----------

export const UserIdParamSchema = z.object({
  id: z.string().uuid("id must be a valid UUID"),
});
export type UserIdParam = z.infer<typeof UserIdParamSchema>;

// ---------- Query params: GET /users/search?name=&email= ----------
// email is validated as a real email address and matched exactly (partial
// email search would let someone enumerate accounts by trying fragments).
// name is a free-text partial match, meant for a directory-style lookup.
// At least one of the two has to be present -- an empty search isn't valid.

export const UserSearchQuerySchema = z
  .object({
    name: z.string().trim().min(1).optional(),
    email: z
      .string()
      .trim()
      .email("email must be a valid email address")
      .optional(),
  })
  .refine((data) => !!(data.name || data.email), {
    message: "Provide at least one of name or email",
    path: ["name"],
  });
export type UserSearchQuery = z.infer<typeof UserSearchQuerySchema>;
