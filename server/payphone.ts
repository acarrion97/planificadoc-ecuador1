import type { Express, Request, Response } from "express";
import {
  createPaymentTransaction,
  getPaymentTransaction,
  updatePaymentTransaction,
  createSubscription,
  getActiveSubscription,
  countPreviousSubscriptions,
  saveCardToken,
  getActiveCardToken,
} from "./db";

// PayPhone configuration
const PAYPHONE_CONFIRM_URL = "https://pay.payphonetodoesposible.com/api/button/V2/Confirm";
const PAYPHONE_TOKEN_CHARGE_URL = "https://pay.payphonetodoesposible.com/api/transaction/web";

// Pricing in cents (PayPhone uses integer cents)
const MONTHLY_PRICE_CENTS = 699; // $6.99/mes
const ANNUAL_PRICE_CENTS = 5871; // $58.71/año ($4.89/mes x 12) - ahorro 30% vs mensual
const ANNUAL_MONTHLY_EQUIVALENT = 489; // $4.89/mes equivalent

type PlanType = "monthly" | "annual";

/**
 * Get the price for a given plan type.
 */
export function getPriceForPlan(plan: PlanType): {
  amount: number;
  plan: PlanType;
  label: string;
  monthlyEquivalent: number;
  durationMonths: number;
} {
  if (plan === "annual") {
    return {
      amount: ANNUAL_PRICE_CENTS,
      plan: "annual",
      label: "$58.71/año ($4.89/mes)",
      monthlyEquivalent: ANNUAL_MONTHLY_EQUIVALENT,
      durationMonths: 12,
    };
  }
  return {
    amount: MONTHLY_PRICE_CENTS,
    plan: "monthly",
    label: "$6.99/mes",
    monthlyEquivalent: MONTHLY_PRICE_CENTS,
    durationMonths: 1,
  };
}

/**
 * Generate a unique client transaction ID.
 */
function generateClientTxId(email: string): string {
  const ts = Date.now();
  const rand = Math.random().toString(36).substring(2, 8);
  return `PDOC-${ts}-${rand}`;
}

/**
 * Charge a card using a saved token (for recurring payments).
 */
