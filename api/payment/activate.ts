import type { VercelRequest, VercelResponse } from "@vercel/node";
import { handleCors } from "../_lib/admin-auth";
import {
  getPaymentTransaction,
  updatePaymentTransaction,
  createSubscription,
  saveCardToken,
} from "../_lib/db";

const MONTHLY_PRICE_CENTS = 699;
const ANNUAL_PRICE_CENTS = 5871;

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

    console.log("[PayPhone] Activate - confirm data:", JSON.stringify(confirmData));

    if (confirmData.statusCode === 3 && confirmData.transactionStatus === "Approved") {
      await updatePaymentTransaction(clientTxId, {
        payphoneTransactionId: confirmData.transactionId,
        status: "approved",
        statusCode: confirmData.statusCode,
        authorizationCode: confirmData.authorizationCode,
        cardType: confirmData.cardType,
        cardBrand: confirmData.cardBrand,
        lastDigits: confirmData.lastDigits,
        payphoneResponse: JSON.stringify(confirmData),
      });

      let cardTokenId: number | undefined;
      if (confirmData.cardToken && tokenData) {
        try {
          cardTokenId = await saveCardToken({
            email: tx.email,
            cardToken: confirmData.cardToken,
            cardHolder: tokenData.cardHolder || "",
            documentId: tokenData.documentId || "",
            phoneNumber: tokenData.phoneNumber || "",
            cardBrand: confirmData.cardBrand,
            lastDigits: confirmData.lastDigits,
          });
          console.log("[PayPhone] Card token saved, id:", cardTokenId);
        } catch (tokenError) {
          console.error("[PayPhone] Error saving card token:", tokenError);
        }
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
