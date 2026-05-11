import type { VercelRequest, VercelResponse } from "@vercel/node";
import { handleCors, verifyAdmin } from "../_lib/admin-auth";
import { getDb } from "../_lib/db";
import {
  subscriptions,
  paymentTransactions,
  cardTokens,
  codeActivations,
} from "../../drizzle/schema";
import { eq, desc } from "drizzle-orm";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCors(req, res)) return;
  if (!verifyAdmin(req)) return res.status(401).json({ error: "No autorizado" });

  const action = req.query.action as string;

  try {
    const db = getDb();
    if (!db) return res.status(500).json({ error: "Base de datos no disponible" });

    // GET /api/admin/panel → redirect to static admin page
    if (action === "panel") {
      const key = req.query.key as string;
      return res.redirect(302, `/admin.html?key=${encodeURIComponent(key || "")}`);
    }

    // GET /api/admin/dashboard
    if (action === "dashboard") {
      const allSubs = await db.select().from(subscriptions);
      const activeSubs = allSubs.filter(s => s.status === "active");
      const approvedTxns = await db.select().from(paymentTransactions).where(eq(paymentTransactions.status, "approved"));
      const totalRevenue = approvedTxns.reduce((sum, t) => sum + t.amount, 0);
      const now = new Date();
      const monthlyRevenue = approvedTxns
        .filter(t => {
          const d = new Date(t.createdAt);
          return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
        })
        .reduce((sum, t) => sum + t.amount, 0);
      const activeTokens = await db.select().from(cardTokens).where(eq(cardTokens.isActive, true));

      return res.json({
        metrics: {
          totalSubscriptions: allSubs.length,
          activeSubscriptions: activeSubs.length,
          expiredSubscriptions: allSubs.filter(s => s.status === "expired").length,
          cancelledSubscriptions: allSubs.filter(s => s.status === "cancelled").length,
          pastDueSubscriptions: allSubs.filter(s => s.status === "past_due").length,
          recurringActive: activeSubs.filter(s => s.isRecurring).length,
          oneTimeActive: activeSubs.filter(s => !s.isRecurring).length,
          monthlyPlanActive: activeSubs.filter(s => s.plan === "monthly").length,
          annualPlanActive: activeSubs.filter(s => s.plan === "annual").length,
          totalRevenueCents: totalRevenue,
          monthlyRevenueCents: monthlyRevenue,
          activeCardTokens: activeTokens.length,
          totalTransactions: approvedTxns.length,
        },
        lastUpdated: now.toISOString(),
      });
    }

    // GET /api/admin/users
    if (action === "users") {
      const allSubs = await db.select().from(subscriptions).orderBy(desc(subscriptions.createdAt));
      const allTokens = await db.select().from(cardTokens);
      const userMap = new Map<string, any>();
      for (const sub of allSubs) {
        const email = sub.email.toLowerCase();
        if (!userMap.has(email)) {
          const token = allTokens.find(t => t.email.toLowerCase() === email);
          userMap.set(email, {
            email,
            cardHolder: token?.cardHolder || "",
            documentId: token?.documentId || "",
            phoneNumber: token?.phoneNumber || "",
            currentPlan: sub.plan,
            currentStatus: sub.status,
            isRecurring: sub.isRecurring,
            startDate: sub.startDate,
            endDate: sub.endDate,
            totalPaid: 0,
            subscriptionCount: 0,
            lastPayment: sub.createdAt,
            cardBrand: token?.cardBrand || "",
            lastDigits: token?.lastDigits || "",
          });
        }
        const user = userMap.get(email)!;
        user.totalPaid += sub.amountPaid;
        user.subscriptionCount += 1;
      }
      const userList = Array.from(userMap.values());
      return res.json({ users: userList, total: userList.length });
    }

    // GET /api/admin/transactions
    if (action === "transactions") {
      const limit = parseInt(req.query.limit as string) || 50;
      const txns = await db.select().from(paymentTransactions).orderBy(desc(paymentTransactions.createdAt)).limit(limit);
      return res.json({
        transactions: txns.map(t => ({
          id: t.id,
          email: t.email,
          amount: t.amount,
          status: t.status,
          cardBrand: t.cardBrand,
          lastDigits: t.lastDigits,
          isRecurringCharge: t.isRecurringCharge,
          createdAt: t.createdAt,
          authorizationCode: t.authorizationCode,
        })),
        total: txns.length,
      });
    }

    // GET /api/admin/code-users
    if (action === "code-users") {
      const allActivations = await db.select().from(codeActivations).orderBy(desc(codeActivations.createdAt));
      const codeMap = new Map<string, typeof allActivations>();
      for (const act of allActivations) {
        const existing = codeMap.get(act.code) || [];
        existing.push(act);
        codeMap.set(act.code, existing);
      }
      const codeStats = Array.from(codeMap.entries()).map(([code, activations]) => ({
        code,
        totalActivations: activations.length,
        uniqueDevices: new Set(activations.map(a => a.deviceId)).size,
        uniqueIPs: new Set(activations.map(a => a.ipAddress).filter(Boolean)).size,
        uniqueEmails: new Set(activations.map(a => a.email).filter(Boolean)).size,
        possibleSharing: new Set(activations.map(a => a.deviceId)).size > 1,
        activations: activations.map(a => ({
          id: a.id,
          deviceId: a.deviceId.substring(0, 12) + "...",
          platform: a.platform,
          email: a.email,
          ipAddress: a.ipAddress,
          activatedAt: a.createdAt,
        })),
      }));
      codeStats.sort((a, b) => {
        if (a.possibleSharing && !b.possibleSharing) return -1;
        if (!a.possibleSharing && b.possibleSharing) return 1;
        return b.totalActivations - a.totalActivations;
      });
      return res.json({
        codes: codeStats,
        totalActivations: allActivations.length,
        totalCodes: codeStats.length,
        sharingAlerts: codeStats.filter(c => c.possibleSharing).length,
      });
    }

    return res.status(404).json({ error: "Acción no encontrada" });
  } catch (error) {
    console.error(`[Admin] Error in action '${action}':`, error);
    return res.status(500).json({ error: "Error interno" });
  }
}
