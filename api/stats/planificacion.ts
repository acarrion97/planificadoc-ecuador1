import type { VercelRequest, VercelResponse } from "@vercel/node";
import { handleCors } from "../_lib/admin-auth";
import { getDb } from "../_lib/db";
import { planificacionStats } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

/**
 * POST /api/stats/planificacion
 * Lightweight sync — called fire-and-forget from the app whenever the
 * planificaciones list changes.
 *
 * Body: { identifier: string, identifierType: "email"|"code", count: number, platform?: string }
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCors(req, res)) return;

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { identifier, identifierType, count, platform } = req.body || {};

  if (!identifier || count === undefined || count === null) {
    return res.status(400).json({ error: "identifier y count son requeridos" });
  }

  const id = String(identifier).trim().toLowerCase();
  const type = identifierType === "code" ? "code" : "email";
  const total = Math.max(0, parseInt(count) || 0);

  try {
    const db = getDb();
    if (!db) return res.status(500).json({ error: "DB no disponible" });

    const existing = await db
      .select()
      .from(planificacionStats)
      .where(eq(planificacionStats.identifier, id))
      .limit(1);

    if (existing.length > 0) {
      await db
        .update(planificacionStats)
        .set({ count: total, platform: platform || existing[0].platform })
        .where(eq(planificacionStats.identifier, id));
    } else {
      await db.insert(planificacionStats).values({
        identifier: id,
        identifierType: type,
        count: total,
        platform: platform || null,
      });
    }

    return res.json({ success: true });
  } catch (error) {
    console.error("[Stats] planificacion sync error:", error);
    return res.status(500).json({ error: "Error al guardar estadística" });
  }
}
