import type { VercelRequest, VercelResponse } from "@vercel/node";
import { handleCors, verifyAdmin } from "../_lib/admin-auth";
import { getDb } from "../_lib/db";
import { subscriptions, paymentTransactions, cardTokens } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCors(req, res)) return;
  if (!verifyAdmin(req)) return res.status(401).json({ error: "No autorizado" });

  try {
    const db = getDb();
    if (!db) return res.status(500).json({ error: "Base de datos no disponible" });

    const allSubs = await db.select().from(subscriptions);
    const activeSubs = allSubs.filter(s => s.status === "active");
    const expiredSubs = allSubs.filter(s => s.status === "expired");
    const cancelledSubs = allSubs.filter(s => s.status === "cancelled");
    const pastDueSubs = allSubs.filter(s => s.status === "past_due");

    const recurringSubs = activeSubs.filter(s => s.isRecurring);
    const oneTimeSubs = activeSubs.filter(s => !s.isRecurring);

    const approvedTxns = await db
      .select()
      .from(paymentTransactions)
      .where(eq(paymentTransactions.status, "approved"));

    const totalRevenue = approvedTxns.reduce((sum, t) => sum + t.amount, 0);
    const monthlyRevenue = approvedTxns
      .filter(t => {
        const txDate = new Date(t.createdAt);
        const now = new Date();
        return txDate.getMonth() === now.getMonth() && txDate.getFullYear() === now.getFullYear();
      })
      .reduce((sum, t) => sum + t.amount, 0);

    const monthlyPlanActive = activeSubs.filter(s => s.plan === "monthly").length;
    const annualPlanActive = activeSubs.filter(s => s.plan === "annual").length;

    const activeTokens = await db
      .select()
      .from(cardTokens)
      .where(eq(cardTokens.isActive, true));

    res.json({
      metrics: {
        totalSubscriptions: allSubs.length,
        activeSubscriptions: activeSubs.length,
        expiredSubscriptions: expiredSubs.length,
        cancelledSubscriptions: cancelledSubs.length,
        pastDueSubscriptions: pastDueSubs.length,
        recurringActive: recurringSubs.length,
        oneTimeActive: oneTimeSubs.length,
        monthlyPlanActive,
        annualPlanActive,
        totalRevenueCents: totalRevenue,
        monthlyRevenueCents: monthlyRevenue,
        activeCardTokens: activeTokens.length,
        totalTransactions: approvedTxns.length,
      },
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[Admin] Dashboard error:", error);
    res.status(500).json({ error: "Error interno" });
  }
}
