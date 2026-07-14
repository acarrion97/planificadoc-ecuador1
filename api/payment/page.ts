import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createPaymentTransaction, setPcaClientTxId } from "../_lib/db";

type PlanType = "monthly" | "annual";

// Snippet JS que se inyecta en cada página de pago para capturar _fbp/_fbc
// y llamar a /api/payphone/track antes de renderizar el botón de PayPhone.
function fbTrackingScript(clientTxId: string, valueCents: number, email: string): string {
  return `
  <script>
    (function() {
      function readCookie(name) {
        var c = document.cookie.split('; ').find(function(r) { return r.startsWith(name + '='); });
        return c ? c.split('=').slice(1).join('=') : null;
      }
      var fbp = readCookie('_fbp');
      var fbc = readCookie('_fbc');
      if (!fbc) {
        var fbclid = new URLSearchParams(window.location.search).get('fbclid');
        if (fbclid) fbc = 'fb.1.' + Date.now() + '.' + fbclid;
      }
      var eventId = (crypto.randomUUID ? crypto.randomUUID() : 'evt_' + Date.now() + '_' + Math.random().toString(36).slice(2));
      window.__pdocEventId = eventId;
      fetch('/api/payphone/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientTxId: '${clientTxId}',
          eventId: eventId,
          value: ${(valueCents / 100).toFixed(2)},
          currency: 'USD',
          fbp: fbp,
          fbc: fbc,
          email: '${email}',
          sourceUrl: window.location.href
        })
      }).catch(function() {});
    })();
  </script>`;
}

