import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  age: integer("age"),
  location: text("location"),
  avatar: text("avatar"),
  unalonScore: integer("unalon_score").default(0),
  interests: jsonb("interests").$type<string[]>().default([]),
  favoriteQuote: text("favorite_quote"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const activities = pgTable("activities", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  hostId: varchar("host_id").notNull().references(() => users.id),
  location: text("location").notNull(),
  datetime: timestamp("datetime").notNull(),
  duration: text("duration").notNull(),
  maxParticipants: integer("max_participants").notNull(),
  currentParticipants: integer("current_participants").default(0),
  vibes: jsonb("vibes").$type<string[]>().default([]),
  participantIds: jsonb("participant_ids").$type<string[]>().default([]),
  image: text("image"),
  userRequested: boolean("user_requested").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const messages = pgTable("messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  senderId: varchar("sender_id").notNull().references(() => users.id),
  receiverId: varchar("receiver_id").notNull().references(() => users.id),
  content: text("content").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
  isRead: boolean("is_read").default(false),
});

export const activityRequests = pgTable("activity_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  activityId: varchar("activity_id").notNull().references(() => activities.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  status: text("status").notNull().default("pending"), // pending, accepted, rejected
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  unalonScore: true,
});

export const insertActivitySchema = createInsertSchema(activities).omit({
  id: true,
  createdAt: true,
  currentParticipants: true,
  participantIds: true,
  userRequested: true,
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  timestamp: true,
  isRead: true,
});

export const insertActivityRequestSchema = createInsertSchema(activityRequests).omit({
  id: true,
  createdAt: true,
  status: true,
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertActivity = z.infer<typeof insertActivitySchema>;
export type Activity = typeof activities.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;
export type InsertActivityRequest = z.infer<typeof insertActivityRequestSchema>;
export type ActivityRequest = typeof activityRequests.$inferSelect;
export type LoginData = z.infer<typeof loginSchema>;
