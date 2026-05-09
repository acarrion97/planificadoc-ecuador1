import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getDb } from "../_lib/db";
import { subscriptions, cardTokens, paymentTransactions } from "../../drizzle/schema";
import { eq, and } from "drizzle-orm";

const PAYPHONE_TOKEN_CHARGE_URL = "https://pay.payphonetodoesposible.com/api/transaction/web";
const MONTHLY_PRICE_CENTS = 699;
const ANNUAL_PRICE_CENTS = 5871;
const MAX_RETRY_ATTEMPTS = 3;

/**
 * Vercel Cron Job: Process recurring billing.
 * This runs on a schedule defined in vercel.json.
 * Protected by CRON_SECRET to prevent unauthorized access.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Verify cron secret
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

  try {
    const now = new Date();
    
    // Find active recurring subscriptions that have expired
    const allRecurring = await db
      .select()
      .from(subscriptions)
      .where(
        and(
          eq(subscriptions.isRecurring, true),
          eq(subscriptions.status, "active")
        )
      );

    const dueForRenewal = allRecurring.filter(sub => new Date(sub.endDate) <= now);

    let processed = 0;
    let succeeded = 0;
    let failed = 0;

    for (const sub of dueForRenewal) {
      processed++;

      // Get card token
      const tokens = await db
        .select()
        .from(cardTokens)
        .where(
          and(
            eq(cardTokens.email, sub.email),
            eq(cardTokens.isActive, true)
          )
        )
        .limit(1);

      if (tokens.length === 0) {
        // No card token, mark as expired
        await db.update(subscriptions).set({ status: "expired" }).where(eq(subscriptions.id, sub.id));
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
            phoneNumber: token.phoneNumber,
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
          // Success - extend subscription
          const newEndDate = new Date(sub.endDate);
          newEndDate.setMonth(newEndDate.getMonth() + (sub.plan === "annual" ? 12 : 1));

          await db.update(subscriptions).set({
            endDate: newEndDate,
            failedChargeAttempts: 0,
            lastChargeAttempt: now,
          }).where(eq(subscriptions.id, sub.id));

          // Log transaction
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

          succeeded++;
        } else {
          // Failed charge
          const attempts = (sub.failedChargeAttempts || 0) + 1;
          
          if (attempts >= MAX_RETRY_ATTEMPTS) {
            await db.update(subscriptions).set({
              status: "expired",
              isRecurring: false,
              failedChargeAttempts: attempts,
              lastChargeAttempt: now,
            }).where(eq(subscriptions.id, sub.id));

            await db.update(cardTokens).set({ isActive: false }).where(eq(cardTokens.id, token.id));
          } else {
            await db.update(subscriptions).set({
              status: "past_due",
              failedChargeAttempts: attempts,
              lastChargeAttempt: now,
            }).where(eq(subscriptions.id, sub.id));
          }

          failed++;
        }
      } catch (chargeError) {
        console.error(`[Recurring] Charge error for ${sub.email}:`, chargeError);
        failed++;
      }
    }

    res.json({
      success: true,
      processed,
      succeeded,
      failed,
      timestamp: now.toISOString(),
    });
  } catch (error) {
    console.error("[Recurring] Process error:", error);
    res.status(500).json({ error: "Error processing recurring billing" });
  }
}
