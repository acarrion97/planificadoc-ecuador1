import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getPaymentTransaction } from "../_lib/db";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Log ALL params PayPhone sends to responseUrl — helps debug tokenization
  console.log("[PayPhone] Confirm URL params:", JSON.stringify(req.query));

  const payphoneTxId = req.query.id as string;
  const clientTxId = req.query.clientTransactionId as string;
  const documentId = ((req.query.documentId as string) || "").trim();
  const phoneNumber = ((req.query.phoneNumber as string) || "").trim();
  const cardHolder = ((req.query.cardHolder as string) || "").trim();
  // PayPhone may send cardToken directly in the responseUrl redirect when tokenization is enabled
  const urlCardToken = ((req.query.cardToken as string) || "").trim();
  if (urlCardToken) {
    console.log("[PayPhone] cardToken received in responseUrl:", urlCardToken.substring(0, 20) + "...");
  } else {
    console.log("[PayPhone] No cardToken in responseUrl params");
  }

  const payphoneToken = process.env.PAYPHONE_TOKEN || "";

  if (!payphoneTxId || !clientTxId) {
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    return res.send(buildResultPageHTML(false, "Parametros de transaccion faltantes."));
  }

  try {
    const tx = await getPaymentTransaction(clientTxId);
    if (!tx) {
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      return res.send(buildResultPageHTML(false, "Transaccion no encontrada."));
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
      urlCardToken,
    }));
  } catch (error) {
    console.error("[PayPhone] Confirm page error:", error);
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.send(buildResultPageHTML(false, "Error al procesar. Intenta de nuevo."));
  }
}

function buildConfirmBridgeHTML(config: {
  payphoneTxId: string;
  clientTxId: string;
  token: string;
  email: string;
  documentId?: string;
  phoneNumber?: string;
  cardHolder?: string;
  urlCardToken?: string;
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
    .success-badge { display: inline-block; background: #059669; color: white; padding: 6px 20px; border-radius: 20px; font-weight: 700; font-size: 14px; margin-bottom: 16px; }
    .error-badge { display: inline-block; background: #DC2626; color: white; padding: 6px 20px; border-radius: 20px; font-weight: 700; font-size: 14px; margin-bottom: 16px; }
    .email-info { background: #f0f9ff; border-radius: 10px; padding: 12px; font-size: 14px; color: #1e3a5f; margin: 16px 0; }
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
        const confirmRes = await fetch('https://pay.payphonetodoesposible.com/api/button/V2/Confirm', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ${config.token}'
          },
          body: JSON.stringify({
            id: ${config.payphoneTxId},
            clientTxId: '${config.clientTxId}',
            generateToken: true
          })
        });
        const confirmData = await confirmRes.json();
        console.log('PayPhone confirm keys:', Object.keys(confirmData || {}));
        console.log('PayPhone cardToken in confirm response:', confirmData.cardToken || 'NONE');
        // If PayPhone sent cardToken in the responseUrl (not in Confirm response), use it
        const urlCardToken = '${config.urlCardToken || ""}';
        if (!confirmData.cardToken && urlCardToken) {
          confirmData.cardToken = urlCardToken;
          console.log('Using urlCardToken from responseUrl redirect:', urlCardToken.substring(0, 20));
        }
        const tokenData = {
          cardHolder: '${config.cardHolder || ""}',
          documentId: '${config.documentId || ""}',
          phoneNumber: '${config.phoneNumber || ""}'
        };
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
            ? '<p style="font-size:13px;color:#059669;margin-top:8px;">🔄 Renovacion automatica activada</p>'
            : '';
          showResult(
            '<div class="success-icon">✅</div>' +
            '<div class="success-badge">PAGO EXITOSO</div>' +
            '<h1>Pago Exitoso</h1>' +
            '<p class="status">Tu suscripcion ha sido activada correctamente.</p>' +
            recurringMsg +
            '<div class="email-info"><strong>Tu cuenta:</strong> ${config.email}<br><small>Usa este email para iniciar sesion en la app.</small></div>' +
            '<p class="note">Puedes cerrar esta ventana y volver a la app. Tu acceso ya esta activo.</p>'
          );
        } else if (confirmData.statusCode === 2) {
          showResult(
            '<div class="error-icon">❌</div>' +
            '<div class="error-badge">PAGO CANCELADO</div>' +
            '<h1>Pago Cancelado</h1>' +
            '<p class="status">' + (activateResult.message || 'El pago fue cancelado.') + '</p>' +
            '<p class="note">Si el problema persiste, contactanos por WhatsApp.</p>'
          );
        } else {
          showResult(
            '<div class="error-icon">❌</div>' +
            '<div class="error-badge">ERROR</div>' +
            '<h1>Error en el Pago</h1>' +
            '<p class="status">' + (activateResult.message || confirmData.message || 'Error desconocido') + '</p>' +
            '<p class="note">Si el problema persiste, contactanos por WhatsApp.</p>'
          );
        }
      } catch (error) {
        console.error('Confirm error:', error);
        showResult(
          '<div class="error-icon">❌</div>' +
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

function buildResultPageHTML(success: boolean, message: string, email?: string): string {
  const bgColor = success ? "#059669" : "#DC2626";
  const emoji = success ? "✅" : "❌";
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
    .icon { font-size: 64px; margin-bottom: 16px; }
    h1 { font-size: 22px; color: #1e3a5f; margin-bottom: 12px; }
    .message { font-size: 15px; color: #555; line-height: 1.5; margin-bottom: 24px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="icon">${emoji}</div>
    <h1>${title}</h1>
    <p class="message">${message}</p>
    ${success && email ? `<p style="background:#f0f9ff;border-radius:10px;padding:12px;font-size:14px;color:#1e3a5f;"><strong>Tu cuenta:</strong> ${email}</p>` : ""}
  </div>
</body>
</html>`;
}