export async function chargeWithToken(params: {
  cardToken: string;
  cardHolder: string;
  documentId: string;
  phoneNumber: string;
  email: string;
  amount: number;
  storeId: string;
  token: string;
  reference?: string;
}): Promise<{ success: boolean; transactionId?: number; authorizationCode?: string; message?: string; statusCode?: number }> {
  const clientTxId = generateClientTxId(params.email);

  try {
    const response = await fetch(PAYPHONE_TOKEN_CHARGE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${params.token}`,
      },
      body: JSON.stringify({
        cardHolder: params.cardHolder,
        cardToken: params.cardToken,
        documentId: params.documentId,
        phoneNumber: params.phoneNumber,
        email: params.email,
        amount: params.amount,
        amountWithoutTax: params.amount,
        amountWithTax: 0,
        tax: 0,
        service: null,
        tip: null,
        clientTransactionId: clientTxId,
        currency: "USD",
        storeId: params.storeId,
        optionalParameter: params.reference || "Suscripción recurrente PlanificaDoc",
      }),
    });

    const data = await response.json();
    console.log("[PayPhone] Token charge response:", JSON.stringify(data));

    if (data.statusCode === 3 && data.transactionStatus === "Approved") {
      return {
        success: true,
        transactionId: data.transactionId,
        authorizationCode: data.authorizationCode,
        statusCode: data.statusCode,
      };
    }

    return {
      success: false,
      message: data.message || "Cobro rechazado",
      statusCode: data.statusCode,
      transactionId: data.transactionId,
    };
  } catch (error) {
    console.error("[PayPhone] Token charge error:", error);
    return {
      success: false,
      message: "Error de conexión con PayPhone",
    };
  }
}

/**
 * Register PayPhone-related Express routes.
 */
export function registerPayPhoneRoutes(app: Express) {
  const payphoneToken = process.env.PAYPHONE_TOKEN || "";
  const payphoneStoreId = process.env.PAYPHONE_STORE_ID || "";

  /**
   * GET /api/payment/page?email=xxx&plan=monthly|annual&documentId=xxx&phoneNumber=xxx&cardHolder=xxx
   * Serves the PayPhone Payment Box HTML page with tokenization enabled.
   */
  app.get("/api/payment/page", async (req: Request, res: Response) => {
    const email = (req.query.email as string || "").trim().toLowerCase();
    const planParam = (req.query.plan as string || "monthly").toLowerCase();
    const plan: PlanType = planParam === "annual" ? "annual" : "monthly";
    const documentId = (req.query.documentId as string || "").trim();
    let phoneNumber = (req.query.phoneNumber as string || "").trim();
    // Ensure phone has +593 format as required by PayPhone
    if (phoneNumber && !phoneNumber.startsWith("+")) {
      phoneNumber = "+" + phoneNumber;
    }
    const cardHolder = (req.query.cardHolder as string || "").trim();

    if (!email || !email.includes("@")) {
      res.status(400).send("Email requerido");
      return;
    }

    if (!documentId || !phoneNumber || !cardHolder) {
      res.status(400).send("Cédula, teléfono y nombre del titular son requeridos para pago recurrente");
      return;
    }

    if (!payphoneToken || !payphoneStoreId) {
      res.status(500).send("PayPhone no configurado. Contacte al administrador.");
      return;
    }

    try {
      const pricing = getPriceForPlan(plan);

      // Generate unique transaction ID
      const clientTxId = generateClientTxId(email);

      // Create pending transaction record
      await createPaymentTransaction({
        clientTransactionId: clientTxId,
        email,
        amount: pricing.amount,
        status: "pending",
      });

      // Always use planificadoc.app for response URL so PayPhone domain validation passes
      // Include tokenData params so the confirm page can pass them to the activate endpoint
      const tokenParams = `&documentId=${encodeURIComponent(documentId)}&phoneNumber=${encodeURIComponent(phoneNumber)}&cardHolder=${encodeURIComponent(cardHolder)}`;
      const responseUrl = `https://planificadoc.app/api/payment/confirm?${tokenParams}`;

      const totalAmount = pricing.amount;
      const planLabel = plan === "annual" ? "Anual" : "Mensual";
      const reference = `PlanificaDoc - Suscripcion ${planLabel} Recurrente - ${email}`;

      const html = buildPaymentPageHTML({
        token: payphoneToken,
        storeId: payphoneStoreId,
        clientTxId,
        amount: totalAmount,
        email,
        reference,
        responseUrl,
        priceLabel: pricing.label,
        plan,
        durationMonths: pricing.durationMonths,
        documentId,
        phoneNumber,
        cardHolder,
      });

      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.setHeader("Referrer-Policy", "origin");
      res.send(html);
    } catch (error) {
      console.error("[PayPhone] Error generating payment page:", error);
      res.status(500).send("Error al generar la pagina de pago");
    }
  });

  /**
   * GET /api/payment/confirm?id=xxx&clientTransactionId=xxx
   * PayPhone redirects here after payment.
   */
  app.get("/api/payment/confirm", async (req: Request, res: Response) => {
    const payphoneTxId = req.query.id as string;
    const clientTxId = req.query.clientTransactionId as string;
    // Token data passed via URL params from the payment page redirect
    const documentId = (req.query.documentId as string || "").trim();
    let phoneNumber = (req.query.phoneNumber as string || "").trim();
    // Ensure phone has +593 format as required by PayPhone
    if (phoneNumber && !phoneNumber.startsWith("+")) {
      phoneNumber = "+" + phoneNumber;
    }
    const cardHolder = (req.query.cardHolder as string || "").trim();

    if (!payphoneTxId || !clientTxId) {
      res.send(buildResultPageHTML(false, "Parametros de transaccion faltantes."));
      return;
    }

    try {
      const tx = await getPaymentTransaction(clientTxId);
      if (!tx) {
        res.send(buildResultPageHTML(false, "Transaccion no encontrada."));
        return;
      }

      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.setHeader("Referrer-Policy", "origin");
      res.send(buildConfirmBridgeHTML({
        payphoneTxId,
        clientTxId,
        token: payphoneToken,
        email: tx.email,
        documentId,
        phoneNumber,
        cardHolder,
      }));
    } catch (error) {
      console.error("[PayPhone] Confirm page error:", error);
      res.send(buildResultPageHTML(false, "Error al procesar. Intenta de nuevo."));
    }
  });

  /**
   * POST /api/payment/activate
   * Called by the confirm bridge page after successfully confirming with PayPhone.
   * Now also saves the card token for recurring billing.
   */
  app.post("/api/payment/activate", async (req: Request, res: Response) => {
    const { clientTxId, confirmData, tokenData } = req.body;

    if (!clientTxId || !confirmData) {
      res.status(400).json({ error: "Datos faltantes" });
      return;
    }

    try {
      const tx = await getPaymentTransaction(clientTxId);
      if (!tx) {
        res.status(404).json({ error: "Transaccion no encontrada" });
        return;
      }

      // Check if already processed
      if (tx.status === "approved") {
        res.json({ success: true, message: "Suscripcion ya activada" });
        return;
      }

      console.log("[PayPhone] Activate - confirm data:", JSON.stringify(confirmData));

      if (confirmData.statusCode === 3 && confirmData.transactionStatus === "Approved") {
        // Payment approved!
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

        // Save card token for recurring billing if provided
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
            // Don't fail the payment if token save fails
          }
        }

        // Determine plan duration based on amount paid
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
        // Payment cancelled or failed
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
  });

  /**
   * GET /api/payment/status?email=xxx
   * Check subscription status for an email.
   */
  app.get("/api/payment/status", async (req: Request, res: Response) => {
    const email = (req.query.email as string || "").trim().toLowerCase();

    if (!email) {
      res.json({ active: false, error: "Email requerido" });
      return;
    }

    try {
      const sub = await getActiveSubscription(email);
      if (sub) {
        const cardToken = await getActiveCardToken(email);
        res.json({
          active: true,
          email: sub.email,
          plan: sub.plan,
          endDate: sub.endDate,
          isPromo: sub.isPromo,
          isRecurring: sub.isRecurring,
          hasCardToken: !!cardToken,
          lastDigits: cardToken?.lastDigits || null,
          cardBrand: cardToken?.cardBrand || null,
        });
      } else {
        res.json({
          active: false,
          pricing: {
            monthly: {
              amount: MONTHLY_PRICE_CENTS,
            label: "$6.99/mes",
          },
          annual: {
            amount: ANNUAL_PRICE_CENTS,
            label: "$58.71/año ($4.89/mes)",
            savings: "30%",
            },
          },
        });
      }
    } catch (error) {
      console.error("[PayPhone] Status check error:", error);
      res.json({ active: false, error: "Error al verificar suscripcion" });
    }
  });

  /**
   * GET /api/payment/pricing?email=xxx
   * Get pricing info.
   */
  app.get("/api/payment/pricing", async (req: Request, res: Response) => {
    try {
      res.json({
        monthly: {
          amount: MONTHLY_PRICE_CENTS,
          label: "$6.99/mes",
          monthlyEquivalent: MONTHLY_PRICE_CENTS,
          durationMonths: 1,
        },
        annual: {
          amount: ANNUAL_PRICE_CENTS,
          label: "$58.71/año ($4.89/mes)",
          monthlyEquivalent: ANNUAL_MONTHLY_EQUIVALENT,
          durationMonths: 12,
          savings: "30%",
        },
      });
    } catch (error) {
      res.json({
        monthly: {
          amount: MONTHLY_PRICE_CENTS,
          label: "$6.99/mes",
          monthlyEquivalent: MONTHLY_PRICE_CENTS,
          durationMonths: 1,
        },
        annual: {
          amount: ANNUAL_PRICE_CENTS,
          label: "$58.71/año ($4.89/mes)",
          monthlyEquivalent: ANNUAL_MONTHLY_EQUIVALENT,
          durationMonths: 12,
          savings: "30%",
        },
      });
    }
  });

  /**
   * POST /api/payment/cancel-recurring
   * Cancel recurring billing for a user.
   */
  app.post("/api/payment/cancel-recurring", async (req: Request, res: Response) => {
    const { email } = req.body;
    if (!email) {
      res.status(400).json({ error: "Email requerido" });
      return;
    }

    try {
      const sub = await getActiveSubscription(email.toLowerCase());
      if (!sub) {
        res.json({ success: false, message: "No hay suscripción activa" });
        return;
      }

      // Import updateSubscriptionChargeStatus
      const { updateSubscriptionChargeStatus } = await import("./db");
      await updateSubscriptionChargeStatus(sub.id, {
        status: "cancelled",
      });

      res.json({ success: true, message: "Renovación automática cancelada. Tu acceso continúa hasta " + sub.endDate });
    } catch (error) {
      console.error("[PayPhone] Cancel recurring error:", error);
      res.status(500).json({ error: "Error al cancelar renovación" });
    }
  });
}

