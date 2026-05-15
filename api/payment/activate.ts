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

    // Log FULL PayPhone response to Vercel logs for diagnostics
    console.log("[PayPhone] Activate - FULL confirm data keys:", Object.keys(confirmData || {}));
    console.log("[PayPhone] Activate - statusCode:", confirmData?.statusCode, "transactionStatus:", confirmData?.transactionStatus);
    console.log("[PayPhone] Activate - cardToken present:", !!confirmData?.cardToken, "value:", confirmData?.cardToken || "NONE");
    console.log("[PayPhone] Activate - generateToken field:", confirmData?.generateToken);
    console.log("[PayPhone] Activate - FULL JSON:", JSON.stringify(confirmData));

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
