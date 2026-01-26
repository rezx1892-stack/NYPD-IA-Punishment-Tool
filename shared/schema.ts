import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export * from "./models/chat";

// === TABLE DEFINITIONS ===

export const offenses = pgTable("offenses", {
  id: serial("id").primaryKey(),
  code: text("code").notNull(), // e.g., "0.1"
  description: text("description").notNull(), // e.g., "No VC picture in patrol log"
  punishment: text("punishment").notNull(), // e.g., "Logged warning"
  category: text("category").notNull(), // e.g., "Category 0 - Logged Warnings" - inferred from ID grouping
});

export const logs = pgTable("logs", {
  id: serial("id").primaryKey(),
  hrId: text("hr_id").notNull(),
  userId: text("user_id").notNull(),
  ticketNumber: text("ticket_number"),
  action: text("action").notNull(), // "Punishment" or "Revoke"
  duration: text("duration"),
  offenses: text("offenses").array(), // Array of offense codes
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  generatedMessage: text("generated_message"),
});

// === BASE SCHEMAS ===
export const insertOffenseSchema = createInsertSchema(offenses).omit({ id: true });
export const insertLogSchema = createInsertSchema(logs).omit({ id: true, createdAt: true });

// === EXPLICIT API CONTRACT TYPES ===

export type Offense = typeof offenses.$inferSelect;
export type InsertOffense = z.infer<typeof insertOffenseSchema>;

export type Log = typeof logs.$inferSelect;
export type InsertLog = z.infer<typeof insertLogSchema>;

// Request types
export type CreateLogRequest = InsertLog;

// Response types
export type OffenseResponse = Offense;
export type LogResponse = Log;

// AI Generation types
export type GenerateMessageRequest = {
  hrId: string;
  userId: string;
  ticketNumber?: string;
  duration?: string;
  action: "Punishment" | "Revoke";
  offenseIds: number[]; // IDs of selected offenses
  notes?: string;
  useAi: boolean;
};

export type GenerateMessageResponse = {
  message: string;
};
