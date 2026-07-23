import type { VercelRequest, VercelResponse } from "@vercel/node";
import { handleCors } from "../_lib/admin-auth";
import { getDb } from "../_lib/db";
import { subscriptions } from "../../drizzle/schema";
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

    const now = new Date();
    // Buscar suscripción activa O en período de trial
    const subs = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.email, email))
      .orderBy(desc(subscriptions.endDate))
      .limit(5);

    // Considerar activo: status=active o status=trial, y endDate > now
    const validSub = subs.find(
      (s) => (s.status === "active" || s.status === ("trial" as any)) && new Date(s.endDate) > now
    );

    if (!validSub) {
      return res.json({ active: false });
    }

    res.json({
      active: true,
      plan: validSub.plan,
      endDate: validSub.endDate,
      isRecurring: validSub.isRecurring,
      isTrial: (validSub as any).isTrial || false,
      trialDaysLeft: (validSub as any).isTrial
        ? Math.ceil((new Date(validSub.endDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
        : null,
    });
  } catch (error) {
    console.error("[Payment] Status error:", error);
    res.status(500).json({ error: "Error interno" });
  }
}
