import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("LOB_HEAD"), // LOB_HEAD or DIRECTOR
  name: text("name").notNull(),
});

export const mrfRequests = pgTable("mrf_requests", {
  id: varchar("id").primaryKey(),
  title: text("title").notNull(),
  department: text("department").notNull(),
  entity: text("entity").notNull(),
  costCenter: text("cost_center").notNull(),
  createdBy: text("created_by").notNull(),
  positions: integer("positions").notNull(),
  salaryMin: integer("salary_min").notNull(),
  salaryMax: integer("salary_max").notNull(),
  status: text("status").notNull().default("pending"), // pending, approved, rejected, escalated
  rejectionReason: text("rejection_reason"),
  createdAt: timestamp("created_at").default(sql`now()`),
});

export const onboardingRequests = pgTable("onboarding_requests", {
  id: varchar("id").primaryKey(),
  name: text("name").notNull(),
  position: text("position").notNull(),
  department: text("department").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  ctc: integer("ctc").notNull(),
  joiningDate: text("joining_date").notNull(),
  aadhaarStatus: text("aadhaar_status").notNull().default("pending"), // verified, pending
  panStatus: text("pan_status").notNull().default("pending"),
  educationStatus: text("education_status").notNull().default("pending"),
  employmentStatus: text("employment_status").notNull().default("pending"),
  status: text("status").notNull().default("pending"), // pending, approved, rejected
  rejectionReason: text("rejection_reason"),
  createdAt: timestamp("created_at").default(sql`now()`),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  role: true,
  name: true,
});

export const insertMRFSchema = createInsertSchema(mrfRequests).omit({
  createdAt: true,
});

export const insertOnboardingSchema = createInsertSchema(onboardingRequests).omit({
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type MRFRequest = typeof mrfRequests.$inferSelect;
export type OnboardingRequest = typeof onboardingRequests.$inferSelect;
export type InsertMRF = z.infer<typeof insertMRFSchema>;
export type InsertOnboarding = z.infer<typeof insertOnboardingSchema>;
