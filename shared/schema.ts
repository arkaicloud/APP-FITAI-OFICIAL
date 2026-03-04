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

export const workoutLogs = pgTable("workout_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  workoutDate: varchar("workout_date").notNull(),
  workoutName: varchar("workout_name").notNull(),
  status: varchar("status").notNull().default("started"),
  durationMinutes: integer("duration_minutes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertWorkoutLogSchema = createInsertSchema(workoutLogs).omit({
  id: true,
  createdAt: true,
});

export type InsertWorkoutLog = z.infer<typeof insertWorkoutLogSchema>;
export type WorkoutLog = typeof workoutLogs.$inferSelect;

export const workoutPlans = pgTable("workout_plans", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  name: varchar("name").notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertWorkoutPlanSchema = createInsertSchema(workoutPlans).omit({
  id: true,
  createdAt: true,
});

export type InsertWorkoutPlan = z.infer<typeof insertWorkoutPlanSchema>;
export type WorkoutPlan = typeof workoutPlans.$inferSelect;

export const workoutDays = pgTable("workout_days", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  workoutPlanId: varchar("workout_plan_id").notNull(),
  name: varchar("name").notNull(),
  weekDay: varchar("week_day").notNull(),
  isRest: boolean("is_rest").default(false),
  estimatedDurationInSeconds: integer("estimated_duration_in_seconds").default(0),
  coverImageUrl: varchar("cover_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertWorkoutDaySchema = createInsertSchema(workoutDays).omit({
  id: true,
  createdAt: true,
});

export type InsertWorkoutDay = z.infer<typeof insertWorkoutDaySchema>;
export type WorkoutDay = typeof workoutDays.$inferSelect;

export const workoutExercises = pgTable("workout_exercises", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  workoutDayId: varchar("workout_day_id").notNull(),
  name: varchar("name").notNull(),
  order: integer("order").default(0),
  sets: integer("sets").notNull(),
  reps: integer("reps").notNull(),
  restTimeInSeconds: integer("rest_time_in_seconds").default(60),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertWorkoutExerciseSchema = createInsertSchema(workoutExercises).omit({
  id: true,
  createdAt: true,
});

export type InsertWorkoutExercise = z.infer<typeof insertWorkoutExerciseSchema>;
export type WorkoutExercise = typeof workoutExercises.$inferSelect;

export const workoutSessions = pgTable("workout_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  workoutDayId: varchar("workout_day_id").notNull(),
  userId: varchar("user_id").notNull(),
  startedAt: timestamp("started_at").defaultNow(),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertWorkoutSessionSchema = createInsertSchema(workoutSessions).omit({
  id: true,
  createdAt: true,
});

export type InsertWorkoutSession = z.infer<typeof insertWorkoutSessionSchema>;
export type WorkoutSession = typeof workoutSessions.$inferSelect;
