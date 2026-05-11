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

    const subs = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.email, email))
      .orderBy(desc(subscriptions.endDate))
      .limit(1);

    if (subs.length === 0) return res.json({ hasSubscription: false });

    const sub = subs[0];
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

  return res.status(404).json({ error: "Acción no encontrada" });
}
