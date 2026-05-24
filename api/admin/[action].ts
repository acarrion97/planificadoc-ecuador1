import type { VercelRequest, VercelResponse } from "@vercel/node";
import { handleCors, verifyAdmin } from "../_lib/admin-auth";
import { getDb } from "../_lib/db";
import {
  subscriptions,
  paymentTransactions,
  cardTokens,
  codeActivations,
  docenteContacts,
  planificacionStats,
} from "../../drizzle/schema";
import { eq, desc, and, lt, ne, sql as drizzleSql } from "drizzle-orm";
import { pcaDocuments } from "../../drizzle/schema";

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

    // GET /api/admin/redirect-params → muestra los parámetros que PayPhone envió al responseUrl (redirect params)
    if (action === "redirect-params") {
      const limit = parseInt(req.query.limit as string) || 10;
      const txns = await db
        .select()
        .from(paymentTransactions)
        .orderBy(desc(paymentTransactions.createdAt))
        .limit(limit);
      return res.json({
        diagnostic: "Parámetros que PayPhone envió al responseUrl (redirect). Busca cardToken aquí.",
        transactions: txns.map(t => {
          let parsed: any = null;
          try { parsed = t.payphoneResponse ? JSON.parse(t.payphoneResponse) : null; } catch {}
          const isRedirectParams = parsed && ('id' in parsed || 'clientTransactionId' in parsed);
          return {
            id: t.id,
            email: t.email,
            status: t.status,
            createdAt: t.createdAt,
            hasCardTokenInRedirect: parsed ? !!parsed.cardToken : false,
            cardTokenInRedirect: parsed?.cardToken || "AUSENTE",
            allRedirectParams: isRedirectParams ? parsed : "no-es-redirect-o-ya-sobreescrito",
          };
        }),
      });
    }

    // GET /api/admin/last-payphone-response → muestra el JSON completo de PayPhone del último pago aprobado
    if (action === "last-payphone-response") {
      const limit = parseInt(req.query.limit as string) || 5;
      const txns = await db
        .select()
        .from(paymentTransactions)
        .where(eq(paymentTransactions.status, "approved"))
        .orderBy(desc(paymentTransactions.createdAt))
        .limit(limit);
      return res.json({
        diagnostic: "Respuesta completa de PayPhone para los últimos pagos aprobados",
        count: txns.length,
        transactions: txns.map(t => {
          let parsed: any = null;
          let parseError: string | null = null;
          try {
            parsed = t.payphoneResponse ? JSON.parse(t.payphoneResponse) : null;
          } catch (e: any) {
            parseError = e.message;
          }
          return {
            id: t.id,
            email: t.email,
            amountCents: t.amount,
            createdAt: t.createdAt,
            cardBrand: t.cardBrand,
            lastDigits: t.lastDigits,
            // Diagnóstico clave:
            hasCardToken: parsed ? !!parsed.cardToken : false,
            cardTokenValue: parsed ? (parsed.cardToken || "⚠️ CAMPO cardToken AUSENTE EN RESPUESTA") : "⚠️ SIN RESPUESTA GUARDADA",
            parseError,
            // Respuesta completa de PayPhone:
            payphoneResponse: parsed,
          };
        }),
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

    // GET /api/admin/diag-tokens → muestra exactamente qué campos hay en payphoneResponse de cada transacción aprobada
    if (action === "diag-tokens") {
      const approvedTxns = await db.select().from(paymentTransactions)
        .where(eq(paymentTransactions.status, "approved"))
        .orderBy(desc(paymentTransactions.createdAt))
        .limit(10);
      return res.json({
        diagnostic: "Campos en payphoneResponse de transacciones aprobadas",
        count: approvedTxns.length,
        transactions: approvedTxns.map(t => {
          let parsed: any = null;
          let keys: string[] = [];
          let parseError: string | null = null;
          try {
            parsed = t.payphoneResponse ? JSON.parse(t.payphoneResponse) : null;
            keys = parsed ? Object.keys(parsed) : [];
          } catch (e: any) { parseError = e.message; }
          return {
            id: t.id,
            email: t.email,
            createdAt: t.createdAt,
            hasCardToken: !!parsed?.cardToken,
            hasCtoken: !!parsed?.ctoken,
            cardTokenValue: parsed?.cardToken ? (parsed.cardToken as string).substring(0, 30) + "..." : "NONE",
            ctokenValue: parsed?.ctoken ? (parsed.ctoken as string).substring(0, 30) + "..." : "NONE",
            allKeys: keys,
            parseError,
            rawSnippet: t.payphoneResponse ? t.payphoneResponse.substring(0, 200) : "NULL",
          };
        }),
      });
    }

    // POST /api/admin/fix-recurring → repara suscripciones con ctoken en payphoneResponse pero isRecurring=false
    if (action === "fix-recurring") {
      const results: string[] = [];

      // 1. Ampliar columna cardToken a TEXT (por si el JWT supera 255 chars)
      try {
        await db.execute(drizzleSql.raw(`ALTER TABLE card_tokens MODIFY COLUMN cardToken TEXT NOT NULL`));
        results.push("✅ cardToken column expanded to TEXT");
      } catch (e: any) {
        results.push(`ℹ️ cardToken alter: ${e.message}`);
      }

      // 2. Buscar transacciones aprobadas con cardToken O ctoken en payphoneResponse
      const approvedTxns = await db.select().from(paymentTransactions).where(eq(paymentTransactions.status, "approved"));
      let fixed = 0;

      // Diagnostic: show what we found
      results.push(`📋 Total approved transactions: ${approvedTxns.length}`);

      for (const t of approvedTxns) {
        if (!t.payphoneResponse) { results.push(`⏭️ ${t.email}: no payphoneResponse`); continue; }
        let parsed: any;
        try { parsed = JSON.parse(t.payphoneResponse); } catch { results.push(`⏭️ ${t.email}: JSON parse error`); continue; }

        // Accept both "cardToken" (injected by our bridge) and "ctoken" (raw PayPhone redirect param)
        const tokenValue: string = parsed?.cardToken || parsed?.ctoken || "";
        if (!tokenValue) {
          results.push(`⏭️ ${t.email}: no token in response (keys: ${Object.keys(parsed || {}).join(",")})`);
          continue;
        }

        results.push(`🔑 ${t.email}: token found (${tokenValue.substring(0, 20)}...)`);

        // Check if subscription already has isRecurring=true
        const existingSubs = await db.select().from(subscriptions)
          .where(and(eq(subscriptions.email, t.email), eq(subscriptions.status, "active")))
          .orderBy(desc(subscriptions.createdAt)).limit(1);
        if (existingSubs.length > 0 && existingSubs[0].isRecurring) {
          results.push(`✓ ${t.email}: already isRecurring=true, skipping`);
          continue;
        }

        // Save card token
        try {
          const existingToken = await db.select().from(cardTokens)
            .where(and(eq(cardTokens.email, t.email), eq(cardTokens.isActive, true))).limit(1);
          if (existingToken.length > 0) {
            // Token exists but subscription not marked recurring — just update subscription
            if (existingSubs.length > 0) {
              await db.update(subscriptions).set({ isRecurring: true, cardTokenId: existingToken[0].id })
                .where(eq(subscriptions.id, existingSubs[0].id));
              results.push(`✅ ${t.email}: existing token linked + subscription set to isRecurring=true`);
              fixed++;
            } else {
              results.push(`ℹ️ ${t.email}: card token already exists but no active subscription found`);
            }
            continue;
          }

          await db.update(cardTokens).set({ isActive: false }).where(eq(cardTokens.email, t.email));
          const insertResult = await db.insert(cardTokens).values({
            email: t.email,
            cardToken: tokenValue,
            cardHolder: (t as any).cardHolder || parsed.optionalParameter4 || parsed.cardHolder || "",
            documentId: (t as any).documentId || parsed.document || parsed.documentId || "",
            phoneNumber: (t as any).phoneNumber || parsed.phoneNumber || "",
            cardBrand: t.cardBrand || parsed.cardBrand || "",
            lastDigits: t.lastDigits || parsed.lastDigits || "",
            isActive: true,
          } as any);
          const newTokenId = insertResult[0].insertId;

          // Update subscription to isRecurring=true
          if (existingSubs.length > 0) {
            await db.update(subscriptions).set({ isRecurring: true, cardTokenId: newTokenId })
              .where(eq(subscriptions.id, existingSubs[0].id));
            results.push(`✅ ${t.email}: card token saved + subscription set to isRecurring=true`);
            fixed++;
          } else {
            results.push(`⚠️ ${t.email}: card token saved but no active subscription found`);
          }
        } catch (e: any) {
          results.push(`❌ ${t.email}: ${e.message}`);
        }
      }

      return res.json({ results, fixed, message: `Reparadas ${fixed} suscripciones` });
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

    // GET /api/admin/planificacion-stats → lista usuarios con cantidad de planificaciones creadas
    if (action === "planificacion-stats") {
      // Ensure table exists
      try {
        await db.execute(drizzleSql.raw(`
          CREATE TABLE IF NOT EXISTS planificacion_stats (
            id INT AUTO_INCREMENT PRIMARY KEY,
            identifier VARCHAR(320) NOT NULL UNIQUE,
            identifierType VARCHAR(16) NOT NULL DEFAULT 'email',
            count INT NOT NULL DEFAULT 0,
            platform VARCHAR(16) NULL,
            updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
          )
        `));
      } catch (_) { /* ya existe */ }

      const stats = await db
        .select()
        .from(planificacionStats)
        .orderBy(desc(planificacionStats.count));

      const total = stats.reduce((s, r) => s + r.count, 0);
      const withAtLeastOne = stats.filter(r => r.count > 0).length;

      return res.json({
        stats,
        summary: {
          totalUsers: stats.length,
          usersWithAtLeastOne: withAtLeastOne,
          totalPlanificaciones: total,
          avgPerUser: stats.length > 0 ? (total / stats.length).toFixed(1) : "0",
        },
      });
    }

    // POST /api/admin/reset-code → elimina todas las activaciones de un código (para cuando el alumno limpia cache)
    if (action === "reset-code") {
      if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
      const { code } = req.body || {};
      if (!code) return res.status(400).json({ error: "Código requerido" });
      const codeUpper = (code as string).trim().toUpperCase();
      const existing = await db.select().from(codeActivations).where(eq(codeActivations.code, codeUpper));
      if (existing.length === 0) {
        return res.json({ success: true, deleted: 0, message: `No se encontraron activaciones para el código ${codeUpper}` });
      }
      await db.delete(codeActivations).where(eq(codeActivations.code, codeUpper));
      return res.json({
        success: true,
        deleted: existing.length,
        message: `Se eliminaron ${existing.length} activacion(es) del código ${codeUpper}. El alumno puede volver a ingresar.`,
      });
    }

    // POST /api/admin/unlock-pca → marca un documento PCA como pagado (bypass para admin/testing)
    if (action === "unlock-pca") {
      if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
      const { pcaId } = req.body || {};
      if (!pcaId) return res.status(400).json({ error: "pcaId requerido" });

      // Actualizar directamente el registro a status='paid' con datos simbólicos
      await db
        .update(pcaDocuments)
        .set({
          status: "paid",
          payphoneTransactionId: 0,
          authorizationCode: "ADMIN-BYPASS",
          amountPaid: 0,
        })
        .where(eq(pcaDocuments.id, parseInt(String(pcaId))));

      return res.json({ success: true, message: `PCA #${pcaId} desbloqueada para admin` });
    }

    return res.status(404).json({ error: "Acción no encontrada" });
  } catch (error) {
    console.error(`[Admin] Error in action '${action}':`, error);
    return res.status(500).json({ error: "Error interno" });
  }
}
