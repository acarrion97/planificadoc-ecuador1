import type { VercelRequest, VercelResponse } from "@vercel/node";
import { handleCors } from "../_lib/admin-auth";
import { getDb } from "../_lib/db";
import { subscriptions, cardTokens } from "../../drizzle/schema";
import { eq, and, desc } from "drizzle-orm";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCors(req, res)) return;

  try {
    const email = (req.query.email as string)?.trim().toLowerCase();
    if (!email) {
      return res.status(400).json({ error: "Email requerido" });
    }

    const db = getDb();
    if (!db) return res.status(500).json({ error: "Base de datos no disponible" });

    const subs = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.email, email))
      .orderBy(desc(subscriptions.endDate))
      .limit(1);

    if (subs.length === 0) {
      return res.json({ hasSubscription: false });
    }

    const sub = subs[0];
    const now = new Date();
    const isActive = sub.status === "active" && new Date(sub.endDate) > now;

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
        daysRemaining: isActive
          ? Math.ceil((new Date(sub.endDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
          : 0,
      },
      cardInfo: token.length > 0
        ? {
            cardBrand: token[0].cardBrand,
            lastDigits: token[0].lastDigits,
            cardHolder: token[0].cardHolder,
          }
        : null,
    });
  } catch (error) {
    console.error("[Subscription] Details error:", error);
    res.status(500).json({ error: "Error interno" });
  }
}
