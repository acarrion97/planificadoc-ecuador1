import { eq, and, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  users,
  subscriptions,
  paymentTransactions,
  InsertSubscription,
  InsertPaymentTransaction,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ============= Subscription Queries =============

/**
 * Get the active subscription for an email address.
 * Returns the most recent active subscription if any.
 */
export async function getActiveSubscription(email: string) {
  const db = await getDb();
  if (!db) return null;

  const now = new Date();
  const result = await db
    .select()
    .from(subscriptions)
    .where(
      and(
        eq(subscriptions.email, email.toLowerCase()),
        eq(subscriptions.status, "active")
      )
    )
    .orderBy(desc(subscriptions.endDate))
    .limit(1);

  if (result.length === 0) return null;

  const sub = result[0];
  // Check if subscription has expired
  if (new Date(sub.endDate) < now) {
    // Mark as expired
    await db
      .update(subscriptions)
      .set({ status: "expired" })
      .where(eq(subscriptions.id, sub.id));
    return null;
  }

  return sub;
}

/**
 * Create a new subscription after successful payment.
 */
export async function createSubscription(data: InsertSubscription) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(subscriptions).values({
    ...data,
    email: data.email.toLowerCase(),
  });
  return result[0].insertId;
}

// ============= Payment Transaction Queries =============

/**
 * Create a pending payment transaction.
 */
export async function createPaymentTransaction(data: InsertPaymentTransaction) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(paymentTransactions).values({
    ...data,
    email: data.email.toLowerCase(),
  });
}

/**
 * Get a payment transaction by clientTransactionId.
 */
export async function getPaymentTransaction(clientTransactionId: string) {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(paymentTransactions)
    .where(eq(paymentTransactions.clientTransactionId, clientTransactionId))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

/**
 * Update a payment transaction after PayPhone confirmation.
 */
export async function updatePaymentTransaction(
  clientTransactionId: string,
  data: {
    payphoneTransactionId?: number;
    status: "approved" | "cancelled" | "error";
    statusCode?: number;
    authorizationCode?: string;
    cardType?: string;
    cardBrand?: string;
    lastDigits?: string;
    payphoneResponse?: string;
  }
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(paymentTransactions)
    .set(data)
    .where(eq(paymentTransactions.clientTransactionId, clientTransactionId));
}

/**
 * Count how many approved subscriptions an email has had (for promo pricing).
 */
export async function countPreviousSubscriptions(email: string): Promise<number> {
  const db = await getDb();
  if (!db) return 0;

  const result = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.email, email.toLowerCase()));

  return result.length;
}
