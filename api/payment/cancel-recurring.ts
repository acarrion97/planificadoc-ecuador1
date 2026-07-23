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

    // Buscar suscripción activa o trial
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

    res.json({
      success: true,
      cancelled: isTrial ? "trial" : "subscription",
      message: isTrial
        ? "Prueba gratuita cancelada. No se realizará ningún cobro adicional."
        : "Renovación automática cancelada. Tu acceso continúa hasta " + activeSub.endDate,
    });
  } catch (error) {
    console.error("[PayPhone] Cancel recurring error:", error);
    res.status(500).json({ error: "Error al cancelar renovación" });
  }
}
