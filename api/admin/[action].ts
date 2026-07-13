import type { VercelRequest, VercelResponse } from "@vercel/node";
import axios from "axios";
import { handleCors, verifyAdmin } from "../_lib/admin-auth";
import { getDb } from "../_lib/db";
import { sendRenewalReminderEmail, sendExpiredEmail, sendPromoReactivacionEmail, sendResubscribeEmail } from "../../server/email";
import {
  subscriptions,
  paymentTransactions,
  cardTokens,
  codeActivations,
  docenteContacts,
  docenteAccounts,
  planificacionStats,
} from "../../drizzle/schema";
import { randomBytes, scrypt } from "node:crypto";
import { promisify } from "node:util";

const scryptAsync = promisify(scrypt);

async function hashPasswordAdmin(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const derived = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${salt}:${derived.toString("hex")}`;
}
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
      const allApprovedTxns = await db.select({
        email: paymentTransactions.email,
        cardHolder: paymentTransactions.cardHolder,
        documentId: paymentTransactions.documentId,
        phoneNumber: paymentTransactions.phoneNumber,
        cardBrand: paymentTransactions.cardBrand,
        lastDigits: paymentTransactions.lastDigits,
        createdAt: paymentTransactions.createdAt,
      }).from(paymentTransactions)
        .where(eq(paymentTransactions.status, "approved"))
        .orderBy(desc(paymentTransactions.createdAt));

      // Build a map of email → most recent approved txn with card data
      const txnByEmail = new Map<string, typeof allApprovedTxns[0]>();
      for (const txn of allApprovedTxns) {
        const key = txn.email.toLowerCase();
        if (!txnByEmail.has(key)) txnByEmail.set(key, txn);
      }

      const userMap = new Map<string, any>();
      for (const sub of allSubs) {
        const email = sub.email.toLowerCase();
        if (!userMap.has(email)) {
          const token = allTokens.find(t => t.email.toLowerCase() === email);
          const txn = txnByEmail.get(email);
          userMap.set(email, {
            email,
            cardHolder: token?.cardHolder || txn?.cardHolder || "",
            documentId: token?.documentId || txn?.documentId || "",
            phoneNumber: token?.phoneNumber || txn?.phoneNumber || "",
            currentPlan: sub.plan,
            currentStatus: sub.status,
            isRecurring: sub.isRecurring,
            startDate: sub.startDate,
            endDate: sub.endDate,
            totalPaid: 0,
            subscriptionCount: 0,
            payingMonths: 0,
            lastPayment: sub.createdAt,
            cardBrand: token?.cardBrand || txn?.cardBrand || "",
            lastDigits: token?.lastDigits || txn?.lastDigits || "",
          });
        }
        const user = userMap.get(email)!;
        user.totalPaid += sub.amountPaid;
        user.subscriptionCount += 1;
        // Acumular meses pagados (excluir trials y registros sin pago)
        if (sub.status !== "trial" && sub.amountPaid > 0) {
          user.payingMonths += sub.plan === "annual" ? 12 : 1;
        }
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

    // POST /api/admin/send-promo → envía campaña de reactivación a lista de emails
    if (action === "send-promo") {
      if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
      const { emails } = req.body || {};
      if (!emails || !Array.isArray(emails)) return res.status(400).json({ error: "emails[] requerido" });
      const results: { email: string; ok: boolean }[] = [];
      for (const email of emails) {
        const ok = await sendPromoReactivacionEmail(email);
        results.push({ email, ok });
      }
      const sent = results.filter(r => r.ok).length;
      return res.json({ success: true, sent, total: emails.length, results });
    }

    // POST /api/admin/send-reminder → envía email de recordatorio manual a un usuario
    if (action === "send-reminder") {
      if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
      const { email, tipo, vencimiento, plan } = req.body || {};
      if (!email) return res.status(400).json({ error: "email requerido" });
      let ok = false;
      if (tipo === "expired") {
        ok = await sendExpiredEmail(email, plan || "monthly");
      } else {
        ok = await sendRenewalReminderEmail(email, plan || "monthly", vencimiento || "mañana");
      }
      return res.json({ success: ok, email, tipo: tipo || "reminder" });
    }

    // POST /api/admin/create-docente → crea cuenta de docente + suscripción manual
    if (action === "create-docente") {
      if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
      const { email, password, nombre, endDate } = req.body || {};
      if (!email || !password || !nombre || !endDate) {
        return res.status(400).json({ error: "email, password, nombre y endDate son requeridos" });
      }

      const normalizedEmail = (email as string).trim().toLowerCase();
      const trimmedNombre = (nombre as string).trim();
      const passwordHash = await hashPasswordAdmin(password as string);
      const endDateObj = new Date(endDate as string);

      // Upsert docenteAccount (actualiza contraseña si ya existe)
      const existing = await db
        .select({ id: docenteAccounts.id })
        .from(docenteAccounts)
        .where(eq(docenteAccounts.email, normalizedEmail))
        .limit(1);

      if (existing.length > 0) {
        await db
          .update(docenteAccounts)
          .set({ passwordHash, nombre: trimmedNombre })
          .where(eq(docenteAccounts.email, normalizedEmail));
      } else {
        await db.insert(docenteAccounts).values({
          email: normalizedEmail,
          nombre: trimmedNombre,
          passwordHash,
        });
      }

      // Cancelar suscripciones activas anteriores del mismo email
      await db
        .update(subscriptions)
        .set({ status: "cancelled" })
        .where(and(eq(subscriptions.email, normalizedEmail), eq(subscriptions.status, "active")));

      // Crear nueva suscripción con la fecha de vencimiento indicada
      await db.insert(subscriptions).values({
        email: normalizedEmail,
        plan: "monthly",
        status: "active",
        amountPaid: 0,
        startDate: new Date(),
        endDate: endDateObj,
        isPromo: true,
        isRecurring: false,
      });

      return res.json({
        success: true,
        message: `✅ Cuenta creada para ${normalizedEmail}. Acceso activo hasta ${endDateObj.toLocaleDateString("es-EC")}.`,
        email: normalizedEmail,
        nombre: trimmedNombre,
        endDate: endDateObj.toISOString(),
        updated: existing.length > 0,
      });
    }

    // POST /api/admin/run-trial-migration — adds trial columns to DB (run once)
    if (action === "run-trial-migration") {
      const results: string[] = [];
      try {
        await db.execute(drizzleSql`ALTER TABLE subscriptions MODIFY COLUMN status ENUM('active','expired','cancelled','past_due','trial') NOT NULL DEFAULT 'active'`);
        results.push("✅ status enum updated (added trial)");
      } catch (e: any) { results.push("ℹ️ status enum: " + e.message); }

      try {
        await db.execute(drizzleSql`ALTER TABLE subscriptions ADD COLUMN isTrial tinyint(1) NOT NULL DEFAULT 0 AFTER isRecurring`);
        results.push("✅ isTrial column added");
      } catch (e: any) { results.push("ℹ️ isTrial: " + e.message); }

      try {
        await db.execute(drizzleSql`ALTER TABLE subscriptions ADD COLUMN trialPlan varchar(32) DEFAULT NULL AFTER isTrial`);
        results.push("✅ trialPlan column added");
      } catch (e: any) { results.push("ℹ️ trialPlan: " + e.message); }

      return res.json({ success: true, results });
    }

    // POST /api/admin/fix-email — fixes email typo in subscriptions
    if (action === "fix-email") {
      const { oldEmail, newEmail } = req.body || req.query;
      if (!oldEmail || !newEmail) return res.status(400).json({ error: "oldEmail y newEmail requeridos" });
      const old = (oldEmail as string).trim().toLowerCase();
      const next = (newEmail as string).trim().toLowerCase();
      await db.execute(drizzleSql`UPDATE subscriptions SET email = ${next} WHERE email = ${old}`);
      await db.execute(drizzleSql`UPDATE card_tokens SET email = ${next} WHERE email = ${old}`);
      await db.execute(drizzleSql`UPDATE payment_transactions SET email = ${next} WHERE email = ${old}`);
      return res.json({ success: true, message: `Email actualizado: ${old} → ${next}` });
    }

    // GET /api/admin/test-recurring-charge?email=... — prueba cobro real con log completo de PayPhone
    if (action === "test-recurring-charge") {
      const email = ((req.query.email || req.body?.email) as string)?.trim().toLowerCase();
      if (!email) return res.status(400).json({ error: "email requerido" });

      const payphoneToken = process.env.PAYPHONE_TOKEN || "";
      const payphoneStoreId = process.env.PAYPHONE_STORE_ID || "";
      const cardholderKey = process.env.PAYPHONE_CARDHOLDER_KEY || "";
      if (!payphoneToken || !payphoneStoreId) return res.status(500).json({ error: "PayPhone no configurado" });

      const token = await db.select().from(cardTokens)
        .where(and(eq(cardTokens.email, email), eq(cardTokens.isActive, true))).limit(1);
      if (token.length === 0) return res.status(404).json({ error: "No hay token de tarjeta para este email" });

      const t = token[0];
      const { createCipheriv } = await import("node:crypto");
      function encryptCH(name: string, key: string, algo: string, keyEncoding: BufferEncoding): string {
        const k = Buffer.from(key, keyEncoding);
        const c = createCipheriv(algo, k, "");
        c.setAutoPadding(true);
        return Buffer.concat([c.update(name, "utf8"), c.final()]).toString("base64");
      }
      const cardHolderName = (t.cardHolder || "TITULAR").toUpperCase();
      const enc128hex = cardholderKey ? encryptCH(cardHolderName, cardholderKey, "aes-128-ecb", "hex") : cardHolderName;
      const enc256utf8 = cardholderKey ? encryptCH(cardHolderName, cardholderKey, "aes-256-ecb", "utf8") : cardHolderName;
      // Try AES-256-ECB (utf8 key = 32 bytes) first — AES-128-ECB (hex key = 16 bytes) was "Impossible to decode"
      const encryptedHolder = enc256utf8;
      const phoneClean = (t.phoneNumber || "").replace(/^\+/, "");
      const phonePlus = t.phoneNumber?.startsWith("+") ? t.phoneNumber : "+" + (t.phoneNumber || "");
      const nameParts = (t.cardHolder || "TITULAR").trim().split(" ");
      const billTo = {
        address1: "Ecuador", address2: "", country: "EC", state: "Pichincha", locality: "Quito",
        firstName: nameParts[0] || "TITULAR", lastName: nameParts.slice(1).join(" ") || "-",
        phoneNumber: phonePlus, email, postalCode: "170150", ipAddress: "127.0.0.1",
      };
      const lineItems = [{
        productName: "Suscripcion PlanificaDoc - monthly", unitPrice: 699, quantity: 1,
        totalAmount: 699, taxAmount: 0, productSKU: "PDOC-MONTHLY", productDescription: "Renovacion recurrente PlanificaDoc",
      }];
      const baseClientTxId = `PDOC-TEST-${Date.now()}`;
      const body = {
        cardHolder: encryptedHolder,
        cardToken: t.cardToken,
        documentId: t.documentId,
        phoneNumber: phoneClean,
        email,
        amount: 699,
        amountWithoutTax: 699,
        amountWithTax: 0,
        tax: 0,
        service: null,
        tip: null,
        clientTransactionId: baseClientTxId,
        currency: "USD",
        storeId: payphoneStoreId,
        order: { billTo, lineItems },
      };

      try {
        const resp = await axios.post("https://pay.payphonetodoesposible.com/api/transaction/web", body, {
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${payphoneToken}` },
          validateStatus: () => true,
        });
        return res.json({
          httpStatus: resp.status, httpOk: resp.status >= 200 && resp.status < 300,
          response: resp.data,
          sentBody: { ...body, cardToken: body.cardToken.substring(0, 30) + "...", cardHolder: encryptedHolder },
          cardInfo: { cardHolder: t.cardHolder, documentId: t.documentId, phoneNumber: t.phoneNumber },
        });
      } catch (err: any) {
        return res.status(500).json({ error: err.message });
      }
    }

    // POST /api/admin/reset-password — cambia solo la contraseña sin tocar la suscripción
    if (action === "reset-password") {
      if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
      const { email, password } = req.body || {};
      if (!email || !password) return res.status(400).json({ error: "email y password requeridos" });
      const normalized = (email as string).trim().toLowerCase();
      const existing = await db
        .select({ id: docenteAccounts.id })
        .from(docenteAccounts)
        .where(eq(docenteAccounts.email, normalized))
        .limit(1);
      if (existing.length === 0) {
        return res.status(404).json({ error: `No existe cuenta docente para ${normalized}` });
      }
      const passwordHash = await hashPasswordAdmin(password as string);
      await db
        .update(docenteAccounts)
        .set({ passwordHash })
        .where(eq(docenteAccounts.email, normalized));
      return res.json({ success: true, message: `Contraseña actualizada para ${normalized}` });
    }

    // POST /api/admin/expire-user — expira inmediatamente las suscripciones activas de un email
    if (action === "expire-user") {
      if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
      const { email } = req.body || {};
      if (!email) return res.status(400).json({ error: "email requerido" });
      const normalized = (email as string).trim().toLowerCase();
      const result = await db.execute(
        drizzleSql`UPDATE subscriptions SET status = 'expired', endDate = NOW() WHERE email = ${normalized} AND status IN ('active', 'trial')`
      );
      return res.json({ success: true, message: `Acceso expirado para ${normalized}`, result });
    }

    // POST /api/admin/fix-sub-display — expires future-dated cancelled subs that hide the active one
    if (action === "fix-sub-display") {
      const { email } = req.body || req.query;
      if (!email) return res.status(400).json({ error: "email requerido" });
      const normalized = (email as string).trim().toLowerCase();
      // Set endDate to past for any cancelled subscriptions with future endDate
      const result = await db.execute(
        drizzleSql`UPDATE subscriptions SET endDate = '2000-01-01' WHERE email = ${normalized} AND status = 'cancelled' AND endDate > NOW()`
      );
      return res.json({ success: true, message: `Suscripciones canceladas con fecha futura corregidas para ${normalized}`, result });
    }

    // POST /api/admin/update-card-holder — rellena cardHolder/documentId/phoneNumber vacíos en cardTokens
    if (action === "update-card-holder") {
      const { email, cardHolder, documentId, phoneNumber } = req.body || req.query;
      if (!email || !cardHolder || !documentId || !phoneNumber) return res.status(400).json({ error: "email, cardHolder, documentId, phoneNumber requeridos" });
      const normalized = (email as string).trim().toLowerCase();
      const result = await db.update(cardTokens).set({
        cardHolder: (cardHolder as string).trim().toUpperCase(),
        documentId: (documentId as string).trim(),
        phoneNumber: (phoneNumber as string).trim(),
      }).where(and(eq(cardTokens.email, normalized), eq(cardTokens.isActive, true)));
      return res.json({ success: true, email: normalized, cardHolder: (cardHolder as string).trim().toUpperCase(), documentId, phoneNumber });
    }

    if (action === "user-payment-data") {
      const { email } = req.body || req.query;
      if (!email) return res.status(400).json({ error: "email requerido" });
      const normalized = (email as string).trim().toLowerCase();
      const txns = await db.select({
        cardHolder: paymentTransactions.cardHolder,
        documentId: paymentTransactions.documentId,
        phoneNumber: paymentTransactions.phoneNumber,
        status: paymentTransactions.status,
        createdAt: paymentTransactions.createdAt,
      }).from(paymentTransactions)
        .where(and(eq(paymentTransactions.email, normalized), eq(paymentTransactions.status, "approved")))
        .orderBy(desc(paymentTransactions.createdAt)).limit(3);
      const account = await db.select({ nombre: docenteAccounts.nombre })
        .from(docenteAccounts).where(eq(docenteAccounts.email, normalized)).limit(1);
      return res.json({ email: normalized, account: account[0] || null, transactions: txns });
    }

    if (action === "get-card-token") {
      const { email } = req.body || req.query;
      if (!email) return res.status(400).json({ error: "email requerido" });
      const normalized = (email as string).trim().toLowerCase();
      const tokens = await db.select().from(cardTokens).where(eq(cardTokens.email, normalized));
      return res.json({ email: normalized, tokens });
    }

    // POST /api/admin/manual-renew — extends subscription 1 month and updates cardToken after manual/test charge
    if (action === "manual-renew") {
      if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
      const { email, newCardToken, transactionId, authorizationCode, months } = req.body || {};
      if (!email) return res.status(400).json({ error: "email requerido" });
      const normalized = (email as string).trim().toLowerCase();
      const durationMonths = parseInt(months) || 1;

      const { or } = await import("drizzle-orm");
      const subs = await db.select().from(subscriptions)
        .where(and(eq(subscriptions.email, normalized), or(eq(subscriptions.status, "active"), eq(subscriptions.status, "past_due"))))
        .orderBy(desc(subscriptions.endDate)).limit(1);
      if (subs.length === 0) return res.status(404).json({ error: "No hay suscripción activa o past_due" });

      const sub = subs[0];
      const newEndDate = new Date(sub.endDate);
      newEndDate.setMonth(newEndDate.getMonth() + durationMonths);

      await db.update(subscriptions).set({
        status: "active",
        endDate: newEndDate,
        failedChargeAttempts: 0,
        ...(transactionId ? { transactionId: String(transactionId) } : {}),
        ...(authorizationCode ? { authorizationCode: String(authorizationCode) } : {}),
      }).where(eq(subscriptions.id, sub.id));

      if (newCardToken) {
        await db.update(cardTokens).set({ cardToken: newCardToken })
          .where(and(eq(cardTokens.email, normalized), eq(cardTokens.isActive, true)));
      }

      return res.json({ success: true, email: normalized, newEndDate, transactionId, authorizationCode });
    }

    // POST /api/admin/grant-access — crea cuenta + suscripción manual por N días
    if (action === "grant-access") {
      if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
      const { email, password, nombre, days, plan } = req.body || {};
      if (!email || !password) return res.status(400).json({ error: "email y password requeridos" });

      const normalizedEmail = (email as string).trim().toLowerCase();
      const trimmedNombre = (nombre as string || normalizedEmail.split("@")[0]).trim();
      const durationDays = parseInt(days) || 7;
      const subscriptionPlan = (plan as string) === "annual" ? "annual" : "monthly";

      // Crear o actualizar cuenta
      let accountCreated = false;
      const existing = await db.select({ id: docenteAccounts.id })
        .from(docenteAccounts).where(eq(docenteAccounts.email, normalizedEmail)).limit(1);

      const { randomBytes: rb, scrypt: sc } = await import("node:crypto");
      const { promisify: prom } = await import("node:util");
      const scryptAsync2 = prom(sc);
      const salt = rb(16).toString("hex");
      const derived = (await scryptAsync2(password as string, salt, 64)) as Buffer;
      const passwordHash = `${salt}:${derived.toString("hex")}`;

      if (existing.length === 0) {
        await db.insert(docenteAccounts).values({ email: normalizedEmail, nombre: trimmedNombre, passwordHash });
        accountCreated = true;
      } else {
        await db.update(docenteAccounts).set({ passwordHash, nombre: trimmedNombre }).where(eq(docenteAccounts.email, normalizedEmail));
      }

      // Expirar suscripciones activas previas
      await db.execute(
        drizzleSql`UPDATE subscriptions SET status = 'expired', endDate = NOW() WHERE email = ${normalizedEmail} AND status IN ('active', 'trial', 'past_due')`
      );

      // Crear nueva suscripción
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + durationDays);

      const { createSubscription } = await import("../_lib/db");
      await createSubscription({
        email: normalizedEmail,
        plan: subscriptionPlan,
        status: "active",
        amountPaid: 0,
        transactionId: `ADMIN-GRANT-${Date.now()}`,
        startDate,
        endDate,
        isPromo: false,
        isRecurring: false,
        isTrial: false,
        failedChargeAttempts: 0,
      });

      return res.json({
        success: true,
        email: normalizedEmail,
        nombre: trimmedNombre,
        plan: subscriptionPlan,
        accountCreated,
        durationDays,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      });
    }

    // POST /api/admin/send-resubscribe-emails — envía email de re-suscripción a los 7 usuarios con cobro fallido
    if (action === "send-resubscribe-emails") {
      if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

      const AFFECTED_EMAILS = [
        "joleidytofino@gmail.com",
        "sebas21pabon@gmail.com",
        "andres.olivo@educacion.gob.ec",
        "valentinatigre2015@gmail.com",
        "myllcreaciones@gmail.com",
        "barberankennya@gmail.com",
        "rocio.valverde@docentes.educacion.edu.ec",
      ];

      const results: { email: string; nombre: string; sent: boolean }[] = [];

      for (const email of AFFECTED_EMAILS) {
        const accounts = await db.select({ nombre: docenteAccounts.nombre })
          .from(docenteAccounts).where(eq(docenteAccounts.email, email)).limit(1);
        const nombre = accounts[0]?.nombre || email.split("@")[0];
        const sent = await sendResubscribeEmail(email, nombre);
        results.push({ email, nombre, sent });
      }

      const sentCount = results.filter(r => r.sent).length;
      return res.json({ success: true, sent: sentCount, total: AFFECTED_EMAILS.length, results });
    }

    // POST /api/admin/record-payment — registra manualmente un cobro aprobado por PayPhone que no quedó en BD
    // Úsalo cuando PayPhone muestra ✅ pero nuestra BD no tiene el registro (bug del statusCode "3" vs 3)
    if (action === "record-payment") {
      if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
      const { email, payphoneTransactionId, authorizationCode, amount, months } = req.body || {};
      if (!email || !payphoneTransactionId) return res.status(400).json({ error: "email y payphoneTransactionId requeridos" });

      const normalized = (email as string).trim().toLowerCase();
      const amountCents = parseInt(amount) || 699;
      const durationMonths = parseInt(months) || 1;

      // Obtener datos de tarjeta desde cardTokens
      const tokens = await db.select().from(cardTokens).where(eq(cardTokens.email, normalized)).limit(1);
      const token = tokens[0];

      // Insertar en paymentTransactions
      const clientTxId = `ADMIN-REC-${payphoneTransactionId}-${Date.now()}`;
      await db.insert(paymentTransactions).values({
        clientTransactionId: clientTxId,
        email: normalized,
        amount: amountCents,
        status: "approved",
        payphoneTransactionId: parseInt(payphoneTransactionId),
        authorizationCode: authorizationCode || "",
        cardBrand: token?.cardBrand || null,
        lastDigits: token?.lastDigits || null,
        cardHolder: token?.cardHolder || null,
        documentId: token?.documentId || null,
        phoneNumber: token?.phoneNumber || null,
        isRecurringCharge: true,
        payphoneResponse: JSON.stringify({ source: "manual-admin-record", payphoneTransactionId, authorizationCode }),
      });

      // Extender suscripción activa si existe, o crear nueva
      const { or } = await import("drizzle-orm");
      const subs = await db.select().from(subscriptions)
        .where(and(eq(subscriptions.email, normalized), or(eq(subscriptions.status, "active"), eq(subscriptions.status, "expired"))))
        .orderBy(desc(subscriptions.endDate)).limit(1);

      let newEndDate: Date;
      if (subs.length > 0) {
        const sub = subs[0];
        newEndDate = new Date(sub.endDate < new Date() ? new Date() : sub.endDate);
        newEndDate.setMonth(newEndDate.getMonth() + durationMonths);
        await db.update(subscriptions).set({
          status: "active",
          endDate: newEndDate,
          failedChargeAttempts: 0,
          isRecurring: !!token,
          amountPaid: amountCents,
          transactionId: String(payphoneTransactionId),
          ...(authorizationCode ? { authorizationCode: String(authorizationCode) } : {}),
        }).where(eq(subscriptions.id, sub.id));
      } else {
        newEndDate = new Date();
        newEndDate.setMonth(newEndDate.getMonth() + durationMonths);
        const { createSubscription } = await import("../_lib/db");
        await createSubscription({
          email: normalized,
          plan: "monthly",
          status: "active",
          amountPaid: amountCents,
          transactionId: String(payphoneTransactionId),
          startDate: new Date(),
          endDate: newEndDate,
          isPromo: false,
          isRecurring: !!token,
          isTrial: false,
          failedChargeAttempts: 0,
        });
      }

      return res.json({
        success: true,
        email: normalized,
        payphoneTransactionId,
        amountCents,
        newEndDate: newEndDate.toISOString(),
        clientTxId,
      });
    }

    // POST /api/admin/delete-user — borra TODOS los datos de un email de la BD
    if (action === "delete-user") {
      if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
      const { email } = req.body || {};
      if (!email) return res.status(400).json({ error: "email requerido" });
      const normalized = (email as string).trim().toLowerCase();
      const log: string[] = [];

      try {
        const r1 = await db.delete(subscriptions).where(eq(subscriptions.email, normalized));
        log.push(`subscriptions: ${(r1[0] as any)?.affectedRows ?? "?"} filas eliminadas`);
      } catch (e: any) { log.push(`subscriptions ERROR: ${e.message}`); }

      try {
        const r2 = await db.delete(cardTokens).where(eq(cardTokens.email, normalized));
        log.push(`card_tokens: ${(r2[0] as any)?.affectedRows ?? "?"} filas eliminadas`);
      } catch (e: any) { log.push(`card_tokens ERROR: ${e.message}`); }

      try {
        const r3 = await db.delete(paymentTransactions).where(eq(paymentTransactions.email, normalized));
        log.push(`payment_transactions: ${(r3[0] as any)?.affectedRows ?? "?"} filas eliminadas`);
      } catch (e: any) { log.push(`payment_transactions ERROR: ${e.message}`); }

      try {
        const r4 = await db.delete(docenteAccounts).where(eq(docenteAccounts.email, normalized));
        log.push(`docente_accounts: ${(r4[0] as any)?.affectedRows ?? "?"} filas eliminadas`);
      } catch (e: any) { log.push(`docente_accounts ERROR: ${e.message}`); }

      try {
        const r5 = await db.delete(planificacionStats).where(eq(planificacionStats.identifier, normalized));
        log.push(`planificacion_stats: ${(r5[0] as any)?.affectedRows ?? "?"} filas eliminadas`);
      } catch (e: any) { log.push(`planificacion_stats ERROR: ${e.message}`); }

      return res.json({ success: true, email: normalized, log });
    }

    return res.status(404).json({ error: "Acción no encontrada" });
  } catch (error) {
    console.error(`[Admin] Error in action '${action}':`, error);
    return res.status(500).json({ error: "Error interno" });
  }
}
