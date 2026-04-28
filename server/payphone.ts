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
const MONTHLY_PRICE_CENTS = 699; // $6.99/mes
const ANNUAL_PRICE_CENTS = 7551; // $75.51/año ($6.29/mes x 12) - ahorro ~10% vs mensual
const ANNUAL_MONTHLY_EQUIVALENT = 629; // $6.29/mes equivalent

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
      label: "$75.51/año ($6.29/mes)",
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
 * Register PayPhone-related Express routes.
 */
export function registerPayPhoneRoutes(app: Express) {
  const payphoneToken = process.env.PAYPHONE_TOKEN || "";
  const payphoneStoreId = process.env.PAYPHONE_STORE_ID || "";

  /**
   * GET /api/payment/page?email=xxx&plan=monthly|annual
   * Serves the PayPhone Payment Box HTML page.
   */
  app.get("/api/payment/page", async (req: Request, res: Response) => {
    const email = (req.query.email as string || "").trim().toLowerCase();
    const planParam = (req.query.plan as string || "monthly").toLowerCase();
    const plan: PlanType = planParam === "annual" ? "annual" : "monthly";

    if (!email || !email.includes("@")) {
      res.status(400).send("Email requerido");
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
      const responseUrl = "https://planificadoc.app/api/payment/confirm";

      const totalAmount = pricing.amount;
      const planLabel = plan === "annual" ? "Anual" : "Mensual";
      const reference = `PlanificaDoc - Suscripcion ${planLabel} - ${email}`;

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
      }));
    } catch (error) {
      console.error("[PayPhone] Confirm page error:", error);
      res.send(buildResultPageHTML(false, "Error al procesar. Intenta de nuevo."));
    }
  });

  /**
   * POST /api/payment/activate
   * Called by the confirm bridge page after successfully confirming with PayPhone.
   */
  app.post("/api/payment/activate", async (req: Request, res: Response) => {
    const { clientTxId, confirmData } = req.body;

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
        });

        res.json({ success: true, email: tx.email });
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
        res.json({
          active: true,
          email: sub.email,
          plan: sub.plan,
          endDate: sub.endDate,
          isPromo: sub.isPromo,
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
            label: "$75.51/año ($6.29/mes)",
            savings: "10%",
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
          label: "$75.51/año ($6.29/mes)",
          monthlyEquivalent: ANNUAL_MONTHLY_EQUIVALENT,
          durationMonths: 12,
          savings: "10%",
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
          label: "$75.51/año ($6.29/mes)",
          monthlyEquivalent: ANNUAL_MONTHLY_EQUIVALENT,
          durationMonths: 12,
          savings: "10%",
        },
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
  plan: PlanType;
  durationMonths: number;
}): string {
  const planLabel = config.plan === "annual" ? "Anual (12 meses)" : "Mensual";
  const periodLabel = config.plan === "annual" ? "por año" : "por mes";
  const savingsBadge = config.plan === "annual"
    ? '<div class="savings-badge">Ahorras 10%</div>'
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
    .renewal-note {
      text-align: center;
      font-size: 12px;
      color: #666;
      margin-top: 12px;
      padding: 8px;
      background: #f8f9fa;
      border-radius: 8px;
    }
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
      <span class="label">Incluye</span>
      <span class="value">1,652+ destrezas + IA</span>
    </div>
    <div class="info-row">
      <span class="label">Duracion</span>
      <span class="value">${config.durationMonths} ${config.durationMonths === 1 ? "mes" : "meses"}</span>
    </div>

    <div class="renewal-note">
      \u2139\uFE0F Sin renovacion automatica. Al vencer, puedes renovar manualmente.
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

function buildConfirmBridgeHTML(config: {
  payphoneTxId: string;
  clientTxId: string;
  token: string;
  email: string;
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

        // Step 2: Send confirm result to our server to activate subscription
        const activateRes = await fetch('/api/payment/activate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            clientTxId: '${config.clientTxId}',
            confirmData: confirmData
          })
        });

        const activateResult = await activateRes.json();
        console.log('Activate result:', activateResult);

        if (activateResult.success) {
          showResult(
            '<div class="success-icon">\u2705</div>' +
            '<div class="success-badge">PAGO EXITOSO</div>' +
            '<h1>Pago Exitoso</h1>' +
            '<p class="status">Tu suscripcion ha sido activada correctamente.</p>' +
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
