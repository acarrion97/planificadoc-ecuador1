import type { VercelRequest, VercelResponse } from "@vercel/node";
import { handleCors } from "../_lib/admin-auth";
import { getDb } from "../_lib/db";
import { codeActivations } from "../../drizzle/schema";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCors(req, res)) return;

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { code, deviceId, platform, email } = req.body;
    if (!code || !deviceId) {
      return res.status(400).json({ error: "code y deviceId son requeridos" });
    }

    const db = getDb();
    if (!db) {
      return res.json({ success: true }); // Don't block user
    }

    const ipAddress =
      (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
      (req.headers["x-real-ip"] as string) ||
      "unknown";

    await db.insert(codeActivations).values({
      code: code.trim().toUpperCase(),
      deviceId: deviceId,
      platform: platform || "unknown",
      email: email?.toLowerCase() || null,
      ipAddress,
    });

    res.json({ success: true });
  } catch (error) {
    console.error("[Code] Activation log error:", error);
    res.json({ success: true }); // Don't block user
  }
}
