import type { VercelRequest, VercelResponse } from "@vercel/node";
import { handleCors } from "../_lib/admin-auth";
import { getDb } from "../_lib/db";
import { codeActivations } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

const MAX_DEVICES_PER_CODE = 2;

// Códigos master: acceso ilimitado, sin registro de dispositivos.
// Se definen en la variable de entorno MASTER_CODES (separados por coma).
// Ejemplo en Vercel: MASTER_CODES=PLANIFICADOC-OWNER,OTRO-CODIGO
const MASTER_CODES: Set<string> = new Set(
  (process.env.MASTER_CODES || "")
    .split(",")
    .map((c) => c.trim().toUpperCase())
    .filter(Boolean)
);

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

    const normalizedCode = code.trim().toUpperCase();

    // ── Código master: acceso inmediato sin límite de dispositivos ──
    if (MASTER_CODES.has(normalizedCode)) {
      return res.json({ success: true, master: true });
    }

    const db = getDb();
    if (!db) {
      return res.json({ success: true, offline: true });
    }

    // Obtener todas las activaciones previas de este código
    const existingActivations = await db
      .select()
      .from(codeActivations)
      .where(eq(codeActivations.code, normalizedCode));

    const uniqueDevices = new Set(existingActivations.map(a => a.deviceId));
    const isKnownDevice = uniqueDevices.has(deviceId);

    // Dispositivo ya registrado → permitir sin contar de nuevo
    if (isKnownDevice) {
      return res.json({ success: true, known: true });
    }

    // Límite de dispositivos alcanzado → bloquear
    if (uniqueDevices.size >= MAX_DEVICES_PER_CODE) {
      return res.json({
        success: false,
        blocked: true,
        message: `Este código ya fue activado en ${MAX_DEVICES_PER_CODE} dispositivos. Si crees que es un error, contacta al administrador.`,
      });
    }

    // Nuevo dispositivo dentro del límite → registrar y permitir
    const ipAddress =
      (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
      (req.headers["x-real-ip"] as string) ||
      "unknown";

    await db.insert(codeActivations).values({
      code: normalizedCode,
      deviceId,
      platform: platform || "unknown",
      email: email?.toLowerCase() || null,
      ipAddress,
    });

    return res.json({
      success: true,
      devicesUsed: uniqueDevices.size + 1,
      devicesRemaining: MAX_DEVICES_PER_CODE - uniqueDevices.size - 1,
    });

  } catch (error) {
    console.error("[Code] Activation error:", error);
    return res.json({ success: true, offline: true });
  }
}
