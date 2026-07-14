// api/payphone/track.ts
// El frontend llama aquí JUSTO ANTES de que el usuario interactúe con PayPhone.
// Guarda _fbp/_fbc + IP + user-agent + monto asociados al clientTransactionId.

import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getDb } from "../_lib/db";
import { paymentAttribution } from "../../drizzle/schema";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const b = (req.body ?? {}) as Record<string, any>;

  if (!b.clientTxId || !b.eventId || b.value == null) {
    return res.status(400).json({ error: "clientTxId, eventId y value son requeridos" });
  }

  const db = getDb();
  if (!db) return res.status(500).json({ error: "Base de datos no disponible" });

  const clientIp =
    (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
    (req.socket?.remoteAddress ?? null);
  const userAgent = (req.headers["user-agent"] as string) || null;

  await db
    .insert(paymentAttribution)
    .values({
      clientTxId: String(b.clientTxId),
      eventId:    String(b.eventId),
      valueCents: Math.round(Number(b.value) * 100),
      currency:   b.currency  || "USD",
      fbp:        b.fbp       ?? null,
      fbc:        b.fbc       ?? null,
      clientIp,
      userAgent,
      email:      b.email     ?? null,
      phone:      b.phone     ?? null,
      userId:     b.userId    ?? null,
      sourceUrl:  b.sourceUrl ?? null,
    })
    .onDuplicateKeyUpdate({
      set: {
        eventId:    String(b.eventId),
        valueCents: Math.round(Number(b.value) * 100),
        fbp:        b.fbp ?? null,
        fbc:        b.fbc ?? null,
        clientIp,
        userAgent,
      },
    });

  return res.json({ ok: true });
}
