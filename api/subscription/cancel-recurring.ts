import type { VercelRequest, VercelResponse } from "@vercel/node";
import { handleCors } from "../_lib/admin-auth";
import { getDb } from "../_lib/db";
import { subscriptions, cardTokens } from "../../drizzle/schema";
import { eq, and } from "drizzle-orm";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCors(req, res)) return;

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email requerido" });
    }

    const db = getDb();
    if (!db) return res.status(500).json({ error: "Base de datos no disponible" });

    const normalizedEmail = email.trim().toLowerCase();

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
      return res.status(404).json({ error: "No se encontró suscripción recurrente activa" });
    }

    await db
      .update(subscriptions)
      .set({ isRecurring: false })
      .where(eq(subscriptions.id, subs[0].id));

    await db
      .update(cardTokens)
      .set({ isActive: false })
      .where(eq(cardTokens.email, normalizedEmail));

    res.json({
      success: true,
      message:
        "Renovación automática cancelada. Tu suscripción seguirá activa hasta " +
        new Date(subs[0].endDate).toLocaleDateString("es-EC"),
    });
  } catch (error) {
    console.error("[Subscription] Cancel error:", error);
    res.status(500).json({ error: "Error interno" });
  }
}
