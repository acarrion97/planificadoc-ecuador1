/**
 * Recurring Billing Cron Job
 * 
 * This module handles automatic recurring charges for subscriptions.
 * It runs periodically (every hour) and:
 * 1. Finds active recurring subscriptions whose endDate has passed
 * 2. Charges the saved card token via PayPhone API
 * 3. On success: extends the subscription period
 * 4. On failure: marks as past_due, retries up to 3 times over 3 days
 * 5. After 3 failures: expires the subscription
 */

import {
  getSubscriptionsDueForRenewal,
  getPastDueSubscriptions,
  getActiveCardToken,
  updateSubscriptionChargeStatus,
  createPaymentTransaction,
  deactivateCardToken,
} from "./db";
import { chargeWithToken, getPriceForPlan } from "./payphone";

const MAX_RETRY_ATTEMPTS = 3;
const GRACE_PERIOD_DAYS = 3;

/**
 * Process all due recurring subscriptions.
 * Called by the cron scheduler.
 */
export async function processRecurringBilling(): Promise<{
  processed: number;
  successful: number;
  failed: number;
  expired: number;
}> {
  const stats = { processed: 0, successful: 0, failed: 0, expired: 0 };

  const payphoneToken = process.env.PAYPHONE_TOKEN || "";
  const payphoneStoreId = process.env.PAYPHONE_STORE_ID || "";

  if (!payphoneToken || !payphoneStoreId) {
    console.error("[RecurringBilling] PayPhone not configured, skipping");
    return stats;
  }

  try {
    // 1. Process subscriptions due for renewal
    const dueSubscriptions = await getSubscriptionsDueForRenewal();
    console.log(`[RecurringBilling] Found ${dueSubscriptions.length} subscriptions due for renewal`);

    for (const sub of dueSubscriptions) {
      stats.processed++;

      const cardToken = await getActiveCardToken(sub.email);
      if (!cardToken) {
        console.log(`[RecurringBilling] No active card token for ${sub.email}, marking as expired`);
        await updateSubscriptionChargeStatus(sub.id, { status: "expired" });
        stats.expired++;
        continue;
      }

      const pricing = getPriceForPlan(sub.plan as "monthly" | "annual");

      const result = await chargeWithToken({
        cardToken: cardToken.cardToken,
        cardHolder: cardToken.cardHolder,
        documentId: cardToken.documentId,
        phoneNumber: cardToken.phoneNumber,
        email: sub.email,
        amount: pricing.amount,
        storeId: payphoneStoreId,
        token: payphoneToken,
        reference: `PlanificaDoc - Renovacion automatica ${sub.plan} - ${sub.email}`,
      });

      if (result.success) {
        // Extend subscription
        const newEndDate = new Date();
        newEndDate.setMonth(newEndDate.getMonth() + pricing.durationMonths);

        await updateSubscriptionChargeStatus(sub.id, {
          status: "active",
          endDate: newEndDate,
          failedChargeAttempts: 0,
          lastChargeAttempt: new Date(),
          transactionId: String(result.transactionId || ""),
          authorizationCode: result.authorizationCode,
          amountPaid: pricing.amount,
        });

        // Log the transaction
        await createPaymentTransaction({
          clientTransactionId: `PDOC-RECUR-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          email: sub.email,
          amount: pricing.amount,
          status: "approved",
          payphoneTransactionId: result.transactionId,
          statusCode: result.statusCode,
          authorizationCode: result.authorizationCode,
          isRecurringCharge: true,
          cardTokenId: cardToken.id,
        });

        console.log(`[RecurringBilling] Successfully charged ${sub.email} for ${sub.plan}`);
        stats.successful++;
      } else {
        // Charge failed - enter grace period
        const attempts = (sub.failedChargeAttempts || 0) + 1;

        if (attempts >= MAX_RETRY_ATTEMPTS) {
          // Max retries reached - expire subscription
          await updateSubscriptionChargeStatus(sub.id, {
            status: "expired",
            failedChargeAttempts: attempts,
            lastChargeAttempt: new Date(),
          });
          console.log(`[RecurringBilling] Max retries reached for ${sub.email}, subscription expired`);
          stats.expired++;
        } else {
          // Mark as past_due (grace period)
          await updateSubscriptionChargeStatus(sub.id, {
            status: "past_due",
            failedChargeAttempts: attempts,
            lastChargeAttempt: new Date(),
          });
          console.log(`[RecurringBilling] Charge failed for ${sub.email}, attempt ${attempts}/${MAX_RETRY_ATTEMPTS}`);
          stats.failed++;
        }

        // Log the failed transaction
        await createPaymentTransaction({
          clientTransactionId: `PDOC-RECUR-FAIL-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          email: sub.email,
          amount: pricing.amount,
          status: "error",
          statusCode: result.statusCode,
          isRecurringCharge: true,
          cardTokenId: cardToken.id,
          payphoneResponse: JSON.stringify({ message: result.message }),
        });
      }
    }

    // 2. Retry past_due subscriptions (grace period retries)
    const pastDueSubs = await getPastDueSubscriptions();
    console.log(`[RecurringBilling] Found ${pastDueSubs.length} past_due subscriptions to retry`);

    for (const sub of pastDueSubs) {
      // Only retry once per day
      if (sub.lastChargeAttempt) {
        const hoursSinceLastAttempt = (Date.now() - new Date(sub.lastChargeAttempt).getTime()) / (1000 * 60 * 60);
        if (hoursSinceLastAttempt < 24) {
          continue; // Skip, too soon to retry
        }
      }

      stats.processed++;

      const cardToken = await getActiveCardToken(sub.email);
      if (!cardToken) {
        await updateSubscriptionChargeStatus(sub.id, { status: "expired" });
        stats.expired++;
        continue;
      }

      const pricing = getPriceForPlan(sub.plan as "monthly" | "annual");

      const result = await chargeWithToken({
        cardToken: cardToken.cardToken,
        cardHolder: cardToken.cardHolder,
        documentId: cardToken.documentId,
        phoneNumber: cardToken.phoneNumber,
        email: sub.email,
        amount: pricing.amount,
        storeId: payphoneStoreId,
        token: payphoneToken,
        reference: `PlanificaDoc - Reintento cobro ${sub.plan} - ${sub.email}`,
      });

      if (result.success) {
        const newEndDate = new Date();
        newEndDate.setMonth(newEndDate.getMonth() + pricing.durationMonths);

        await updateSubscriptionChargeStatus(sub.id, {
          status: "active",
          endDate: newEndDate,
          failedChargeAttempts: 0,
          lastChargeAttempt: new Date(),
          transactionId: String(result.transactionId || ""),
          authorizationCode: result.authorizationCode,
          amountPaid: pricing.amount,
        });

        console.log(`[RecurringBilling] Retry successful for ${sub.email}`);
        stats.successful++;
      } else {
        const attempts = (sub.failedChargeAttempts || 0) + 1;

        if (attempts >= MAX_RETRY_ATTEMPTS) {
          await updateSubscriptionChargeStatus(sub.id, {
            status: "expired",
            failedChargeAttempts: attempts,
            lastChargeAttempt: new Date(),
          });
          // Deactivate the card token after max failures
          await deactivateCardToken(cardToken.id);
          console.log(`[RecurringBilling] Final retry failed for ${sub.email}, subscription expired, token deactivated`);
          stats.expired++;
        } else {
          await updateSubscriptionChargeStatus(sub.id, {
            failedChargeAttempts: attempts,
            lastChargeAttempt: new Date(),
          });
          console.log(`[RecurringBilling] Retry ${attempts}/${MAX_RETRY_ATTEMPTS} failed for ${sub.email}`);
          stats.failed++;
        }
      }
    }
  } catch (error) {
    console.error("[RecurringBilling] Unexpected error:", error);
  }

  console.log(`[RecurringBilling] Complete: ${stats.processed} processed, ${stats.successful} successful, ${stats.failed} failed, ${stats.expired} expired`);
  return stats;
}

/**
 * Start the recurring billing scheduler.
 * Runs every hour to check for due subscriptions.
 */
export function startRecurringBillingScheduler() {
  const INTERVAL_MS = 60 * 60 * 1000; // 1 hour

  console.log("[RecurringBilling] Scheduler started, checking every 1 hour");

  // Run immediately on start (after 30 second delay to let DB connect)
  setTimeout(async () => {
    try {
      await processRecurringBilling();
    } catch (e) {
      console.error("[RecurringBilling] Initial run error:", e);
    }
  }, 30000);

  // Then run every hour
  setInterval(async () => {
    try {
      await processRecurringBilling();
    } catch (e) {
      console.error("[RecurringBilling] Scheduled run error:", e);
    }
  }, INTERVAL_MS);
}
