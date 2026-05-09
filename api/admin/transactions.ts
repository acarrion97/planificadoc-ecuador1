import type { VercelRequest, VercelResponse } from "@vercel/node";
import { handleCors, verifyAdmin } from "../_lib/admin-auth";
import { getDb } from "../_lib/db";
import { paymentTransactions } from "../../drizzle/schema";
import { desc } from "drizzle-orm";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCors(req, res)) return;
  if (!verifyAdmin(req)) return res.status(401).json({ error: "No autorizado" });

  try {
    const db = getDb();
    if (!db) return res.status(500).json({ error: "Base de datos no disponible" });

    const limit = parseInt(req.query.limit as string) || 50;

    const txns = await db
      .select()
      .from(paymentTransactions)
      .orderBy(desc(paymentTransactions.createdAt))
      .limit(limit);

    res.json({
      transactions: txns.map(t => ({
        id: t.id,
        email: t.email,
        amount: t.amount,
        status: t.status,
        cardBrand: t.cardBrand,
        lastDigits: t.lastDigits,
        isRecurringCharge: t.isRecurringCharge,
        createdAt: t.createdAt,
        authorizationCode: t.authorizationCode,
      })),
      total: txns.length,
    });
  } catch (error) {
    console.error("[Admin] Transactions error:", error);
    res.status(500).json({ error: "Error interno" });
  }
}
