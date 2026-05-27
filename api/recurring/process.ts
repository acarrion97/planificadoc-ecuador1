import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getDb } from "../_lib/db";
import { subscriptions, cardTokens, paymentTransactions } from "../../drizzle/schema";
import { eq, and, lte, gte } from "drizzle-orm";
import {
  sendRenewalSuccessEmail,
  sendChargeFailedEmail,
  sendExpiredEmail,
  sendRenewalReminderEmail,
} from "../../server/email";

const PAYPHONE_TOKEN_CHARGE_URL = "https://pay.payphonetodoesposible.com/api/transaction/web";
const MONTHLY_PRICE_CENTS = 699;
const ANNUAL_PRICE_CENTS = 5871;
const MAX_RETRY_ATTEMPTS = 3;

function formatDate(d: Date): string {
  return d.toLocaleDateString("es-EC", { year: "numeric", month: "long", day: "numeric" });
}

function formatMonto(cents: number): string {
  return (cents / 100).toFixed(2);
}

/**
 * Vercel Cron Job: Process recurring billing + send email notifications.
 * Runs daily at 8:00 AM UTC (vercel.json: "0 8 * * *").
 * Protected by CRON_SECRET.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const authHeader = req.headers.authorization;
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const payphoneToken = process.env.PAYPHONE_TOKEN || "";
  const payphoneStoreId = process.env.PAYPHONE_STORE_ID || "";

  if (!payphoneToken || !payphoneStoreId) {
    return res.status(500).json({ error: "PayPhone not configured" });
  }

  const db = getDb();
  if (!db) return res.status(500).json({ error: "Database not available" });

  const now = new Date();
  let processed = 0, succeeded = 0, failed = 0, reminded = 0;

  try {
    // ── 1. AVISOS 7 días antes (solo Recurrente: No) ────────────────────────
    const in7Days = new Date(now);
    in7Days.setDate(in7Days.getDate() + 7);
    const in8Days = new Date(now);
    in8Days.setDate(in8Days.getDate() + 8);

    const proximos = await db
      .select()
      .from(subscriptions)
      .where(
        and(
          eq(subscriptions.status, "active"),
          eq(subscriptions.isRecurring, false),
          gte(subscriptions.endDate, in7Days),
          lte(subscriptions.endDate, in8Days)
        )
      );

    for (const sub of proximos) {
      await sendRenewalReminderEmail(sub.email, sub.plan, formatDate(new Date(sub.endDate)));
      reminded++;
      console.log(`[Cron] Aviso 7 días enviado a ${sub.email}`);
    }

    // ── 2. COBROS RECURRENTES vencidos ──────────────────────────────────────
    const dueForRenewal = await db
      .select()
      .from(subscriptions)
      .where(
        and(
          eq(subscriptions.isRecurring, true),
          eq(subscriptions.status, "active"),
          lte(subscriptions.endDate, now)
        )
      );

    for (const sub of dueForRenewal) {
      processed++;

      const tokens = await db
        .select()
        .from(cardTokens)
        .where(and(eq(cardTokens.email, sub.email), eq(cardTokens.isActive, true)))
        .limit(1);

      if (tokens.length === 0) {
        await db.update(subscriptions).set({ status: "expired" }).where(eq(subscriptions.id, sub.id));
        await sendExpiredEmail(sub.email, sub.plan);
        failed++;
        continue;
      }

      const token = tokens[0];
      const amount = sub.plan === "annual" ? ANNUAL_PRICE_CENTS : MONTHLY_PRICE_CENTS;
      const clientTxId = `PDOC-REC-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;

      try {
        const response = await fetch(PAYPHONE_TOKEN_CHARGE_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${payphoneToken}`,
          },
          body: JSON.stringify({
            cardHolder: token.cardHolder,
            cardToken: token.cardToken,
            documentId: token.documentId,
            phoneNumber: token.phoneNumber?.startsWith("+") ? token.phoneNumber : "+" + (token.phoneNumber || ""),
            email: sub.email,
            amount,
            amountWithoutTax: amount,
            amountWithTax: 0,
            tax: 0,
            service: null,
            tip: null,
            clientTransactionId: clientTxId,
            currency: "USD",
            storeId: payphoneStoreId,
            optionalParameter: `Renovacion recurrente PlanificaDoc - ${sub.plan}`,
          }),
        });

        const data = await response.json();

        if (data.statusCode === 3 && data.transactionStatus === "Approved") {
          const newEndDate = new Date(sub.endDate);
          newEndDate.setMonth(newEndDate.getMonth() + (sub.plan === "annual" ? 12 : 1));

          await db.update(subscriptions).set({
            endDate: newEndDate,
            failedChargeAttempts: 0,
            lastChargeAttempt: now,
          }).where(eq(subscriptions.id, sub.id));

          await db.insert(paymentTransactions).values({
            clientTransactionId: clientTxId,
            email: sub.email,
            amount,
            status: "approved",
            payphoneTransactionId: data.transactionId,
            authorizationCode: data.authorizationCode,
            cardBrand: token.cardBrand,
            lastDigits: token.lastDigits,
            isRecurringCharge: true,
          });

          // ✉️ Confirmación de cobro exitoso
          await sendRenewalSuccessEmail(
            sub.email,
            sub.plan,
            formatDate(newEndDate),
            formatMonto(amount)
          );

          succeeded++;
        } else {
          const attempts = (sub.failedChargeAttempts || 0) + 1;

          if (attempts >= MAX_RETRY_ATTEMPTS) {
            await db.update(subscriptions).set({
              status: "expired",
              isRecurring: false,
              failedChargeAttempts: attempts,
              lastChargeAttempt: now,
            }).where(eq(subscriptions.id, sub.id));
            await db.update(cardTokens).set({ isActive: false }).where(eq(cardTokens.id, token.id));

            // ✉️ Cobro fallido definitivo
            await sendChargeFailedEmail(sub.email, sub.plan, attempts, MAX_RETRY_ATTEMPTS);
          } else {
            await db.update(subscriptions).set({
              status: "past_due",
              failedChargeAttempts: attempts,
              lastChargeAttempt: now,
            }).where(eq(subscriptions.id, sub.id));

            // ✉️ Aviso de intento fallido
            await sendChargeFailedEmail(sub.email, sub.plan, attempts, MAX_RETRY_ATTEMPTS);
          }

          failed++;
        }
      } catch (chargeError) {
        console.error(`[Recurring] Error cobro ${sub.email}:`, chargeError);
        failed++;
      }
    }

    // ── 3. EXPIRADOS sin recurrencia (plan No-recurrente vencido hoy) ───────
    const expiredToday = await db
      .select()
      .from(subscriptions)
      .where(
        and(
          eq(subscriptions.status, "active"),
          eq(subscriptions.isRecurring, false),
          lte(subscriptions.endDate, now)
        )
      );

    for (const sub of expiredToday) {
      await db.update(subscriptions)
        .set({ status: "expired" })
        .where(eq(subscriptions.id, sub.id));

      // ✉️ Notificación de expiración
      await sendExpiredEmail(sub.email, sub.plan);
      console.log(`[Cron] Suscripción expirada: ${sub.email}`);
    }

    console.log(`[Cron] Completo: ${reminded} avisos, ${processed} cobros (${succeeded} ok / ${failed} fallidos), ${expiredToday.length} expirados`);

    res.json({
      success: true,
      reminded,
      processed,
      succeeded,
      failed,
      expired: expiredToday.length,
      timestamp: now.toISOString(),
    });
  } catch (error) {
    console.error("[Recurring] Error general:", error);
    res.status(500).json({ error: "Error procesando billing" });
  }
}
