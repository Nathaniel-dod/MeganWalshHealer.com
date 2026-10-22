import { pgTable, serial, text, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

export const enquiriesTable = pgTable("enquiries", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  service: text("service").notNull(),
  message: text("message").notNull(),
  consent: boolean("consent").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const insertEnquirySchema = createInsertSchema(enquiriesTable).omit({
  id: true,
  createdAt: true,
});
export type Enquiry = typeof enquiriesTable.$inferSelect;
