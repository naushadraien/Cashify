import { pgTable, uuid, text, timestamp, boolean } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").unique(),
  emailVerified: boolean("email_verified").default(false),
  passwordHash: text("password_hash"), // null for accounts that only ever used OAuth
  name: text("name"),
  firstName: text("first_name"),
  lastName: text("last_name"),
  country: text("country"),
  phoneNumber: text("phone_number"),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
