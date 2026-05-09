import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createPaymentTransaction } from "../_lib/db";

type PlanType = "monthly" | "annual";

const MONTHLY_PRICE_CENTS = 699;
const ANNUAL_PRICE_CENTS = 5871;

function getPriceForPlan(plan: PlanType) {
  if (plan === "annual") {
    return { amount: ANNUAL_PRICE_CENTS, plan: "annual" as const, label: "$58.71/año ($4.89/mes)", durationMonths: 12 };
  }
  return { amount: MONTHLY_PRICE_CENTS, plan: "monthly" as const, label: "$6.99/mes", durationMonths: 1 };
}

function generateClientTxId(email: string): string {
  const ts = Date.now();
  const rand = Math.random().toString(36).substring(2, 8);
  return `PDOC-${ts}-${rand}`;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const email = ((req.query.email as string) || "").trim().toLowerCase();
  const planParam = ((req.query.plan as string) || "monthly").toLowerCase();
  const plan: PlanType = planParam === "annual" ? "annual" : "monthly";
  const documentId = ((req.query.documentId as string) || "").trim();
  const phoneNumber = ((req.query.phoneNumber as string) || "").trim();
  const cardHolder = ((req.query.cardHolder as string) || "").trim();

  if (!email || !email.includes("@")) {
    return res.status(400).send("Email requerido");
  }

  if (!documentId || !phoneNumber || !cardHolder) {
    return res.status(400).send("Cédula, teléfono y nombre del titular son requeridos para pago recurrente");
  }

  const payphoneToken = process.env.PAYPHONE_TOKEN || "";
  const payphoneStoreId = process.env.PAYPHONE_STORE_ID || "";

  if (!payphoneToken || !payphoneStoreId) {
    return res.status(500).send("PayPhone no configurado. Contacte al administrador.");
  }

  try {
    const pricing = getPriceForPlan(plan);
    const clientTxId = generateClientTxId(email);

    await createPaymentTransaction({
      clientTransactionId: clientTxId,
      email,
      amount: pricing.amount,
      status: "pending",
    });

    const tokenParams = `&documentId=${encodeURIComponent(documentId)}&phoneNumber=${encodeURIComponent(phoneNumber)}&cardHolder=${encodeURIComponent(cardHolder)}`;
    const responseUrl = `https://planificadoc.app/api/payment/confirm?${tokenParams}`;

    const planLabel = plan === "annual" ? "Anual (12 meses)" : "Mensual";
    const periodLabel = plan === "annual" ? "por año" : "por mes";
    const reference = `PlanificaDoc - Suscripcion ${planLabel} Recurrente - ${email}`;
    const savingsBadge = plan === "annual" ? '<div class="savings-badge">Ahorras 30%</div>' : "";

    const html = `<!DOCTYPE html>
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
    .logo-section { text-align: center; margin-bottom: 24px; }
    .logo-section h1 { font-size: 22px; color: #1e3a5f; margin-top: 8px; }
    .logo-section .emoji-logo { font-size: 48px; }
    .price-card {
      background: ${plan === "annual" ? "linear-gradient(135deg, #059669, #10b981)" : "linear-gradient(135deg, #1e3a5f, #2563eb)"};
      color: white; border-radius: 14px; padding: 20px; text-align: center; margin-bottom: 24px; position: relative;
    }
    .price-card .amount { font-size: 36px; font-weight: 800; }
    .price-card .period { font-size: 14px; opacity: 0.9; }
    .savings-badge { display: inline-block; background: rgba(255,255,255,0.25); border-radius: 20px; padding: 4px 14px; font-size: 12px; font-weight: 700; margin-top: 8px; }
    .info-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f0f0f0; font-size: 14px; color: #555; }
    .info-row:last-child { border-bottom: none; }
    .info-row .label { font-weight: 500; }
    .info-row .value { color: #1e3a5f; font-weight: 600; }
    .payment-section { margin-top: 24px; }
    .payment-section h3 { font-size: 16px; color: #333; margin-bottom: 16px; text-align: center; }
    .security-note { text-align: center; font-size: 11px; color: #999; margin-top: 16px; }
    .security-note span { font-size: 14px; }
    .recurring-note { text-align: center; font-size: 12px; color: #1e3a5f; margin-top: 12px; padding: 10px; background: #e0f2fe; border-radius: 8px; border: 1px solid #bae6fd; }
    .recurring-note strong { display: block; margin-bottom: 4px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo-section">
      <div class="emoji-logo">📚</div>
      <h1>PlanificaDoc Ecuador</h1>
    </div>
    <div class="price-card">
      <div class="amount">$${(pricing.amount / 100).toFixed(2)}</div>
      <div class="period">${periodLabel}</div>
      ${savingsBadge}
    </div>
    <div class="info-row"><span class="label">Plan</span><span class="value">${planLabel}</span></div>
    <div class="info-row"><span class="label">Email</span><span class="value">${email}</span></div>
    <div class="info-row"><span class="label">Titular</span><span class="value">${cardHolder}</span></div>
    <div class="info-row"><span class="label">Incluye</span><span class="value">1,652+ destrezas + IA</span></div>
    <div class="info-row"><span class="label">Renovacion</span><span class="value">Automatica cada ${pricing.durationMonths} ${pricing.durationMonths === 1 ? "mes" : "meses"}</span></div>
    <div class="recurring-note">
      <strong>🔄 Suscripcion Recurrente</strong>
      Tu tarjeta sera cobrada automaticamente cada ${pricing.durationMonths === 1 ? "mes" : "año"}.
      Puedes cancelar en cualquier momento desde la app.
    </div>
    <div class="payment-section">
      <h3>💳 Selecciona tu metodo de pago</h3>
      <div id="pp-button"></div>
    </div>
    <div class="security-note">
      <span>🔒</span> Pago seguro procesado por PayPhone<br>
      Visa, Mastercard y PayPhone Wallet
    </div>
  </div>
  <script>
    window.addEventListener('DOMContentLoaded', () => {
      try {
        const ppb = new PPaymentButtonBox({
          token: '${payphoneToken}',
          clientTransactionId: '${clientTxId}',
          amount: ${pricing.amount},
          amountWithoutTax: ${pricing.amount},
          amountWithTax: 0,
          tax: 0,
          service: 0,
          tip: 0,
          currency: "USD",
          storeId: "${payphoneStoreId}",
          reference: "${reference}",
          lang: "es",
          defaultMethod: "card",
          timeZone: -5,
          email: "${email}",
          responseUrl: "${responseUrl}",
          documentId: "${documentId}",
          phoneNumber: "${phoneNumber}"
        }).render('pp-button');
      } catch(e) {
        console.error('PayPhone init error:', e);
        document.getElementById('pp-button').innerHTML = '<p style="color:red;text-align:center;">Error al cargar el formulario de pago. Recarga la pagina.</p>';
      }
    });
  </script>
</body>
</html>`;

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Referrer-Policy", "origin");
    res.send(html);
  } catch (error) {
    console.error("[PayPhone] Error generating payment page:", error);
    res.status(500).send("Error al generar la pagina de pago");
  }
}
