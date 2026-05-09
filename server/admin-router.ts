import { Express, Request, Response } from "express";
import { getDb } from "./db";
import { subscriptions, paymentTransactions, cardTokens } from "../drizzle/schema";
import { eq, desc, sql, and, count } from "drizzle-orm";

const ADMIN_SECRET = process.env.ADMIN_SECRET || "planificadoc-admin-2026";

/**
 * Middleware to verify admin access via secret key.
 * Accepts the key as query param ?key= or header X-Admin-Key.
 */
function requireAdmin(req: Request, res: Response, next: () => void) {
  const key = (req.query.key as string) || req.headers["x-admin-key"];
  if (key !== ADMIN_SECRET) {
    res.status(401).json({ error: "No autorizado" });
    return;
  }
  next();
}

export function registerAdminRoutes(app: Express) {
  /**
   * GET /api/admin/dashboard
   * Returns summary metrics for the admin dashboard.
   */
  app.get("/api/admin/dashboard", requireAdmin, async (_req: Request, res: Response) => {
    try {
      const db = await getDb();
      if (!db) {
        res.status(500).json({ error: "Base de datos no disponible" });
        return;
      }

      // Total subscriptions by status
      const allSubs = await db.select().from(subscriptions);
      const activeSubs = allSubs.filter(s => s.status === "active");
      const expiredSubs = allSubs.filter(s => s.status === "expired");
      const cancelledSubs = allSubs.filter(s => s.status === "cancelled");
      const pastDueSubs = allSubs.filter(s => s.status === "past_due");

      // Recurring vs one-time
      const recurringSubs = activeSubs.filter(s => s.isRecurring);
      const oneTimeSubs = activeSubs.filter(s => !s.isRecurring);

      // Revenue (from approved transactions)
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

      // Plans breakdown
      const monthlyPlanActive = activeSubs.filter(s => s.plan === "monthly").length;
      const annualPlanActive = activeSubs.filter(s => s.plan === "annual").length;

      // Card tokens
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
  });

  /**
   * GET /api/admin/users
   * Returns list of all subscribers with their data.
   */
  app.get("/api/admin/users", requireAdmin, async (req: Request, res: Response) => {
    try {
      const db = await getDb();
      if (!db) {
        res.status(500).json({ error: "Base de datos no disponible" });
        return;
      }

      // Get all subscriptions with card token info
      const allSubs = await db
        .select()
        .from(subscriptions)
        .orderBy(desc(subscriptions.createdAt));

      // Get card tokens for additional user info
      const allTokens = await db.select().from(cardTokens);

      // Build user list with enriched data
      const userMap = new Map<string, any>();

      for (const sub of allSubs) {
        const email = sub.email.toLowerCase();
        if (!userMap.has(email)) {
          // Find card token info for this user
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

      res.json({
        users: userList,
        total: userList.length,
      });
    } catch (error) {
      console.error("[Admin] Users error:", error);
      res.status(500).json({ error: "Error interno" });
    }
  });

  /**
   * GET /api/admin/transactions
   * Returns recent payment transactions.
   */
  app.get("/api/admin/transactions", requireAdmin, async (req: Request, res: Response) => {
    try {
      const db = await getDb();
      if (!db) {
        res.status(500).json({ error: "Base de datos no disponible" });
        return;
      }

      const limit = parseInt(req.query.limit as string) || 50;

      const txns = await db
        .select()
        .from(paymentTransactions)
        .orderBy(desc(paymentTransactions.createdAt))
        .limit(limit);

      res.json({
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
    } catch (error) {
      console.error("[Admin] Transactions error:", error);
      res.status(500).json({ error: "Error interno" });
    }
  });

  /**
   * GET /api/subscription/status?email=xxx
   * Returns subscription status for a specific user (used by the app).
   */
  app.get("/api/subscription/details", async (req: Request, res: Response) => {
    try {
      const email = (req.query.email as string)?.trim().toLowerCase();
      if (!email) {
        res.status(400).json({ error: "Email requerido" });
        return;
      }

      const db = await getDb();
      if (!db) {
        res.status(500).json({ error: "Base de datos no disponible" });
        return;
      }

      // Get the most recent subscription
      const subs = await db
        .select()
        .from(subscriptions)
        .where(eq(subscriptions.email, email))
        .orderBy(desc(subscriptions.endDate))
        .limit(1);

      if (subs.length === 0) {
        res.json({ hasSubscription: false });
        return;
      }

      const sub = subs[0];
      const now = new Date();
      const isActive = sub.status === "active" && new Date(sub.endDate) > now;

      // Get card token info
      const token = await db
        .select()
        .from(cardTokens)
        .where(
          and(
            eq(cardTokens.email, email),
            eq(cardTokens.isActive, true)
          )
        )
        .limit(1);

      res.json({
        hasSubscription: true,
        subscription: {
          plan: sub.plan,
          status: isActive ? "active" : sub.status,
          startDate: sub.startDate,
          endDate: sub.endDate,
          isRecurring: sub.isRecurring,
          daysRemaining: isActive ? Math.ceil((new Date(sub.endDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) : 0,
        },
        cardInfo: token.length > 0 ? {
          cardBrand: token[0].cardBrand,
          lastDigits: token[0].lastDigits,
          cardHolder: token[0].cardHolder,
        } : null,
      });
    } catch (error) {
      console.error("[Subscription] Details error:", error);
      res.status(500).json({ error: "Error interno" });
    }
  });

  /**
   * POST /api/subscription/cancel-recurring
   * Cancel recurring billing for a user.
   */
  app.post("/api/subscription/cancel-recurring", async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      if (!email) {
        res.status(400).json({ error: "Email requerido" });
        return;
      }

      const db = await getDb();
      if (!db) {
        res.status(500).json({ error: "Base de datos no disponible" });
        return;
      }

      const normalizedEmail = email.trim().toLowerCase();

      // Find active recurring subscription
      const subs = await db
        .select()
        .from(subscriptions)
        .where(
          and(
            eq(subscriptions.email, normalizedEmail),
            eq(subscriptions.status, "active"),
            eq(subscriptions.isRecurring, true)
          )
        )
        .limit(1);

      if (subs.length === 0) {
        res.status(404).json({ error: "No se encontró suscripción recurrente activa" });
        return;
      }

      // Cancel recurring but keep active until endDate
      await db
        .update(subscriptions)
        .set({ isRecurring: false })
        .where(eq(subscriptions.id, subs[0].id));

      // Deactivate card token
      await db
        .update(cardTokens)
        .set({ isActive: false })
        .where(eq(cardTokens.email, normalizedEmail));

      res.json({
        success: true,
        message: "Renovación automática cancelada. Tu suscripción seguirá activa hasta " + new Date(subs[0].endDate).toLocaleDateString("es-EC"),
      });
    } catch (error) {
      console.error("[Subscription] Cancel error:", error);
      res.status(500).json({ error: "Error interno" });
    }
  });
}
