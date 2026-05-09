import type { VercelRequest, VercelResponse } from "@vercel/node";
import { handleCors, verifyAdmin } from "../_lib/admin-auth";
import { getDb } from "../_lib/db";
import { codeActivations } from "../../drizzle/schema";
import { desc } from "drizzle-orm";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCors(req, res)) return;
  if (!verifyAdmin(req)) return res.status(401).json({ error: "No autorizado" });

  try {
    const db = getDb();
    if (!db) return res.status(500).json({ error: "Base de datos no disponible" });

    const allActivations = await db
      .select()
      .from(codeActivations)
      .orderBy(desc(codeActivations.createdAt));

    const codeMap = new Map<string, typeof allActivations>();
    for (const act of allActivations) {
      const existing = codeMap.get(act.code) || [];
      existing.push(act);
      codeMap.set(act.code, existing);
    }

    const codeStats = Array.from(codeMap.entries()).map(([code, activations]) => {
      const uniqueDevices = new Set(activations.map(a => a.deviceId)).size;
      const uniqueIPs = new Set(activations.map(a => a.ipAddress).filter(Boolean)).size;
      const uniqueEmails = new Set(activations.map(a => a.email).filter(Boolean)).size;
      const possibleSharing = uniqueDevices > 1;

      return {
        code,
        totalActivations: activations.length,
        uniqueDevices,
        uniqueIPs,
        uniqueEmails,
        possibleSharing,
        activations: activations.map(a => ({
          id: a.id,
          deviceId: a.deviceId.substring(0, 12) + "...",
          platform: a.platform,
          email: a.email,
          ipAddress: a.ipAddress,
          activatedAt: a.createdAt,
        })),
      };
    });

    codeStats.sort((a, b) => {
      if (a.possibleSharing && !b.possibleSharing) return -1;
      if (!a.possibleSharing && b.possibleSharing) return 1;
      return b.totalActivations - a.totalActivations;
    });

    res.json({
      codes: codeStats,
      totalActivations: allActivations.length,
      totalCodes: codeStats.length,
      sharingAlerts: codeStats.filter(c => c.possibleSharing).length,
    });
  } catch (error) {
    console.error("[Admin] Code users error:", error);
    res.status(500).json({ error: "Error interno" });
  }
}
