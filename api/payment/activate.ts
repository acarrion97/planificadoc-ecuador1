import type { VercelRequest, VercelResponse } from "@vercel/node";
import { eq } from "drizzle-orm";
import { handleCors } from "../_lib/admin-auth";
import {
  getPaymentTransaction,
  updatePaymentTransaction,
  createSubscription,
  saveCardToken,
  getPcaDocumentByClientTxId,
  unlockPcaDocument,
  getDb,
} from "../_lib/db";
import { paymentAttribution } from "../../drizzle/schema";
import { sendTrialStartedEmail } from "../../server/email";
import { sendMetaPurchase } from "../../server/meta-capi";

const MONTHLY_PRICE_CENTS = 699;
const ANNUAL_PRICE_CENTS = 5871;

async function fireMetaCapi(clientTxId: string, valueCents: number, txEmail?: string) {
  try {
    // Intentar obtener datos de atribución (fbp/fbc) — opcionales, mejoran match quality
    let row: typeof paymentAttribution.$inferSelect | undefined;
    try {
      const db = getDb();
      if (db) {
        const rows = await db.select().from(paymentAttribution).where(eq(paymentAttribution.clientTxId, clientTxId));
        row = rows[0];
        if (row?.sent) {
          console.log(`[Meta CAPI] Ya enviado para clientTxId=${clientTxId}, saltando`);
          return;
        }
      }
    } catch (dbErr) {
      console.warn("[Meta CAPI] No se pudo leer payment_attribution, disparando sin fbp/fbc:", dbErr);
    }

    // Siempre disparar aunque no haya fila de atribución
    const eventId = row?.eventId ?? `evt_${clientTxId}`;
    await sendMetaPurchase({
      eventId,
      value: valueCents / 100,
      currency: "USD",
      eventSourceUrl: row?.sourceUrl ?? "https://planificadoc.website/pago",
      fbp: row?.fbp ?? null,
      fbc: row?.fbc ?? null,
      clientIp: row?.clientIp ?? null,
      userAgent: row?.userAgent ?? null,
      email: row?.email ?? txEmail ?? null,
      externalId: row?.userId ?? null,
    });

    // Marcar como enviado si teníamos fila
    if (row) {
      const db = getDb();
      if (db) await db.update(paymentAttribution).set({ sent: true }).where(eq(paymentAttribution.clientTxId, clientTxId));
    }

    console.log(`[Meta CAPI] Purchase enviado clientTxId=${clientTxId} value=$${(valueCents / 100).toFixed(2)} fbp=${row?.fbp ?? "none"}`);
  } catch (e) {
    console.error("[Meta CAPI] fireMetaCapi error:", e);
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCors(req, res)) return;

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { clientTxId, confirmData, tokenData } = req.body;

  if (!clientTxId || !confirmData) {
    return res.status(400).json({ error: "Datos faltantes" });
  }

  try {
    const tx = await getPaymentTransaction(clientTxId);
    if (!tx) {
      return res.status(404).json({ error: "Transaccion no encontrada" });
    }

    if (tx.status === "approved") {
      return res.json({ success: true, message: "Suscripcion ya activada" });
    }

    // Log FULL PayPhone response to Vercel logs for diagnostics
    console.log("[PayPhone] Activate - FULL confirm data keys:", Object.keys(confirmData || {}));
    console.log("[PayPhone] Activate - statusCode:", confirmData?.statusCode, "transactionStatus:", confirmData?.transactionStatus);
    console.log("[PayPhone] Activate - cardToken present:", !!confirmData?.cardToken, "value:", confirmData?.cardToken || "NONE");
    console.log("[PayPhone] Activate - generateToken field:", confirmData?.generateToken);
    console.log("[PayPhone] Activate - FULL JSON:", JSON.stringify(confirmData));

    // ── Detect payment type ──
    const isPcaPayment = tx.plan === "pca";
    const isTrialPayment = (tx.plan || "").startsWith("trial-");
    const trialPlan = isTrialPayment ? (tx.plan || "").replace("trial-", "") : null; // "monthly" | "annual"

    if (Number(confirmData.statusCode) === 3 && confirmData.transactionStatus?.toLowerCase() === "approved") {
      await updatePaymentTransaction(clientTxId, {
        payphoneTransactionId: confirmData.transactionId,
        status: "approved",
        statusCode: confirmData.statusCode,
        authorizationCode: confirmData.authorizationCode,
        cardType: confirmData.cardType,
        cardBrand: confirmData.cardBrand,
        lastDigits: confirmData.lastDigits,
        payphoneResponse: JSON.stringify(confirmData),
        ...(tokenData?.cardHolder ? { cardHolder: tokenData.cardHolder } : {}),
        ...(tokenData?.documentId ? { documentId: tokenData.documentId } : {}),
        ...(tokenData?.phoneNumber ? { phoneNumber: tokenData.phoneNumber } : {}),
      });

      // ── PCA: unlock the document, skip subscription creation ──
      if (isPcaPayment) {
        const pcaDoc = await getPcaDocumentByClientTxId(clientTxId);
        if (pcaDoc) {
          await unlockPcaDocument({
            clientTransactionId: clientTxId,
            payphoneTransactionId: confirmData.transactionId,
            authorizationCode: confirmData.authorizationCode || "",
            amountPaid: tx.amount,
          });
          console.log("[PayPhone PCA] Document unlocked, id:", pcaDoc.id);
        } else {
          console.warn("[PayPhone PCA] No pca_document found for clientTxId:", clientTxId);
        }
        return res.json({ success: true, type: "pca", pcaId: pcaDoc?.id || null });
      }

      // ── Trial: create 3-day trial subscription ──
      if (isTrialPayment) {
        let cardTokenId: number | undefined;
        const cardToken = confirmData.cardToken || confirmData.ctoken || "";
        if (cardToken) {
          try {
            cardTokenId = await saveCardToken({
              email: tx.email,
              cardToken,
              cardHolder: tokenData?.cardHolder || "",
              documentId: tokenData?.documentId || "",
              phoneNumber: tokenData?.phoneNumber || "",
              cardBrand: confirmData.cardBrand,
              lastDigits: confirmData.lastDigits,
            });
            console.log("[PayPhone Trial] Card token saved, id:", cardTokenId);
          } catch (tokenError: any) {
            console.error("[PayPhone Trial] Error saving card token:", tokenError?.message);
          }
        }

        const trialStart = new Date();
        const trialEnd   = new Date();
        trialEnd.setDate(trialEnd.getDate() + 3); // 3 días de prueba

        await createSubscription({
          email:    tx.email,
          plan:     (trialPlan as any) || "monthly",
          status:   "trial" as any,
          amountPaid: tx.amount, // $1.00 verificación
          transactionId:    String(confirmData.transactionId),
          authorizationCode: confirmData.authorizationCode,
          startDate:  trialStart,
          endDate:    trialEnd,
          isPromo:    false,
          isRecurring: !!cardTokenId,
          isTrial:    true,
          trialPlan:  (trialPlan as any) || "monthly",
          cardTokenId: cardTokenId || null,
          failedChargeAttempts: 0,
        });

        console.log(`[PayPhone Trial] Trial started for ${tx.email}, plan=${trialPlan}, ends=${trialEnd.toISOString()}`);

        // Meta CAPI: disparar Purchase con el valor real del plan (no $1)
        fireMetaCapi(clientTxId, trialPlan === "annual" ? ANNUAL_PRICE_CENTS : MONTHLY_PRICE_CENTS, tx.email).catch(
          (e) => console.error("[Meta CAPI Trial]", e)
        );

        // Enviar email de bienvenida al trial (no blocking)
        sendTrialStartedEmail(
          tx.email,
          trialPlan || "monthly",
          trialEnd.toLocaleDateString("es-EC", { year: "numeric", month: "long", day: "numeric" })
        ).catch((e) => console.error("[Trial Email]", e));

        return res.json({
          success:    true,
          type:       "trial",
          email:      tx.email,
          trialEnd:   trialEnd.toISOString(),
          isRecurring: !!cardTokenId,
        });
      }

      let cardTokenId: number | undefined;
      const cardToken = confirmData.cardToken || confirmData.ctoken || "";
      console.log("[PayPhone] cardToken resolved:", cardToken || "NONE", "| cardToken field:", confirmData.cardToken || "NONE", "| ctoken field:", confirmData.ctoken || "NONE");
      if (cardToken) {
        try {
          cardTokenId = await saveCardToken({
            email: tx.email,
            cardToken: cardToken,
            cardHolder: tokenData?.cardHolder || "",
            documentId: tokenData?.documentId || "",
            phoneNumber: tokenData?.phoneNumber || "",
            cardBrand: confirmData.cardBrand,
            lastDigits: confirmData.lastDigits,
          });
          console.log("[PayPhone] Card token saved, id:", cardTokenId);
        } catch (tokenError: any) {
          console.error("[PayPhone] Error saving card token:", tokenError?.message, "code:", tokenError?.code, "full:", JSON.stringify(tokenError));
        }
      } else {
        console.warn("[PayPhone] No card token found in response - isRecurring will be false");
      }

      const isAnnual = tx.amount === ANNUAL_PRICE_CENTS;
      const durationMonths = isAnnual ? 12 : 1;
      const planType = isAnnual ? "annual" : "monthly";

      const startDate = new Date();
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + durationMonths);

      await createSubscription({
        email: tx.email,
        plan: planType,
        status: "active",
        amountPaid: tx.amount,
        transactionId: String(confirmData.transactionId),
        authorizationCode: confirmData.authorizationCode,
        startDate,
        endDate,
        isPromo: false,
        isRecurring: !!cardTokenId,
        cardTokenId: cardTokenId || null,
        failedChargeAttempts: 0,
      });

      // Meta CAPI: disparar Purchase con el valor pagado
      fireMetaCapi(clientTxId, tx.amount, tx.email).catch(
        (e) => console.error("[Meta CAPI]", e)
      );

      res.json({ success: true, email: tx.email, isRecurring: !!cardTokenId });
    } else {
      await updatePaymentTransaction(clientTxId, {
        payphoneTransactionId: confirmData.transactionId,
        status: confirmData.statusCode === 2 ? "cancelled" : "error",
        statusCode: confirmData.statusCode,
        payphoneResponse: JSON.stringify(confirmData),
      });

      res.json({
        success: false,
        message: confirmData.statusCode === 2
          ? "Pago cancelado"
          : confirmData.message || "Error desconocido",
      });
    }
  } catch (error) {
    console.error("[PayPhone] Activate error:", error);
    res.status(500).json({ error: "Error al activar suscripcion" });
  }
}
