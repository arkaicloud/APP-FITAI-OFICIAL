export * from "./models/auth";

import { pgTable, varchar, integer, boolean, timestamp, real } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const userProfiles = pgTable("user_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().unique(),
  weight: real("weight"),
  height: integer("height"),
  bodyFat: varchar("body_fat"),
  age: integer("age"),
  goal: varchar("goal"),
  gender: varchar("gender"),
  onboardingCompleted: boolean("onboarding_completed").default(false),
  trialStartDate: timestamp("trial_start_date").defaultNow(),
  isSubscribed: boolean("is_subscribed").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserProfileSchema = createInsertSchema(userProfiles).omit({
  id: true,
  createdAt: true,
});

export type InsertUserProfile = z.infer<typeof insertUserProfileSchema>;
export type UserProfile = typeof userProfiles.$inferSelect;
