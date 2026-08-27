import type { VercelRequest, VercelResponse } from "@vercel/node";
import { handleCors } from "../_lib/admin-auth";
import { getDb } from "../_lib/db";
import { subscriptions, cardTokens } from "../../drizzle/schema";
import { eq, and, desc } from "drizzle-orm";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCors(req, res)) return;

  const action = req.query.action as string;
  const db = getDb();
  if (!db) return res.status(500).json({ error: "Base de datos no disponible" });

  // GET /api/subscription/details?email=...
  if (action === "details") {
    const email = (req.query.email as string)?.trim().toLowerCase();
    if (!email) return res.status(400).json({ error: "Email requerido" });

    // First try to find an active subscription; fallback to latest by endDate
    const activeSubs = await db
      .select()
      .from(subscriptions)
      .where(and(eq(subscriptions.email, email), eq(subscriptions.status, "active")))
      .orderBy(desc(subscriptions.endDate))
      .limit(1);

    const allSubs = activeSubs.length > 0 ? activeSubs : await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.email, email))
      .orderBy(desc(subscriptions.endDate))
      .limit(1);

    if (allSubs.length === 0) return res.json({ hasSubscription: false });

    const sub = allSubs[0];
    const now = new Date();
    const isActive = sub.status === "active" && new Date(sub.endDate) > now;

    const token = await db
      .select()
      .from(cardTokens)
      .where(and(eq(cardTokens.email, email), eq(cardTokens.isActive, true)))
      .limit(1);

    return res.json({
      hasSubscription: true,
      subscription: {
        plan: sub.plan,
        status: isActive ? "active" : sub.status,
        startDate: sub.startDate,
        endDate: sub.endDate,
        isRecurring: sub.isRecurring,
        daysRemaining: isActive
          ? Math.ceil((new Date(sub.endDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
          : 0,
      },
      cardInfo: token.length > 0
        ? { cardBrand: token[0].cardBrand, lastDigits: token[0].lastDigits, cardHolder: token[0].cardHolder }
        : null,
    });
  }

  // POST /api/subscription/cancel-recurring
  if (action === "cancel-recurring") {
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email requerido" });

    const normalizedEmail = email.trim().toLowerCase();
    const subs = await db
      .select()
      .from(subscriptions)
      .where(and(
        eq(subscriptions.email, normalizedEmail),
        eq(subscriptions.status, "active"),
        eq(subscriptions.isRecurring, true)
      ))
      .limit(1);

    if (subs.length === 0) {
      return res.status(404).json({ error: "No se encontró suscripción recurrente activa" });
    }

    await db.update(subscriptions).set({ isRecurring: false }).where(eq(subscriptions.id, subs[0].id));
    await db.update(cardTokens).set({ isActive: false }).where(eq(cardTokens.email, normalizedEmail));

    return res.json({
      success: true,
      message: "Renovación automática cancelada. Tu suscripción seguirá activa hasta " +
        new Date(subs[0].endDate).toLocaleDateString("es-EC"),
    });
  }

  // GET /api/subscription/status?email=...
  if (action === "status") {
    const email = (req.query.email as string)?.trim().toLowerCase();
    if (!email) return res.status(400).json({ error: "Email requerido" });

    const now = new Date();
    const subs = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.email, email))
      .orderBy(desc(subscriptions.endDate))
      .limit(5);

    const validSub = subs.find(
      (s) => (s.status === "active" || s.status === ("trial" as any)) && new Date(s.endDate) > now
    );

    if (!validSub) {
      return res.json({ active: false });
    }

    return res.json({
      active: true,
      plan: validSub.plan,
      endDate: validSub.endDate,
      isRecurring: validSub.isRecurring,
      isTrial: (validSub as any).isTrial || false,
      trialDaysLeft: (validSub as any).isTrial
        ? Math.ceil((new Date(validSub.endDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
        : null,
    });
  }

  // POST /api/subscription/cancel  (cancel entire subscription/trial)
  if (action === "cancel") {
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email requerido" });

    const normalizedEmail = email.trim().toLowerCase();
    const allSubs = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.email, normalizedEmail))
      .limit(5);

    const now = new Date();
    const activeSub = allSubs.find(
      (s) => (s.status === "active" || s.status === ("trial" as any)) && new Date(s.endDate) > now
    );

    if (!activeSub) {
      return res.json({ success: false, message: "No hay suscripción activa" });
    }

    const isTrial = (activeSub as any).isTrial || activeSub.status === "trial";

    await db
      .update(subscriptions)
      .set({ status: "cancelled" })
      .where(eq(subscriptions.id, activeSub.id));

    return res.json({
      success: true,
      cancelled: isTrial ? "trial" : "subscription",
      message: isTrial
        ? "Prueba gratuita cancelada. No se realizará ningún cobro adicional."
        : "Renovación automática cancelada. Tu acceso continúa hasta " + activeSub.endDate,
    });
  }

  return res.status(404).json({ error: "Acción no encontrada" });
}
