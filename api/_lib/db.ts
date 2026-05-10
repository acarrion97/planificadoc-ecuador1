import { drizzle } from "drizzle-orm/mysql2";
import { eq, and, desc } from "drizzle-orm";
import {
  subscriptions,
  paymentTransactions,
  cardTokens,
  codeActivations,
} from "../../drizzle/schema";

let _db: ReturnType<typeof drizzle> | null = null;

export function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    _db = drizzle(process.env.DATABASE_URL);
  }
  return _db;
}

// ============= Subscription Queries =============

export async function getActiveSubscription(email: string) {
  const db = getDb();
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
  if (new Date(sub.endDate) < now) {
    await db
      .update(subscriptions)
      .set({ status: "expired" })
      .where(eq(subscriptions.id, sub.id));
    return null;
  }

  return sub;
}

export async function createSubscription(data: any) {
  const db = getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(subscriptions).values({
    ...data,
    email: data.email.toLowerCase(),
  });
  return result[0].insertId;
}

// ============= Payment Transaction Queries =============

export async function createPaymentTransaction(data: any) {
  const db = getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(paymentTransactions).values({
    ...data,
    email: data.email.toLowerCase(),
  });
}

export async function getPaymentTransaction(clientTransactionId: string) {
  const db = getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(paymentTransactions)
    .where(eq(paymentTransactions.clientTransactionId, clientTransactionId))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

export async function updatePaymentTransaction(
  clientTransactionId: string,
  data: any
) {
  const db = getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(paymentTransactions)
    .set(data)
    .where(eq(paymentTransactions.clientTransactionId, clientTransactionId));
}

// ============= Card Token Queries =============

export async function saveCardToken(data: any): Promise<number> {
  const db = getDb();
  if (!db) throw new Error("Database not available");

  // Normalize phone to +593 format for recurring charges
  let phone = (data.phoneNumber || "").trim();
  if (phone && !phone.startsWith("+")) {
    phone = "+" + phone;
  }

  await db
    .update(cardTokens)
    .set({ isActive: false })
    .where(eq(cardTokens.email, data.email.toLowerCase()));

  const result = await db.insert(cardTokens).values({
    ...data,
    email: data.email.toLowerCase(),
    phoneNumber: phone,
  });
  return result[0].insertId;
}

export async function getActiveCardToken(email: string) {
  const db = getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(cardTokens)
    .where(
      and(
        eq(cardTokens.email, email.toLowerCase()),
        eq(cardTokens.isActive, true)
      )
    )
    .orderBy(desc(cardTokens.createdAt))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

// ============= Recurring Billing Queries =============

export async function getSubscriptionsDueForRenewal() {
  const db = getDb();
  if (!db) return [];

  const now = new Date();
  const result = await db
    .select()
    .from(subscriptions)
    .where(
      and(
        eq(subscriptions.isRecurring, true),
        eq(subscriptions.status, "active")
      )
    );

  return result.filter((sub) => new Date(sub.endDate) <= now);
}

export async function getPastDueSubscriptions() {
  const db = getDb();
  if (!db) return [];

  return db
    .select()
    .from(subscriptions)
    .where(
      and(
        eq(subscriptions.isRecurring, true),
        eq(subscriptions.status, "past_due")
      )
    );
}

export async function updateSubscriptionChargeStatus(id: number, data: any) {
  const db = getDb();
  if (!db) throw new Error("Database not available");

  await db.update(subscriptions).set(data).where(eq(subscriptions.id, id));
}

export async function deactivateCardToken(id: number) {
  const db = getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(cardTokens)
    .set({ isActive: false })
    .where(eq(cardTokens.id, id));
}
