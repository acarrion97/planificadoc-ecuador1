import type { VercelRequest, VercelResponse } from "@vercel/node";
import { handleCors, verifyAdmin } from "../_lib/admin-auth";
import { getDb } from "../_lib/db";
import { subscriptions, cardTokens } from "../../drizzle/schema";
import { desc } from "drizzle-orm";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCors(req, res)) return;
  if (!verifyAdmin(req)) return res.status(401).json({ error: "No autorizado" });

  try {
    const db = getDb();
    if (!db) return res.status(500).json({ error: "Base de datos no disponible" });

    const allSubs = await db
      .select()
      .from(subscriptions)
      .orderBy(desc(subscriptions.createdAt));

    const allTokens = await db.select().from(cardTokens);

    const userMap = new Map<string, any>();

    for (const sub of allSubs) {
      const email = sub.email.toLowerCase();
      if (!userMap.has(email)) {
        const token = allTokens.find(t => t.email.toLowerCase() === email);
        userMap.set(email, {
          email,
          cardHolder: token?.cardHolder || "",
          documentId: token?.documentId || "",
          phoneNumber: token?.phoneNumber || "",
          currentPlan: sub.plan,
          currentStatus: sub.status,
          isRecurring: sub.isRecurring,
          startDate: sub.startDate,
          endDate: sub.endDate,
          totalPaid: 0,
          subscriptionCount: 0,
          lastPayment: sub.createdAt,
          cardBrand: token?.cardBrand || "",
          lastDigits: token?.lastDigits || "",
        });
      }
      const user = userMap.get(email)!;
      user.totalPaid += sub.amountPaid;
      user.subscriptionCount += 1;
    }

    const userList = Array.from(userMap.values());

    res.json({
      users: userList,
      total: userList.length,
    });
  } catch (error) {
    console.error("[Admin] Users error:", error);
    res.status(500).json({ error: "Error interno" });
  }
}
