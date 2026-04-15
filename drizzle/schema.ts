import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Subscriptions table - tracks active subscriptions for users.
 * A user can have multiple subscription records (history), but only one active at a time.
 */
export const subscriptions = mysqlTable("subscriptions", {
  id: int("id").autoincrement().primaryKey(),
  /** Email used for the subscription (primary identifier for non-OAuth users) */
  email: varchar("email", { length: 320 }).notNull(),
  /** Optional link to users table if user also has OAuth */
  userId: int("userId"),
  /** Subscription plan: 'monthly' */
  plan: varchar("plan", { length: 32 }).notNull().default("monthly"),
  /** Status: active, expired, cancelled */
  status: mysqlEnum("status", ["active", "expired", "cancelled"]).default("active").notNull(),
  /** Amount paid in cents */
  amountPaid: int("amountPaid").notNull(),
  /** PayPhone transaction ID */
  transactionId: varchar("transactionId", { length: 64 }),
  /** PayPhone authorization code */
  authorizationCode: varchar("authorizationCode", { length: 64 }),
  /** Start date of the subscription period */
  startDate: timestamp("startDate").defaultNow().notNull(),
  /** End date of the subscription period */
  endDate: timestamp("endDate").notNull(),
  /** Whether this is a promotional/introductory price */
  isPromo: boolean("isPromo").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Subscription = typeof subscriptions.$inferSelect;
export type InsertSubscription = typeof subscriptions.$inferInsert;

/**
 * Payment transactions - log of all PayPhone payment attempts.
 */
export const paymentTransactions = mysqlTable("payment_transactions", {
  id: int("id").autoincrement().primaryKey(),
  /** Client-generated unique transaction ID */
  clientTransactionId: varchar("clientTransactionId", { length: 64 }).notNull().unique(),
  /** Email of the payer */
  email: varchar("email", { length: 320 }).notNull(),
  /** Amount in cents */
  amount: int("amount").notNull(),
  /** PayPhone transaction ID (set after confirmation) */
  payphoneTransactionId: int("payphoneTransactionId"),
  /** Status: pending, approved, cancelled, error */
  status: mysqlEnum("status", ["pending", "approved", "cancelled", "error"]).default("pending").notNull(),
  /** PayPhone status code */
  statusCode: int("statusCode"),
  /** PayPhone authorization code */
  authorizationCode: varchar("authorizationCode", { length: 64 }),
  /** Card type used */
  cardType: varchar("cardType", { length: 32 }),
  /** Card brand */
  cardBrand: varchar("cardBrand", { length: 128 }),
  /** Last 4 digits of card */
  lastDigits: varchar("lastDigits", { length: 8 }),
  /** Full PayPhone response JSON */
  payphoneResponse: text("payphoneResponse"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PaymentTransaction = typeof paymentTransactions.$inferSelect;
export type InsertPaymentTransaction = typeof paymentTransactions.$inferInsert;