// ============= HTML Templates =============

function buildPaymentPageHTML(config: {
  token: string;
  storeId: string;
  clientTxId: string;
  amount: number;
  email: string;
  reference: string;
  responseUrl: string;
  priceLabel: string;
  plan: PlanType;
  durationMonths: number;
  documentId: string;
  phoneNumber: string;
  cardHolder: string;
}): string {
  const planLabel = config.plan === "annual" ? "Anual (12 meses)" : "Mensual";
  const periodLabel = config.plan === "annual" ? "por año" : "por mes";
  const savingsBadge = config.plan === "annual"
    ? '<div class="savings-badge">Ahorras 30%</div>'
    : "";

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="referrer" content="origin">
  <title>PlanificaDoc - Pago Seguro</title>
  <link rel="stylesheet" href="https://cdn.payphonetodoesposible.com/box/v1.1/payphone-payment-box.css">
  <script type="module" src="https://cdn.payphonetodoesposible.com/box/v1.1/payphone-payment-box.js"></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .container {
      background: white;
      border-radius: 20px;
      padding: 32px 24px;
      max-width: 420px;
      width: 100%;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
    }
    .logo-section {
      text-align: center;
      margin-bottom: 24px;
    }
    .logo-section h1 {
      font-size: 22px;
      color: #1e3a5f;
      margin-top: 8px;
    }
    .logo-section .emoji-logo {
      font-size: 48px;
    }
    .price-card {
      background: ${config.plan === "annual" ? "linear-gradient(135deg, #059669, #10b981)" : "linear-gradient(135deg, #1e3a5f, #2563eb)"};
      color: white;
      border-radius: 14px;
      padding: 20px;
      text-align: center;
      margin-bottom: 24px;
      position: relative;
    }
    .price-card .amount {
      font-size: 36px;
      font-weight: 800;
    }
    .price-card .period {
      font-size: 14px;
      opacity: 0.9;
    }
    .savings-badge {
      display: inline-block;
      background: rgba(255,255,255,0.25);
      border-radius: 20px;
      padding: 4px 14px;
      font-size: 12px;
      font-weight: 700;
      margin-top: 8px;
    }
    .info-row {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      border-bottom: 1px solid #f0f0f0;
      font-size: 14px;
      color: #555;
    }
    .info-row:last-child { border-bottom: none; }
    .info-row .label { font-weight: 500; }
    .info-row .value { color: #1e3a5f; font-weight: 600; }
    .payment-section {
      margin-top: 24px;
    }
    .payment-section h3 {
      font-size: 16px;
      color: #333;
      margin-bottom: 16px;
      text-align: center;
    }
    .security-note {
      text-align: center;
      font-size: 11px;
      color: #999;
      margin-top: 16px;
    }
    .security-note span { font-size: 14px; }
    .recurring-note {
      text-align: center;
      font-size: 12px;
      color: #1e3a5f;
      margin-top: 12px;
      padding: 10px;
      background: #e0f2fe;
      border-radius: 8px;
      border: 1px solid #bae6fd;
    }
    .recurring-note strong { display: block; margin-bottom: 4px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo-section">
      <div class="emoji-logo">\uD83D\uDCDA</div>
      <h1>PlanificaDoc Ecuador</h1>
    </div>

    <div class="price-card">
      <div class="amount">$${(config.amount / 100).toFixed(2)}</div>
      <div class="period">${periodLabel}</div>
      ${savingsBadge}
    </div>

    <div class="info-row">
      <span class="label">Plan</span>
      <span class="value">${planLabel}</span>
    </div>
    <div class="info-row">
      <span class="label">Email</span>
      <span class="value">${config.email}</span>
    </div>
    <div class="info-row">
      <span class="label">Titular</span>
      <span class="value">${config.cardHolder}</span>
    </div>
    <div class="info-row">
      <span class="label">Incluye</span>
      <span class="value">1,652+ destrezas + IA</span>
    </div>
    <div class="info-row">
      <span class="label">Renovacion</span>
      <span class="value">Automatica cada ${config.durationMonths} ${config.durationMonths === 1 ? "mes" : "meses"}</span>
    </div>

    <div class="recurring-note">
      <strong>\uD83D\uDD04 Suscripcion Recurrente</strong>
      Tu tarjeta sera cobrada automaticamente cada ${config.durationMonths === 1 ? "mes" : "año"}.
      Puedes cancelar en cualquier momento desde la app.
    </div>

    <div class="payment-section">
      <h3>\uD83D\uDCB3 Selecciona tu metodo de pago</h3>
      <div id="pp-button"></div>
    </div>

    <div class="security-note">
      <span>\uD83D\uDD12</span> Pago seguro procesado por PayPhone<br>
      Visa, Mastercard y PayPhone Wallet
    </div>
  </div>

  <script>
    window.addEventListener('DOMContentLoaded', () => {
      try {
        const ppb = new PPaymentButtonBox({
          token: '${config.token}',
          clientTransactionId: '${config.clientTxId}',
          amount: ${config.amount},
          amountWithoutTax: ${config.amount},
          amountWithTax: 0,
          tax: 0,
          service: 0,
          tip: 0,
          currency: "USD",
          storeId: "${config.storeId}",
          reference: "${config.reference}",
          lang: "es",
          defaultMethod: "card",
          timeZone: -5,
          email: "${config.email}",
          responseUrl: "${config.responseUrl}",
          documentId: "${config.documentId}",
          phoneNumber: "${config.phoneNumber}"
        }).render('pp-button');
      } catch(e) {
        console.error('PayPhone init error:', e);
        document.getElementById('pp-button').innerHTML = '<p style="color:red;text-align:center;">Error al cargar el formulario de pago. Recarga la pagina.</p>';
      }
    });
  </script>
</body>
</html>`;
}

function buildConfirmBridgeHTML(config: {
  payphoneTxId: string;
  clientTxId: string;
  token: string;
  email: string;
  documentId?: string;
  phoneNumber?: string;
  cardHolder?: string;
}): string {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="referrer" content="origin">
  <title>PlanificaDoc - Procesando pago...</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .container {
      background: white;
      border-radius: 20px;
      padding: 40px 24px;
      max-width: 420px;
      width: 100%;
      text-align: center;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
    }
    .spinner {
      width: 48px;
      height: 48px;
      border: 4px solid #e5e7eb;
      border-top: 4px solid #1e3a5f;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 20px;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    h1 { font-size: 20px; color: #1e3a5f; margin-bottom: 8px; }
    .status { font-size: 14px; color: #687076; line-height: 1.5; }
    .success-icon { font-size: 64px; margin-bottom: 16px; }
    .error-icon { font-size: 64px; margin-bottom: 16px; }
    .success-badge {
      display: inline-block;
      background: #059669;
      color: white;
      padding: 6px 20px;
      border-radius: 20px;
      font-weight: 700;
      font-size: 14px;
      margin-bottom: 16px;
    }
    .error-badge {
      display: inline-block;
      background: #DC2626;
      color: white;
      padding: 6px 20px;
      border-radius: 20px;
      font-weight: 700;
      font-size: 14px;
      margin-bottom: 16px;
    }
    .email-info {
      background: #f0f9ff;
      border-radius: 10px;
      padding: 12px;
      font-size: 14px;
      color: #1e3a5f;
      margin: 16px 0;
    }
    .note { font-size: 12px; color: #999; margin-top: 16px; }
    .hidden { display: none; }
  </style>
</head>
<body>
  <div class="container">
    <div id="loading">
      <div class="spinner"></div>
      <h1>Procesando tu pago...</h1>
      <p class="status">Confirmando la transaccion con PayPhone. No cierres esta ventana.</p>
    </div>
    <div id="result" class="hidden"></div>
  </div>

  <script>
    (async function() {
      const loadingEl = document.getElementById('loading');
      const resultEl = document.getElementById('result');

      function showResult(html) {
        loadingEl.classList.add('hidden');
        resultEl.classList.remove('hidden');
        resultEl.innerHTML = html;
      }

      try {
        // Step 1: Confirm with PayPhone API (from user's browser)
        const confirmRes = await fetch('https://pay.payphonetodoesposible.com/api/button/V2/Confirm', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ${config.token}'
          },
          body: JSON.stringify({
            id: ${config.payphoneTxId},
            clientTxId: '${config.clientTxId}'
          })
        });

        const confirmData = await confirmRes.json();
        console.log('PayPhone confirm:', confirmData);

        // Token data embedded from server
        const tokenData = {
          cardHolder: '${config.cardHolder || ""}',
          documentId: '${config.documentId || ""}',
          phoneNumber: '${config.phoneNumber || ""}'
        };

        // Step 2: Send confirm result to our server to activate subscription
        const activateRes = await fetch('/api/payment/activate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            clientTxId: '${config.clientTxId}',
            confirmData: confirmData,
            tokenData: tokenData
          })
        });

        const activateResult = await activateRes.json();
        console.log('Activate result:', activateResult);

        if (activateResult.success) {
          const recurringMsg = activateResult.isRecurring
            ? '<p style="font-size:13px;color:#059669;margin-top:8px;">\uD83D\uDD04 Renovacion automatica activada</p>'
            : '';
          showResult(
            '<div class="success-icon">\u2705</div>' +
            '<div class="success-badge">PAGO EXITOSO</div>' +
            '<h1>Pago Exitoso</h1>' +
            '<p class="status">Tu suscripcion ha sido activada correctamente.</p>' +
            recurringMsg +
            '<div class="email-info"><strong>Tu cuenta:</strong> ${config.email}<br><small>Usa este email para iniciar sesion en la app.</small></div>' +
            '<p class="note">Puedes cerrar esta ventana y volver a la app. Tu acceso ya esta activo.</p>'
          );
        } else if (confirmData.statusCode === 2) {
          showResult(
            '<div class="error-icon">\u274C</div>' +
            '<div class="error-badge">PAGO CANCELADO</div>' +
            '<h1>Pago Cancelado</h1>' +
            '<p class="status">' + (activateResult.message || 'El pago fue cancelado.') + '</p>' +
            '<p class="note">Si el problema persiste, contactanos por WhatsApp.</p>'
          );
        } else {
          showResult(
            '<div class="error-icon">\u274C</div>' +
            '<div class="error-badge">ERROR</div>' +
            '<h1>Error en el Pago</h1>' +
            '<p class="status">' + (activateResult.message || confirmData.message || 'Error desconocido') + '</p>' +
            '<p class="note">Si el problema persiste, contactanos por WhatsApp.</p>'
          );
        }
      } catch (error) {
        console.error('Confirm error:', error);
        showResult(
          '<div class="error-icon">\u274C</div>' +
          '<div class="error-badge">ERROR</div>' +
          '<h1>Error de Conexion</h1>' +
          '<p class="status">No se pudo confirmar el pago. Tu pago fue procesado pero necesita confirmacion manual. Contactanos por WhatsApp con tu email: ${config.email}</p>' +
          '<p class="note">Si el problema persiste, contactanos por WhatsApp.</p>'
        );
      }
    })();
  </script>
</body>
</html>`;
}

function buildResultPageHTML(
  success: boolean,
  message: string,
  email?: string
): string {
  const bgColor = success ? "#059669" : "#DC2626";
  const emoji = success ? "\u2705" : "\u274C";
  const title = success ? "Pago Exitoso" : "Pago No Completado";

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PlanificaDoc - ${title}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .container {
      background: white;
      border-radius: 20px;
      padding: 40px 24px;
      max-width: 420px;
      width: 100%;
      text-align: center;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
    }
    .icon {
      font-size: 64px;
      margin-bottom: 16px;
    }
    .status-badge {
      display: inline-block;
      background: ${bgColor};
      color: white;
      padding: 6px 20px;
      border-radius: 20px;
      font-weight: 700;
      font-size: 14px;
      margin-bottom: 16px;
    }
    h1 {
      font-size: 22px;
      color: #1e3a5f;
      margin-bottom: 12px;
    }
    .message {
      font-size: 15px;
      color: #555;
      line-height: 1.5;
      margin-bottom: 24px;
    }
    .email-info {
      background: #f0f9ff;
      border-radius: 10px;
      padding: 12px;
      font-size: 14px;
      color: #1e3a5f;
      margin-bottom: 24px;
    }
    .cta-btn {
      display: inline-block;
      background: #1e3a5f;
      color: white;
      padding: 14px 32px;
      border-radius: 12px;
      text-decoration: none;
      font-weight: 700;
      font-size: 16px;
    }
    .note {
      font-size: 12px;
      color: #999;
      margin-top: 16px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="icon">${emoji}</div>
    <div class="status-badge">${title.toUpperCase()}</div>
    <h1>${title}</h1>
    <p class="message">${message}</p>
    ${
      success && email
        ? `<div class="email-info">
            <strong>Tu cuenta:</strong> ${email}<br>
            <small>Usa este email para iniciar sesion en la app.</small>
          </div>`
        : ""
    }
    <p class="note">
      ${
        success
          ? "Puedes cerrar esta ventana y volver a la app. Tu acceso ya esta activo."
          : "Si el problema persiste, contactanos por WhatsApp."
      }
    </p>
  </div>
</body>
</html>`;
}
