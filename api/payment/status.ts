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
    const subs = await db
      .select()
      .from(subscriptions)
      .where(
        and(
          eq(subscriptions.email, email),
          eq(subscriptions.status, "active")
        )
      )
      .orderBy(desc(subscriptions.endDate))
      .limit(1);

    if (subs.length === 0) {
      return res.json({ active: false });
    }

    const sub = subs[0];
    const isActive = new Date(sub.endDate) > now;

    if (!isActive) {
      return res.json({ active: false });
    }

    res.json({
      active: true,
      plan: sub.plan,
      endDate: sub.endDate,
      isRecurring: sub.isRecurring,
    });
  } catch (error) {
    console.error("[Payment] Status error:", error);
    res.status(500).json({ error: "Error interno" });
  }
}
