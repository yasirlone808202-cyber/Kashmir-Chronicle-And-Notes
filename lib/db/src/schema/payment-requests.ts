import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const paymentRequestsTable = pgTable("payment_requests", {
  id: serial("id").primaryKey(),
  userName: text("user_name").notNull(),
  userEmail: text("user_email").notNull(),
  noteId: text("note_id").notNull(),
  noteTitle: text("note_title").notNull(),
  subject: text("subject").notNull(),
  classLevel: text("class_level").notNull(),
  upiTransactionId: text("upi_transaction_id").notNull(),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertPaymentRequestSchema = createInsertSchema(paymentRequestsTable).omit({
  id: true,
  status: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertPaymentRequest = z.infer<typeof insertPaymentRequestSchema>;
export type PaymentRequest = typeof paymentRequestsTable.$inferSelect;
