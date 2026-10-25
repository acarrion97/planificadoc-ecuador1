import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { eq, and, desc, inArray } from "drizzle-orm";
import {
  subscriptions,
  paymentTransactions,
  cardTokens,
  codeActivations,
  pcaDocuments,
} from "../../drizzle/schema";
import { pgPoolConfig } from "../../shared/pg-ssl";

let _db: ReturnType<typeof drizzle> | null = null;

export function getDb() {
  // SUPABASE_DB_URL tiene prioridad y DATABASE_URL es el respaldo: así no
  // hace falta tocar ni borrar la variable vieja en Vercel, con agregar la de
  // Supabase alcanza (si no existe, manda DATABASE_URL).
  const url = process.env.SUPABASE_DB_URL || process.env.DATABASE_URL;
  if (!_db && url) {
    // Vercel serverless: un pool chico por instancia de función. El Pool no
    // abre conexiones hasta la primera query, así que getDb() sigue siendo
    // síncrono (lo usan ~105 call sites sin await).
    _db = drizzle(
      new Pool({
        ...pgPoolConfig(url),
        max: 1,
        connectionTimeoutMillis: 15000,
        idleTimeoutMillis: 30000,
      }),
    );
  }
  return _db;
}

// ============= Subscription Queries =============

/**
 * Returns trial subscriptions whose 3-day period has ended and are ready to be converted.
 */
export async function getTrialsDueForConversion() {
  const db = getDb();
  if (!db) return [];
  const now = new Date();
  const result = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.status, "trial" as any));
  return result.filter((sub) => new Date(sub.endDate) <= now);
}

export async function getActiveSubscription(email: string) {
  const db = getDb();
  if (!db) return null;

  const now = new Date();
  const result = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.email, email.toLowerCase()))
    .orderBy(desc(subscriptions.endDate))
    .limit(5);

  if (result.length === 0) return null;

  // Acepta status=active o status=trial (periodo de prueba)
  const validSub = result.find(
    (s) => (s.status === "active" || s.status === ("trial" as any)) && new Date(s.endDate) > now
  );
  if (!validSub) return null;

  return validSub;
}

export async function createSubscription(data: any) {
  const db = getDb();
  if (!db) throw new Error("Database not available");

  const result = await db
    .insert(subscriptions)
    .values({
      ...data,
      email: data.email.toLowerCase(),
    })
    .returning({ id: subscriptions.id });
  return result[0].id;
}

// ============= Payment Transaction Queries =============

export async function createPaymentTransaction(data: {
  clientTransactionId: string;
  email: string;
  amount: number;
  status: "pending" | "approved" | "cancelled" | "error";
  cardHolder?: string;
  documentId?: string;
  phoneNumber?: string;
  plan?: string;
}) {
  const db = getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(paymentTransactions).values({
    clientTransactionId: data.clientTransactionId,
    email: data.email.toLowerCase(),
    amount: data.amount,
    status: data.status,
    ...(data.cardHolder ? { cardHolder: data.cardHolder } : {}),
    ...(data.documentId ? { documentId: data.documentId } : {}),
    ...(data.phoneNumber ? { phoneNumber: data.phoneNumber } : {}),
    ...(data.plan ? { plan: data.plan } : {}),
  } as any);
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

  const result = await db
    .insert(cardTokens)
    .values({
      ...data,
      email: data.email.toLowerCase(),
      phoneNumber: phone,
    })
    .returning({ id: cardTokens.id });
  return result[0].id;
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

/**
 * Sincroniza `subscriptions.isRecurring` con la fuente de verdad: `card_tokens.isActive`.
 *
 * Regla: si el usuario TIENE token de cobro recurrente activo → su suscripción vigente
 * (active/past_due) DEBE quedar marcada como recurrente y vinculada al token.
 *
 * Se ejecuta como "trigger" desde:
 *  - Cron de Vercel `/api/recurring/process` (antes de procesar cobros).
 *  - Panel admin `/api/admin/dashboard` y `/api/admin/users` (al cargar).
 *  - Detalles de suscripción `/api/subscription/details` (app cliente).
 *
 * Es idempotente: solo escribe cuando encuentra una desincronización.
 * @returns cantidad de suscripciones corregidas (0 si no hubo cambios o hay error)
 */
export async function syncRecurringFromTokens(): Promise<number> {
  const db = getDb();
  if (!db) return 0;

  try {
    const activeTokens = await db
      .select()
      .from(cardTokens)
      .where(eq(cardTokens.isActive, true));
    if (activeTokens.length === 0) return 0;

    // Índice email (minúsculas) → token activo (solo hay uno por email)
    const tokenByEmail = new Map(activeTokens.map((t) => [t.email.toLowerCase(), t]));

    const currentSubs = await db
      .select()
      .from(subscriptions)
      .where(inArray(subscriptions.status, ["active", "past_due"]));

    let fixed = 0;
    for (const sub of currentSubs) {
      const token = tokenByEmail.get(sub.email.toLowerCase());
      if (!token) continue; // sin token activo → no es recurrente, no tocar
      if (sub.isRecurring && sub.cardTokenId === token.id) continue; // ya sincronizada

      await db
        .update(subscriptions)
        .set({ isRecurring: true, cardTokenId: token.id })
        .where(eq(subscriptions.id, sub.id));
      fixed++;
    }

    if (fixed > 0) {
      console.log(`[syncRecurring] ${fixed} suscripción(es) marcada(s) como recurrente(s) por tener token activo`);
    }
    return fixed;
  } catch (error) {
    // Nunca rompe el flujo principal: el cron/panel siguen funcionando con el flag existente
    console.error("[syncRecurring] Error sincronizando isRecurring con card_tokens:", error);
    return 0;
  }
}

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

// ============= PCA Document Queries (Serverless context) =============

export async function getPcaDocumentByClientTxId(clientTransactionId: string) {
  const db = getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(pcaDocuments)
    .where(eq(pcaDocuments.clientTransactionId, clientTransactionId))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

export async function unlockPcaDocument(data: {
  clientTransactionId: string;
  payphoneTransactionId: number;
  authorizationCode: string;
  amountPaid: number;
}): Promise<void> {
  const db = getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(pcaDocuments)
    .set({
      status: "paid",
      payphoneTransactionId: data.payphoneTransactionId,
      authorizationCode: data.authorizationCode,
      amountPaid: data.amountPaid,
    })
    .where(eq(pcaDocuments.clientTransactionId, data.clientTransactionId));
}

export async function setPcaClientTxId(id: number, clientTransactionId: string): Promise<void> {
  const db = getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(pcaDocuments)
    .set({ clientTransactionId })
    .where(eq(pcaDocuments.id, id));
}
