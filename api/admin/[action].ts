import type { VercelRequest, VercelResponse } from "@vercel/node";
import { handleCors, verifyAdmin } from "../_lib/admin-auth";
import { getDb } from "../_lib/db";
import {
  subscriptions,
  paymentTransactions,
  cardTokens,
  codeActivations,
  docenteContacts,
} from "../../drizzle/schema";
import { eq, desc, and, lt, ne, sql as drizzleSql } from "drizzle-orm";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCors(req, res)) return;
  if (!verifyAdmin(req)) return res.status(401).json({ error: "No autorizado" });

  const action = req.query.action as string;

  try {
    const db = getDb();
    if (!db) return res.status(500).json({ error: "Base de datos no disponible" });

    // GET /api/admin/panel → redirect to static admin page
    if (action === "panel") {
      const key = req.query.key as string;
      return res.redirect(302, `/admin.html?key=${encodeURIComponent(key || "")}`);
    }

    // GET /api/admin/dashboard
    if (action === "dashboard") {
      const allSubs = await db.select().from(subscriptions);
      const activeSubs = allSubs.filter(s => s.status === "active");
      const approvedTxns = await db.select().from(paymentTransactions).where(eq(paymentTransactions.status, "approved"));
      const totalRevenue = approvedTxns.reduce((sum, t) => sum + t.amount, 0);
      const now = new Date();
      const monthlyRevenue = approvedTxns
        .filter(t => {
          const d = new Date(t.createdAt);
          return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
        })
        .reduce((sum, t) => sum + t.amount, 0);
      const activeTokens = await db.select().from(cardTokens).where(eq(cardTokens.isActive, true));

      return res.json({
        metrics: {
          totalSubscriptions: allSubs.length,
          activeSubscriptions: activeSubs.length,
          expiredSubscriptions: allSubs.filter(s => s.status === "expired").length,
          cancelledSubscriptions: allSubs.filter(s => s.status === "cancelled").length,
          pastDueSubscriptions: allSubs.filter(s => s.status === "past_due").length,
          recurringActive: activeSubs.filter(s => s.isRecurring).length,
          oneTimeActive: activeSubs.filter(s => !s.isRecurring).length,
          monthlyPlanActive: activeSubs.filter(s => s.plan === "monthly").length,
          annualPlanActive: activeSubs.filter(s => s.plan === "annual").length,
          totalRevenueCents: totalRevenue,
          monthlyRevenueCents: monthlyRevenue,
          activeCardTokens: activeTokens.length,
          totalTransactions: approvedTxns.length,
        },
        lastUpdated: now.toISOString(),
      });
    }

    // GET /api/admin/users
    if (action === "users") {
      const allSubs = await db.select().from(subscriptions).orderBy(desc(subscriptions.createdAt));
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
      return res.json({ users: userList, total: userList.length });
    }

    // GET /api/admin/transactions
    if (action === "transactions") {
      const limit = parseInt(req.query.limit as string) || 50;
      const txns = await db.select().from(paymentTransactions).orderBy(desc(paymentTransactions.createdAt)).limit(limit);
      return res.json({
        transactions: txns.map(t => ({
          id: t.id,
          email: t.email,
          phoneNumber: (t as any).phoneNumber || "",
          cardHolder: (t as any).cardHolder || "",
          documentId: (t as any).documentId || "",
          plan: (t as any).plan || (t.amount >= 5871 ? "annual" : "monthly"),
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
    }

    // GET /api/admin/code-users
    if (action === "code-users") {
      const allActivations = await db.select().from(codeActivations).orderBy(desc(codeActivations.createdAt));
      const codeMap = new Map<string, typeof allActivations>();
      for (const act of allActivations) {
        const existing = codeMap.get(act.code) || [];
        existing.push(act);
        codeMap.set(act.code, existing);
      }
      const codeStats = Array.from(codeMap.entries()).map(([code, activations]) => ({
        code,
        totalActivations: activations.length,
        uniqueDevices: new Set(activations.map(a => a.deviceId)).size,
        uniqueIPs: new Set(activations.map(a => a.ipAddress).filter(Boolean)).size,
        uniqueEmails: new Set(activations.map(a => a.email).filter(Boolean)).size,
        possibleSharing: new Set(activations.map(a => a.deviceId)).size > 1,
        activations: activations.map(a => ({
          id: a.id,
          deviceId: a.deviceId.substring(0, 12) + "...",
          platform: a.platform,
          email: a.email,
          ipAddress: a.ipAddress,
          activatedAt: a.createdAt,
        })),
      }));
      codeStats.sort((a, b) => {
        if (a.possibleSharing && !b.possibleSharing) return -1;
        if (!a.possibleSharing && b.possibleSharing) return 1;
        return b.totalActivations - a.totalActivations;
      });
      return res.json({
        codes: codeStats,
        totalActivations: allActivations.length,
        totalCodes: codeStats.length,
        sharingAlerts: codeStats.filter(c => c.possibleSharing).length,
      });
    }

    // GET /api/admin/migrate-contact-fields
    // Agrega columnas de contacto a payment_transactions y crea tabla docente_accounts
    if (action === "migrate-contact-fields") {
      const alterStatements = [
        `ALTER TABLE payment_transactions ADD COLUMN IF NOT EXISTS cardHolder VARCHAR(255) NULL`,
        `ALTER TABLE payment_transactions ADD COLUMN IF NOT EXISTS documentId VARCHAR(20) NULL`,
        `ALTER TABLE payment_transactions ADD COLUMN IF NOT EXISTS phoneNumber VARCHAR(20) NULL`,
        `ALTER TABLE payment_transactions ADD COLUMN IF NOT EXISTS plan VARCHAR(16) NULL`,
        `CREATE TABLE IF NOT EXISTS docente_accounts (
          id INT AUTO_INCREMENT PRIMARY KEY,
          email VARCHAR(320) NOT NULL UNIQUE,
          nombre VARCHAR(255) NOT NULL,
          passwordHash VARCHAR(512) NOT NULL,
          createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
          updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL
        )`,
        `CREATE TABLE IF NOT EXISTS docente_contacts (
          id INT AUTO_INCREMENT PRIMARY KEY,
          code VARCHAR(64) NOT NULL,
          nombre VARCHAR(255) NOT NULL,
          email VARCHAR(320) NULL,
          phoneNumber VARCHAR(20) NULL,
          institucion VARCHAR(255) NULL,
          pago BOOLEAN NOT NULL DEFAULT FALSE,
          montoCobrado INT NOT NULL DEFAULT 0,
          notas TEXT NULL,
          createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
        )`,
      ];
      const results: string[] = [];
      for (const stmt of alterStatements) {
        try {
          await db.execute(drizzleSql.raw(stmt));
          results.push(`✅ ${stmt.substring(0, 70)}`);
        } catch (e: any) {
          results.push(`❌ ${e.message}`);
        }
      }
      return res.json({ results, message: "Migración completada" });
    }

    // DELETE /api/admin/cleanup-pending
    // Borra transacciones pending con más de 24h de antigüedad (pagos abandonados/pruebas)
    if (action === "cleanup-pending") {
      const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24h atrás
      const pending = await db
        .select()
        .from(paymentTransactions)
        .where(eq(paymentTransactions.status, "pending"));

      const toDelete = pending.filter(t => new Date(t.createdAt) < cutoff);
      let deleted = 0;
      for (const tx of toDelete) {
        await db.delete(paymentTransactions).where(eq(paymentTransactions.id, tx.id));
        deleted++;
      }
      return res.json({
        deleted,
        message: `Se eliminaron ${deleted} transacciones pendientes antiguas (>${24}h).`,
      });
    }

    // GET /api/admin/docente-contacts → lista todos los contactos registrados manualmente
    if (action === "docente-contacts") {
      const contacts = await db
        .select()
        .from(docenteContacts)
        .orderBy(desc(docenteContacts.createdAt));
      return res.json({ contacts, total: contacts.length });
    }

    // POST /api/admin/docente-contacts → crea o actualiza un contacto
    if (action === "save-docente-contact") {
      if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
      const { id, code, nombre, email, phoneNumber, institucion, pago, montoCobrado, notas } = req.body || {};
      if (!code || !nombre) return res.status(400).json({ error: "Código y nombre son requeridos" });

      if (id) {
        // Update
        await db.update(docenteContacts).set({
          code: (code as string).trim().toUpperCase(),
          nombre: (nombre as string).trim(),
          email: email ? (email as string).trim().toLowerCase() : null,
          phoneNumber: phoneNumber ? (phoneNumber as string).trim() : null,
          institucion: institucion ? (institucion as string).trim() : null,
          pago: !!pago,
          montoCobrado: parseInt(montoCobrado || "0") || 0,
          notas: notas ? (notas as string).trim() : null,
        }).where(eq(docenteContacts.id, parseInt(id)));
        return res.json({ success: true, updated: true });
      } else {
        // Create
        await db.insert(docenteContacts).values({
          code: (code as string).trim().toUpperCase(),
          nombre: (nombre as string).trim(),
          email: email ? (email as string).trim().toLowerCase() : null,
          phoneNumber: phoneNumber ? (phoneNumber as string).trim() : null,
          institucion: institucion ? (institucion as string).trim() : null,
          pago: !!pago,
          montoCobrado: parseInt(montoCobrado || "0") || 0,
          notas: notas ? (notas as string).trim() : null,
        });
        return res.json({ success: true, created: true });
      }
    }

    // POST /api/admin/delete-docente-contact → elimina un contacto
    if (action === "delete-docente-contact") {
      if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
      const { id } = req.body || {};
      if (!id) return res.status(400).json({ error: "ID requerido" });
      await db.delete(docenteContacts).where(eq(docenteContacts.id, parseInt(id)));
      return res.json({ success: true });
    }

    return res.status(404).json({ error: "Acción no encontrada" });
  } catch (error) {
    console.error(`[Admin] Error in action '${action}':`, error);
    return res.status(500).json({ error: "Error interno" });
  }
}
