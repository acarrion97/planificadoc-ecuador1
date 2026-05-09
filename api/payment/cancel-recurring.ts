import type { VercelRequest, VercelResponse } from "@vercel/node";
import { handleCors } from "../_lib/admin-auth";
import { getDb } from "../_lib/db";
import { subscriptions } from "../../drizzle/schema";
import { eq, and } from "drizzle-orm";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCors(req, res)) return;

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Email requerido" });
  }

  try {
    const db = getDb();
    if (!db) return res.status(500).json({ error: "Base de datos no disponible" });

    const normalizedEmail = email.trim().toLowerCase();

    const subs = await db
      .select()
      .from(subscriptions)
      .where(
        and(
          eq(subscriptions.email, normalizedEmail),
          eq(subscriptions.status, "active")
        )
      )
      .limit(1);

    if (subs.length === 0) {
      return res.json({ success: false, message: "No hay suscripción activa" });
    }

    await db
      .update(subscriptions)
      .set({ status: "cancelled" })
      .where(eq(subscriptions.id, subs[0].id));

    res.json({
      success: true,
      message: "Renovación automática cancelada. Tu acceso continúa hasta " + subs[0].endDate,
    });
  } catch (error) {
    console.error("[PayPhone] Cancel recurring error:", error);
    res.status(500).json({ error: "Error al cancelar renovación" });
  }
}
