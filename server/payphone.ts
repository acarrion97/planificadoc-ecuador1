import type { Express, Request, Response } from "express";
import {
  createPaymentTransaction,
  getPaymentTransaction,
  updatePaymentTransaction,
  createSubscription,
  getActiveSubscription,
  countPreviousSubscriptions,
} from "./db";

// PayPhone configuration
const PAYPHONE_CONFIRM_URL = "https://pay.payphonetodoesposible.com/api/button/V2/Confirm";

// Pricing in cents (PayPhone uses integer cents)
const PROMO_PRICE_CENTS = 499; // $4.99 first 3 months
const REGULAR_PRICE_CENTS = 699; // $6.99 after
const PROMO_MONTHS = 3; // Number of months at promo price

/**
 * Get the price for a user based on their subscription history.
 * First 3 months: $4.99, after that: $6.99
 */
export function getPriceForEmail(previousSubCount: number): {
  amount: number;
  isPromo: boolean;
  label: string;
} {
  if (previousSubCount < PROMO_MONTHS) {
    return {
      amount: PROMO_PRICE_CENTS,
      isPromo: true,
      label: "$4.99/mes (precio introductorio)",
    };
  }
  return {
    amount: REGULAR_PRICE_CENTS,
    isPromo: false,
    label: "$6.99/mes",
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
 * Register PayPhone-related Express routes.
 */
export function registerPayPhoneRoutes(app: Express) {
  const payphoneToken = process.env.PAYPHONE_TOKEN || "";
  const payphoneStoreId = process.env.PAYPHONE_STORE_ID || "";

  /**
   * GET /api/payment/page?email=xxx
   * Serves the PayPhone Payment Box HTML page.
   */
  app.get("/api/payment/page", async (req: Request, res: Response) => {
    const email = (req.query.email as string || "").trim().toLowerCase();

    if (!email || !email.includes("@")) {
      res.status(400).send("Email requerido");
      return;
    }

    if (!payphoneToken || !payphoneStoreId) {
      res.status(500).send("PayPhone no configurado. Contacte al administrador.");
      return;
    }

    try {
      // Determine pricing
      const prevCount = await countPreviousSubscriptions(email);
      const pricing = getPriceForEmail(prevCount);

      // Generate unique transaction ID
      const clientTxId = generateClientTxId(email);

      // Create pending transaction record
      await createPaymentTransaction({
        clientTransactionId: clientTxId,
        email,
        amount: pricing.amount,
        status: "pending",
      });

      // Build the response URL - where PayPhone redirects after payment
      const protocol = req.headers["x-forwarded-proto"] || req.protocol || "https";
      const host = req.headers["x-forwarded-host"] || req.headers.host || "localhost:3000";
      const responseUrl = `${protocol}://${host}/api/payment/confirm`;

      // Calculate tax breakdown (Ecuador: 15% IVA)
      // For simplicity, treat the full amount as tax-free (service fee)
      const totalAmount = pricing.amount;

      const html = buildPaymentPageHTML({
        token: payphoneToken,
        storeId: payphoneStoreId,
        clientTxId,
        amount: totalAmount,
        email,
        reference: `PlanificaDoc - Suscripcion Mensual - ${email}`,
        responseUrl,
        priceLabel: pricing.label,
        isPromo: pricing.isPromo,
      });

      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.send(html);
    } catch (error) {
      console.error("[PayPhone] Error generating payment page:", error);
      res.status(500).send("Error al generar la pagina de pago");
    }
  });

  /**
   * GET /api/payment/confirm?id=xxx&clientTransactionId=xxx
   * PayPhone redirects here after payment. Confirms with PayPhone API.
   */
  app.get("/api/payment/confirm", async (req: Request, res: Response) => {
    const payphoneTxId = req.query.id as string;
    const clientTxId = req.query.clientTransactionId as string;

    if (!payphoneTxId || !clientTxId) {
      res.send(buildResultPageHTML(false, "Parametros de transaccion faltantes."));
      return;
    }

    try {
      // Get the pending transaction
      const tx = await getPaymentTransaction(clientTxId);
      if (!tx) {
        res.send(buildResultPageHTML(false, "Transaccion no encontrada."));
        return;
      }

      // Confirm with PayPhone API
      const confirmResponse = await fetch(PAYPHONE_CONFIRM_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${payphoneToken}`,
        },
        body: JSON.stringify({
          id: parseInt(payphoneTxId),
          clientTxId: clientTxId,
        }),
      });

      const confirmData = await confirmResponse.json();
      console.log("[PayPhone] Confirm response:", JSON.stringify(confirmData));

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

        // Create subscription (1 month from now)
        const startDate = new Date();
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + 1);

        await createSubscription({
          email: tx.email,
          plan: "monthly",
          status: "active",
          amountPaid: tx.amount,
          transactionId: String(confirmData.transactionId),
          authorizationCode: confirmData.authorizationCode,
          startDate,
          endDate,
          isPromo: tx.amount === PROMO_PRICE_CENTS,
        });

        res.send(
          buildResultPageHTML(
            true,
            "Pago exitoso. Tu suscripcion ha sido activada.",
            tx.email
          )
        );
      } else {
        // Payment cancelled or failed
        await updatePaymentTransaction(clientTxId, {
          payphoneTransactionId: confirmData.transactionId,
          status: confirmData.statusCode === 2 ? "cancelled" : "error",
          statusCode: confirmData.statusCode,
          payphoneResponse: JSON.stringify(confirmData),
        });

        res.send(
          buildResultPageHTML(
            false,
            confirmData.statusCode === 2
              ? "Pago cancelado. Puedes intentar de nuevo."
              : `Error en el pago: ${confirmData.message || "Error desconocido"}`
          )
        );
      }
    } catch (error) {
      console.error("[PayPhone] Confirm error:", error);
      res.send(buildResultPageHTML(false, "Error al confirmar el pago. Intenta de nuevo."));
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
        res.json({
          active: true,
          email: sub.email,
          plan: sub.plan,
          endDate: sub.endDate,
          isPromo: sub.isPromo,
        });
      } else {
        // Also check pricing for this email
        const prevCount = await countPreviousSubscriptions(email);
        const pricing = getPriceForEmail(prevCount);
        res.json({
          active: false,
          pricing: {
            amount: pricing.amount,
            label: pricing.label,
            isPromo: pricing.isPromo,
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
   * Get pricing info for an email (how many months at promo, etc.)
   */
  app.get("/api/payment/pricing", async (req: Request, res: Response) => {
    const email = (req.query.email as string || "").trim().toLowerCase();

    try {
      const prevCount = email ? await countPreviousSubscriptions(email) : 0;
      const pricing = getPriceForEmail(prevCount);
      res.json({
        ...pricing,
        promoMonthsRemaining: Math.max(0, PROMO_MONTHS - prevCount),
        regularPrice: REGULAR_PRICE_CENTS,
        promoPrice: PROMO_PRICE_CENTS,
      });
    } catch (error) {
      res.json({
        amount: PROMO_PRICE_CENTS,
        isPromo: true,
        label: "$4.99/mes (precio introductorio)",
        promoMonthsRemaining: PROMO_MONTHS,
        regularPrice: REGULAR_PRICE_CENTS,
        promoPrice: PROMO_PRICE_CENTS,
      });
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
  isPromo: boolean;
}): string {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
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
      background: ${config.isPromo ? "linear-gradient(135deg, #059669, #10b981)" : "linear-gradient(135deg, #1e3a5f, #2563eb)"};
      color: white;
      border-radius: 14px;
      padding: 20px;
      text-align: center;
      margin-bottom: 24px;
    }
    .price-card .amount {
      font-size: 36px;
      font-weight: 800;
    }
    .price-card .period {
      font-size: 14px;
      opacity: 0.9;
    }
    .price-card .promo-badge {
      display: inline-block;
      background: rgba(255,255,255,0.2);
      border-radius: 20px;
      padding: 4px 12px;
      font-size: 12px;
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
      <div class="period">por mes</div>
      ${config.isPromo ? '<div class="promo-badge">\u2B50 Precio introductorio</div>' : ""}
    </div>

    <div class="info-row">
      <span class="label">Plan</span>
      <span class="value">Mensual</span>
    </div>
    <div class="info-row">
      <span class="label">Email</span>
      <span class="value">${config.email}</span>
    </div>
    <div class="info-row">
      <span class="label">Incluye</span>
      <span class="value">1,253+ destrezas + IA</span>
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
          responseUrl: "${config.responseUrl}"
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