const MONTHLY_PRICE_CENTS = 699;
const ANNUAL_PRICE_CENTS = 5871;
const PCA_PRICE_CENTS = 1499;
const PCT_TRIMESTRAL_PRICE_CENTS = 999; // $9.99
const TRIAL_VERIFICATION_CENTS = 100;  // $1.00 verificación de tarjeta para trial

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
  const typeParam = ((req.query.type as string) || "").toLowerCase();
  const isPca = typeParam === "pca";
  const isPcaTrimestral = typeParam === "pca-trimestral";
  const pcaId = (isPca || isPcaTrimestral) ? ((req.query.pcaId as string) || "").trim() : "";

  const isTrial = typeParam === "trial";
  const planParam = ((req.query.plan as string) || "monthly").toLowerCase();
  const plan: PlanType = planParam === "annual" ? "annual" : "monthly";
  const documentId = ((req.query.documentId as string) || "").trim();
  let phoneNumber = ((req.query.phoneNumber as string) || "").trim();
  // Ensure phone has +593 format as required by PayPhone
  if (phoneNumber && !phoneNumber.startsWith("+")) {
    phoneNumber = "+" + phoneNumber;
  }
  const cardHolder = ((req.query.cardHolder as string) || "").trim();

  if (!email || !email.includes("@")) {
    return res.status(400).send("Email requerido");
  }

  const payphoneToken = process.env.PAYPHONE_TOKEN || "";
  const payphoneStoreId = process.env.PAYPHONE_STORE_ID || "";

  if (!payphoneToken || !payphoneStoreId) {
    return res.status(500).send("PayPhone no configurado. Contacte al administrador.");
  }

  // ──────────────── PCA One-Time Payment ────────────────
  if (isPca) {
    if (!pcaId) {
      return res.status(400).send("pcaId requerido para pago PCA");
    }

    try {
      const clientTxId = generateClientTxId(email);

      // Store txId in pca_documents so activate.ts can find the doc later
      await setPcaClientTxId(Number(pcaId), clientTxId);

      // Also create a payment_transactions record for audit trail
      await createPaymentTransaction({
        clientTransactionId: clientTxId,
        email,
        amount: PCA_PRICE_CENTS,
        status: "pending",
        plan: "pca" as any,
        ...(cardHolder ? { cardHolder } : {}),
        ...(documentId ? { documentId } : {}),
        ...(phoneNumber ? { phoneNumber } : {}),
      });

      const responseUrl = `https://planificadoc.app/api/payment/confirm?type=pca&pcaId=${encodeURIComponent(pcaId)}&`;
      const reference = `PlanificaDoc - PCA Unico - ${email}`;

      const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="referrer" content="origin">
  <title>PlanificaDoc - Pago PCA</title>
  <!-- IMPORTANTE: PayPhone NO es ES module — usa window.PPaymentButtonBox. NO usar import(). -->
  <script src="https://cdn.payphonetodoesposible.com/box/v1.1/payphone-payment-box.js"></script>
  <link rel="stylesheet" href="https://cdn.payphonetodoesposible.com/box/v1.1/payphone-payment-box.css">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%); min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 20px; }
    .container { background: white; border-radius: 20px; padding: 32px 24px; max-width: 420px; width: 100%; box-shadow: 0 20px 60px rgba(0,0,0,0.3); }
    .logo-section { text-align: center; margin-bottom: 24px; }
    .logo-section h1 { font-size: 22px; color: #1e3a5f; margin-top: 8px; }
    .price-card { background: linear-gradient(135deg, #14532d, #22c55e); color: white; border-radius: 14px; padding: 20px; text-align: center; margin-bottom: 24px; }
    .price-card .amount { font-size: 42px; font-weight: 800; }
    .price-card .period { font-size: 13px; opacity: 0.9; margin-top: 2px; }
    .badge { display: inline-block; background: rgba(255,255,255,0.25); border-radius: 20px; padding: 4px 14px; font-size: 11px; font-weight: 700; margin-top: 8px; }
    .info-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f0f0f0; font-size: 14px; color: #555; }
    .info-row:last-child { border-bottom: none; }
    .info-row .label { font-weight: 500; }
    .info-row .value { color: #1e3a5f; font-weight: 600; }
    .payment-section { margin-top: 24px; }
    .payment-section h3 { font-size: 16px; color: #333; margin-bottom: 16px; text-align: center; }
    .security-note { text-align: center; font-size: 11px; color: #999; margin-top: 16px; }
    .one-time-note { text-align: center; font-size: 12px; color: #14532d; margin-top: 12px; padding: 10px; background: #dcfce7; border-radius: 8px; border: 1px solid #86efac; }
    .one-time-note strong { display: block; margin-bottom: 4px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo-section">
      <div style="font-size:48px;">📋</div>
      <h1>Planificación Curricular Anual</h1>
    </div>
    <div class="price-card">
      <div class="amount">$14.99</div>
      <div class="period">Pago único — sin suscripción</div>
      <div class="badge">Acceso completo + PDF + Word</div>
    </div>
    <div class="info-row"><span class="label">Documento</span><span class="value">PCA #${pcaId}</span></div>
    <div class="info-row"><span class="label">Email</span><span class="value">${email}</span></div>
    <div class="info-row"><span class="label">Incluye</span><span class="value">9 secciones IA + exportación</span></div>
    <div class="info-row"><span class="label">Tipo</span><span class="value">Un solo cobro</span></div>
    <div class="one-time-note">
      <strong>✅ Pago Único — Sin Recurrencia</strong>
      Se te cobra una sola vez $14.99. Tu PCA queda desbloqueada permanentemente.
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
    try {
      new window.PPaymentButtonBox({
        token: '${payphoneToken}',
        clientTransactionId: '${clientTxId}',
        amount: ${PCA_PRICE_CENTS},
        amountWithoutTax: ${PCA_PRICE_CENTS},
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
        generateToken: false,
      }).render('pp-button');
    } catch(e) {
      console.error('PayPhone PCA error:', e);
      document.getElementById('pp-button').innerHTML = '<p style="color:red;text-align:center;padding:16px;">❌ ' + (e.message || 'Error PayPhone') + '<br><a href="javascript:location.reload()">↺ Recargar</a></p>';
    }
  </script>
</body>
</html>`;

      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.setHeader("Referrer-Policy", "origin");
      return res.send(html);
    } catch (error) {
      console.error("[PayPhone PCA] Error generating payment page:", error);
      return res.status(500).send("Error al generar la pagina de pago PCA");
    }
  }

  // ──────────────── PCT Trimestral One-Time Payment ────────────────
  if (isPcaTrimestral) {
    if (!pcaId) {
      return res.status(400).send("pcaId requerido para pago PCT Trimestral");
    }

    try {
      const clientTxId = generateClientTxId(email);

      await setPcaClientTxId(Number(pcaId), clientTxId);

      await createPaymentTransaction({
        clientTransactionId: clientTxId,
        email,
        amount: PCT_TRIMESTRAL_PRICE_CENTS,
        status: "pending",
        plan: "pca" as any, // reuse "pca" plan so activate.ts unlocks the document
        ...(cardHolder ? { cardHolder } : {}),
        ...(documentId ? { documentId } : {}),
        ...(phoneNumber ? { phoneNumber } : {}),
      });

      const responseUrl = `https://planificadoc.app/api/payment/confirm?type=pca&pcaId=${encodeURIComponent(pcaId)}&`;
      const reference   = `PlanificaDoc - PCT Trimestral - ${email}`;

      const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="referrer" content="origin">
  <title>PlanificaDoc - Pago PCT Trimestral</title>
  <!-- IMPORTANTE: PayPhone NO es ES module — usa window.PPaymentButtonBox. NO usar import(). -->
  <script src="https://cdn.payphonetodoesposible.com/box/v1.1/payphone-payment-box.js"></script>
  <link rel="stylesheet" href="https://cdn.payphonetodoesposible.com/box/v1.1/payphone-payment-box.css">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: linear-gradient(135deg, #0f172a 0%, #0e7490 100%); min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 20px; }
    .container { background: white; border-radius: 20px; padding: 32px 24px; max-width: 420px; width: 100%; box-shadow: 0 20px 60px rgba(0,0,0,0.3); }
    .logo-section { text-align: center; margin-bottom: 24px; }
    .logo-section h1 { font-size: 22px; color: #0e7490; margin-top: 8px; }
    .price-card { background: linear-gradient(135deg, #0e7490, #22d3ee); color: white; border-radius: 14px; padding: 20px; text-align: center; margin-bottom: 24px; }
    .price-card .amount { font-size: 42px; font-weight: 800; }
    .price-card .period { font-size: 13px; opacity: 0.9; margin-top: 2px; }
    .badge { display: inline-block; background: rgba(255,255,255,0.25); border-radius: 20px; padding: 4px 14px; font-size: 11px; font-weight: 700; margin-top: 8px; }
    .info-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f0f0f0; font-size: 14px; color: #555; }
    .info-row:last-child { border-bottom: none; }
    .info-row .label { font-weight: 500; }
    .info-row .value { color: #0e7490; font-weight: 600; }
    .payment-section { margin-top: 24px; }
    .payment-section h3 { font-size: 16px; color: #333; margin-bottom: 16px; text-align: center; }
    .security-note { text-align: center; font-size: 11px; color: #999; margin-top: 16px; }
    .one-time-note { text-align: center; font-size: 12px; color: #0e7490; margin-top: 12px; padding: 10px; background: #e0f2fe; border-radius: 8px; border: 1px solid #7dd3fc; }
    .one-time-note strong { display: block; margin-bottom: 4px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo-section">
      <div style="font-size:48px;">🗓️</div>
      <h1>Plan Curricular Trimestral</h1>
    </div>
    <div class="price-card">
      <div class="amount">$9.99</div>
      <div class="period">Pago único — sin suscripción</div>
      <div class="badge">Acceso completo + PDF + Word</div>
    </div>
    <div class="info-row"><span class="label">Documento</span><span class="value">PCT #${pcaId}</span></div>
    <div class="info-row"><span class="label">Email</span><span class="value">${email}</span></div>
    <div class="info-row"><span class="label">Incluye</span><span class="value">Todas las unidades + exportación</span></div>
    <div class="info-row"><span class="label">Tipo</span><span class="value">Un solo cobro</span></div>
    <div class="one-time-note">
      <strong>✅ Pago Único — Sin Recurrencia</strong>
      Se te cobra una sola vez $9.99. Tu PCT queda desbloqueada permanentemente.
    </div>
    <div class="payment-section">
      <h3>💳 Selecciona tu metodo de pago</h3>
      <div id="pp-loading" style="text-align:center;padding:20px;color:#0e7490;font-size:13px;">⏳ Cargando formulario de pago...</div>
      <div id="pp-button" style="min-height:280px;"></div>
    </div>
    <div class="security-note">
      <span>🔒</span> Pago seguro procesado por PayPhone<br>
      Visa, Mastercard y PayPhone Wallet
    </div>
  </div>
  <script>
    document.getElementById('pp-loading').style.display = 'none';
    try {
      new window.PPaymentButtonBox({
        token: '${payphoneToken}',
        clientTransactionId: '${clientTxId}',
        amount: ${PCT_TRIMESTRAL_PRICE_CENTS},
        amountWithoutTax: ${PCT_TRIMESTRAL_PRICE_CENTS},
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
        generateToken: false,
      }).render('pp-button');
    } catch(e) {
      console.error('PayPhone PCT error:', e);
      document.getElementById('pp-button').innerHTML = '<p style="color:red;text-align:center;padding:16px;">❌ ' + (e?.message || 'Error PayPhone') + '<br><br><a href="javascript:location.reload()" style="color:#0e7490;font-weight:bold;">↺ Recargar</a></p>';
    }
  </script>
</body>
</html>`;

      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.setHeader("Referrer-Policy", "origin");
      return res.send(html);
    } catch (error) {
      console.error("[PayPhone PCT] Error generating payment page:", error);
      return res.status(500).send("Error al generar la pagina de pago PCT");
    }
  }

  // ──────────────── Trial Payment (3 días gratis, $1 verificación) ────────────────
  if (isTrial) {
    if (!documentId || !phoneNumber || !cardHolder) {
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      return res.status(400).send(`<!DOCTYPE html>
<html lang="es"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>PlanificaDoc - Datos incompletos</title>
<style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:linear-gradient(135deg,#0f172a,#1e3a5f);min-height:100vh;display:flex;align-items:center;justify-content:center;padding:20px}.card{background:white;border-radius:20px;padding:36px 28px;max-width:420px;width:100%;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,.3)}.icon{font-size:56px;margin-bottom:16px}h1{font-size:20px;color:#1e3a5f;margin-bottom:10px}p{font-size:14px;color:#555;line-height:1.6;margin-bottom:20px}.btn{display:inline-block;background:#059669;color:white;padding:14px 28px;border-radius:12px;text-decoration:none;font-weight:700;font-size:15px}</style>
</head><body><div class="card">
<div class="icon">⚠️</div>
<h1>Completa tu informacion primero</h1>
<p>Para iniciar tu prueba gratuita necesitamos tu cedula, telefono y nombre del titular de la tarjeta.</p>
<a class="btn" href="https://planificadoc.app">Volver a PlanificaDoc</a>
</div></body></html>`);
    }

    try {
      const clientTxId = generateClientTxId(email);
      const planLabel = plan === "annual" ? "Anual ($58.71/año)" : "Mensual ($6.99/mes)";
      const planFull  = plan === "annual" ? "$58.71" : "$6.99";
      const planPeriod = plan === "annual" ? "al año" : "al mes";

      await createPaymentTransaction({
        clientTransactionId: clientTxId,
        email,
        amount: TRIAL_VERIFICATION_CENTS,
        status: "pending",
        plan: `trial-${plan}` as any, // activate.ts detecta "trial-*"
        ...(cardHolder ? { cardHolder } : {}),
        ...(documentId ? { documentId } : {}),
        ...(phoneNumber ? { phoneNumber } : {}),
      });

      // responseUrl incluye plan para que activate.ts sepa qué plan activar
      const responseUrl = `https://planificadoc.app/api/payment/confirm?type=trial&plan=${plan}&documentId=${encodeURIComponent(documentId)}&phoneNumber=${encodeURIComponent(phoneNumber)}&cardHolder=${encodeURIComponent(cardHolder)}&`;
      const reference   = `PlanificaDoc - Trial 3 dias (verif.) - ${email}`;
      // Para CAPI guardamos el precio real del plan, no el $1 de verificación
      const trialPlanCents = plan === "annual" ? 5871 : 699;
      const fbScript = fbTrackingScript(clientTxId, trialPlanCents, email);

      const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="referrer" content="origin">
  <title>PlanificaDoc - Prueba Gratuita 3 Dias</title>
  <script src="https://cdn.payphonetodoesposible.com/box/v1.1/payphone-payment-box.js"></script>
  <link rel="stylesheet" href="https://cdn.payphonetodoesposible.com/box/v1.1/payphone-payment-box.css">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: linear-gradient(135deg, #0f172a 0%, #065f46 100%); min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 20px; }
    .container { background: white; border-radius: 20px; padding: 32px 24px; max-width: 440px; width: 100%; box-shadow: 0 20px 60px rgba(0,0,0,0.3); }
    .logo-section { text-align: center; margin-bottom: 20px; }
    .logo-section h1 { font-size: 20px; color: #065f46; margin-top: 8px; }
    .trial-hero { background: linear-gradient(135deg, #065f46, #059669); color: white; border-radius: 16px; padding: 24px 20px; text-align: center; margin-bottom: 20px; }
    .trial-hero .big { font-size: 40px; font-weight: 900; line-height: 1; }
    .trial-hero .sub { font-size: 16px; opacity: 0.95; margin-top: 4px; font-weight: 600; }
    .trial-hero .then { font-size: 12px; opacity: 0.85; margin-top: 10px; }
    .trial-hero .plan-badge { display: inline-block; background: rgba(255,255,255,0.2); border-radius: 20px; padding: 4px 14px; font-size: 12px; font-weight: 700; margin-top: 8px; }
    .info-box { background: #f0fdf4; border: 1px solid #86efac; border-radius: 12px; padding: 16px; margin-bottom: 20px; }
    .info-row { display: flex; gap: 10px; align-items: flex-start; font-size: 13px; color: #065f46; margin-bottom: 10px; }
    .info-row:last-child { margin-bottom: 0; }
    .info-row .icon { font-size: 16px; flex-shrink: 0; }
    .verif-note { background: #fef9c3; border: 1px solid #fde047; border-radius: 10px; padding: 12px 14px; font-size: 12px; color: #713f12; margin-bottom: 20px; line-height: 1.5; }
    .verif-note strong { display: block; margin-bottom: 4px; font-size: 13px; }
    .payment-section h3 { font-size: 15px; color: #333; margin-bottom: 14px; text-align: center; }
    .security-note { text-align: center; font-size: 11px; color: #999; margin-top: 14px; }
    #pp-button { min-height: 260px; }
  </style>
  ${fbScript}
</head>
<body>
  <div class="container">
    <div class="logo-section">
      <div style="font-size:44px;">🎓</div>
      <h1>PlanificaDoc Ecuador</h1>
    </div>
    <div class="trial-hero">
      <div class="big">3 DIAS</div>
      <div class="sub">GRATIS</div>
      <div class="plan-badge">Plan ${planLabel}</div>
      <div class="then">Luego ${planFull} ${planPeriod} — cancela cuando quieras</div>
    </div>
    <div class="info-box">
      <div class="info-row"><span class="icon">✅</span><span>Acceso completo a <strong>todas las funciones</strong> durante 3 dias</span></div>
      <div class="info-row"><span class="icon">📋</span><span>Genera planificaciones con IA, exporta en Word y PDF</span></div>
      <div class="info-row"><span class="icon">🔄</span><span>Tras los 3 dias se cobra <strong>${planFull} ${planPeriod}</strong> automaticamente</span></div>
      <div class="info-row"><span class="icon">❌</span><span>Puedes <strong>cancelar cuando quieras</strong> desde la app, sin penalidad</span></div>
    </div>
    <div class="verif-note">
      <strong>⚠️ Nota importante sobre el cobro de $1.00</strong>
      Para verificar tu tarjeta se realizara un cargo de <strong>$1.00</strong> ahora mismo.
      Este valor sera <strong>descontado de tu primera mensualidad</strong> (pagaras ${plan === "annual" ? "$57.71" : "$5.99"} en 3 dias en lugar de ${planFull}).
    </div>
    <div class="payment-section">
      <h3>💳 Agrega tu tarjeta para iniciar la prueba</h3>
      <div id="pp-button"></div>
    </div>
    <div class="security-note">
      🔒 Pago seguro — PayPhone · Visa · Mastercard
    </div>
  </div>
  <script>
    try {
      new window.PPaymentButtonBox({
        token: '${payphoneToken}',
        clientTransactionId: '${clientTxId}',
        amount: ${TRIAL_VERIFICATION_CENTS},
        amountWithoutTax: ${TRIAL_VERIFICATION_CENTS},
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
        phoneNumber: "${phoneNumber}",
        generateToken: true,
      }).render('pp-button');
    } catch(e) {
      console.error('PayPhone trial error:', e);
      document.getElementById('pp-button').innerHTML = '<p style="color:red;text-align:center;padding:16px;">❌ ' + (e?.message || 'Error PayPhone') + '<br><a href="javascript:location.reload()">↺ Recargar</a></p>';
    }
  </script>
</body>
</html>`;

      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.setHeader("Referrer-Policy", "origin");
      return res.send(html);
    } catch (error) {
      console.error("[PayPhone Trial] Error generating trial payment page:", error);
      return res.status(500).send("Error al generar la pagina de prueba gratuita");
    }
  }

  // ──────────────── Subscription Payment (existing flow) ────────────────
  // These fields are REQUIRED for recurring billing (card tokenization).
  if (!documentId || !phoneNumber || !cardHolder) {
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    return res.status(400).send(`<!DOCTYPE html>
<html lang="es"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>PlanificaDoc - Datos incompletos</title>
<style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:linear-gradient(135deg,#0f172a,#1e3a5f);min-height:100vh;display:flex;align-items:center;justify-content:center;padding:20px}.card{background:white;border-radius:20px;padding:36px 28px;max-width:420px;width:100%;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,.3)}.icon{font-size:56px;margin-bottom:16px}h1{font-size:20px;color:#1e3a5f;margin-bottom:10px}p{font-size:14px;color:#555;line-height:1.6;margin-bottom:20px}.btn{display:inline-block;background:#059669;color:white;padding:14px 28px;border-radius:12px;text-decoration:none;font-weight:700;font-size:15px}.note{font-size:12px;color:#999;margin-top:16px}</style>
</head><body><div class="card">
<div class="icon">📋</div>
<h1>Completa tu informacion primero</h1>
<p>Para activar la <strong>renovacion automatica</strong> necesitamos tu cedula, telefono y nombre del titular. Ingresa desde la pagina principal y completa el formulario.</p>
<a class="btn" href="https://planificadoc.app">Ir a PlanificaDoc</a>
<p class="note">Una vez ahi, registrate o inicia sesion y luego selecciona tu plan de pago.</p>
</div></body></html>`);
  }

  const enableRecurring = true; // always enable since fields are now required

  try {
    const pricing = getPriceForPlan(plan);
    const clientTxId = generateClientTxId(email);

    await createPaymentTransaction({
      clientTransactionId: clientTxId,
      email,
      amount: pricing.amount,
      status: "pending",
      plan,
      ...(cardHolder ? { cardHolder } : {}),
      ...(documentId ? { documentId } : {}),
      ...(phoneNumber ? { phoneNumber } : {}),
    });

    // Always include these params in the responseUrl (empty string if not provided).
    // PayPhone appends &id=xxx&clientTransactionId=yyy after the trailing &.
    const responseUrl = `https://planificadoc.app/api/payment/confirm?documentId=${encodeURIComponent(documentId)}&phoneNumber=${encodeURIComponent(phoneNumber)}&cardHolder=${encodeURIComponent(cardHolder)}&`;
    const fbScript = fbTrackingScript(clientTxId, pricing.amount, email);

    const planLabel = plan === "annual" ? "Anual (12 meses)" : "Mensual";
    const periodLabel = plan === "annual" ? "por año" : "por mes";
    const reference = `PlanificaDoc - Suscripcion ${planLabel} - ${email}`;
    const savingsBadge = plan === "annual" ? '<div class="savings-badge">Ahorras 30%</div>' : "";

    const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="referrer" content="origin">
  <title>PlanificaDoc - Pago Seguro</title>
  <!-- IMPORTANTE: PayPhone NO es ES module — usa window.PPaymentButtonBox. NO usar import(). -->
  <script src="https://cdn.payphonetodoesposible.com/box/v1.1/payphone-payment-box.js"></script>
  <link rel="stylesheet" href="https://cdn.payphonetodoesposible.com/box/v1.1/payphone-payment-box.css">
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
  ${fbScript}
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
    <div class="info-row"><span class="label">Renovacion</span><span class="value">Automatica cada ${pricing.durationMonths === 1 ? "mes" : "año"}</span></div>
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
    try {
      new window.PPaymentButtonBox({
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
        phoneNumber: "${phoneNumber}",
        generateToken: true,
      }).render('pp-button');
    } catch(e) {
      console.error('PayPhone init error:', e);
      document.getElementById('pp-button').innerHTML = '<p style="color:red;text-align:center;">Error al cargar el formulario de pago. Recarga la pagina.</p>';
    }
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
