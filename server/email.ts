/**
 * Email notifications via ZeptoMail
 * Handles all transactional emails for PlanificaDoc Ecuador
 */

const ZEPTO_API = "https://api.zeptomail.com/v1.1/email";
const FROM_EMAIL = "noreply@planificadoc.app";
const FROM_NAME = "PlanificaDoc Ecuador";

async function sendEmail(to: string, subject: string, html: string): Promise<boolean> {
  const token = process.env.ZEPTO_TOKEN;
  if (!token) {
    console.error("[Email] ZEPTO_TOKEN no configurado");
    return false;
  }

  try {
    const resp = await fetch(ZEPTO_API, {
      method: "POST",
      headers: {
        "Authorization": token,
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        from: { address: FROM_EMAIL, name: FROM_NAME },
        to: [{ email_address: { address: to } }],
        subject,
        htmlbody: html,
      }),
    });

    if (!resp.ok) {
      const err = await resp.text();
      console.error(`[Email] Error enviando a ${to}: ${resp.status} — ${err}`);
      return false;
    }

    console.log(`[Email] Enviado a ${to}: "${subject}"`);
    return true;
  } catch (err) {
    console.error(`[Email] Excepción enviando a ${to}:`, err);
    return false;
  }
}

// ── Templates ─────────────────────────────────────────────────────────────────

const baseStyle = `
  font-family: Arial, Helvetica, sans-serif;
  max-width: 560px;
  margin: 0 auto;
  background: #f9f9f9;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e5e5e5;
`;

const headerHtml = `
  <div style="background:#003366;padding:24px 32px;">
    <h1 style="margin:0;color:#fff;font-size:20px;font-weight:700;letter-spacing:0.5px;">
      PlanificaDoc Ecuador
    </h1>
    <p style="margin:4px 0 0;color:#a8c4e0;font-size:13px;">
      Planificación curricular para docentes
    </p>
  </div>
`;

const footerHtml = `
  <div style="background:#f0f0f0;padding:16px 32px;text-align:center;border-top:1px solid #e5e5e5;">
    <p style="margin:0;color:#888;font-size:11px;">
      PlanificaDoc Ecuador · <a href="https://planificadoc.app" style="color:#003366;">planificadoc.app</a>
    </p>
    <p style="margin:4px 0 0;color:#aaa;font-size:10px;">
      Si no reconoces este correo, ignóralo.
    </p>
  </div>
`;

function wrapTemplate(body: string): string {
  return `
    <div style="${baseStyle}">
      ${headerHtml}
      <div style="padding:32px;">
        ${body}
      </div>
      ${footerHtml}
    </div>
  `;
}

const btnStyle = `
  display:inline-block;
  background:#003366;
  color:#fff;
  padding:12px 28px;
  border-radius:6px;
  text-decoration:none;
  font-weight:700;
  font-size:14px;
  margin-top:20px;
`;

// ── Email 1: Aviso 7 días antes del vencimiento (solo plan No-recurrente) ─────

export async function sendRenewalReminderEmail(email: string, plan: string, vencimiento: string): Promise<boolean> {
  const planLabel = plan === "annual" ? "Anual" : "Mensual";
  const html = wrapTemplate(`
    <h2 style="color:#003366;margin:0 0 16px;">Tu suscripción vence pronto ⏰</h2>
    <p style="color:#333;font-size:14px;line-height:1.6;">
      Tu plan <strong>${planLabel}</strong> vence el <strong>${vencimiento}</strong>.
      Renuévalo para seguir generando planificaciones sin interrupciones.
    </p>
    <p style="color:#555;font-size:13px;line-height:1.6;margin-top:12px;">
      Con tu suscripción activa puedes:
    </p>
    <ul style="color:#555;font-size:13px;line-height:1.8;padding-left:20px;">
      <li>Generar Planificaciones Curriculares Anuales (PCA)</li>
      <li>Crear Planificaciones Semanales con IA</li>
      <li>Exportar en PDF y Word formato MinEduc</li>
    </ul>
    <div style="text-align:center;">
      <a href="https://planificadoc.app/paywall" style="${btnStyle}">
        Renovar mi suscripción
      </a>
    </div>
    <p style="color:#888;font-size:12px;margin-top:24px;text-align:center;">
      Si ya renovaste, ignora este mensaje.
    </p>
  `);

  return sendEmail(email, "Tu suscripción PlanificaDoc vence en 7 días", html);
}

// ── Email 2: Suscripción expirada ─────────────────────────────────────────────

export async function sendExpiredEmail(email: string, plan: string): Promise<boolean> {
  const planLabel = plan === "annual" ? "Anual" : "Mensual";
  const html = wrapTemplate(`
    <h2 style="color:#cc0000;margin:0 0 16px;">Tu suscripción ha expirado 😔</h2>
    <p style="color:#333;font-size:14px;line-height:1.6;">
      Tu plan <strong>${planLabel}</strong> de PlanificaDoc ha llegado a su fecha de vencimiento.
      Tu acceso a la generación de planificaciones está temporalmente suspendido.
    </p>
    <p style="color:#555;font-size:13px;line-height:1.6;margin-top:12px;">
      Reactiva tu cuenta en menos de 2 minutos y vuelve a planificar sin límites.
    </p>
    <div style="text-align:center;">
      <a href="https://planificadoc.app/paywall" style="${btnStyle}">
        Reactivar mi cuenta
      </a>
    </div>
    <p style="color:#888;font-size:12px;margin-top:24px;text-align:center;">
      ¿Tienes preguntas? Escríbenos a <a href="mailto:soporte@planificadoc.app" style="color:#003366;">soporte@planificadoc.app</a>
    </p>
  `);

  return sendEmail(email, "Tu suscripción PlanificaDoc ha expirado", html);
}

// ── Email 3: Confirmación de cobro recurrente exitoso ─────────────────────────

export async function sendRenewalSuccessEmail(email: string, plan: string, nuevoVencimiento: string, monto: string): Promise<boolean> {
  const planLabel = plan === "annual" ? "Anual" : "Mensual";
  const html = wrapTemplate(`
    <h2 style="color:#006633;margin:0 0 16px;">¡Suscripción renovada! ✅</h2>
    <p style="color:#333;font-size:14px;line-height:1.6;">
      Tu plan <strong>${planLabel}</strong> se renovó automáticamente. Todo listo para seguir planificando.
    </p>
    <div style="background:#f0f7f0;border:1px solid #c3e6c3;border-radius:6px;padding:16px;margin:20px 0;">
      <table style="width:100%;font-size:13px;color:#333;">
        <tr>
          <td style="padding:4px 0;color:#666;">Plan:</td>
          <td style="padding:4px 0;font-weight:700;">${planLabel}</td>
        </tr>
        <tr>
          <td style="padding:4px 0;color:#666;">Monto cobrado:</td>
          <td style="padding:4px 0;font-weight:700;">$${monto} USD</td>
        </tr>
        <tr>
          <td style="padding:4px 0;color:#666;">Próximo vencimiento:</td>
          <td style="padding:4px 0;font-weight:700;">${nuevoVencimiento}</td>
        </tr>
      </table>
    </div>
    <div style="text-align:center;">
      <a href="https://planificadoc.app" style="${btnStyle}">
        Ir a PlanificaDoc
      </a>
    </div>
  `);

  return sendEmail(email, "Tu suscripción PlanificaDoc fue renovada exitosamente", html);
}

// ── Email 4: Cobro fallido ─────────────────────────────────────────────────────

export async function sendChargeFailedEmail(email: string, plan: string, intento: number, maxIntentos: number): Promise<boolean> {
  const planLabel = plan === "annual" ? "Anual" : "Mensual";
  const esUltimo = intento >= maxIntentos;
  const html = wrapTemplate(`
    <h2 style="color:#cc6600;margin:0 0 16px;">
      ${esUltimo ? "No pudimos renovar tu suscripción ❌" : `Problema con tu pago (intento ${intento}/${maxIntentos}) ⚠️`}
    </h2>
    <p style="color:#333;font-size:14px;line-height:1.6;">
      ${esUltimo
        ? `No fue posible renovar tu plan <strong>${planLabel}</strong> después de ${maxIntentos} intentos. Tu suscripción ha sido cancelada.`
        : `Tuvimos un problema al cobrar tu tarjeta para renovar el plan <strong>${planLabel}</strong>. Volveremos a intentarlo automáticamente.`
      }
    </p>
    ${esUltimo ? `
      <p style="color:#555;font-size:13px;line-height:1.6;margin-top:12px;">
        Para recuperar tu acceso, puedes suscribirte nuevamente con una tarjeta válida.
      </p>
      <div style="text-align:center;">
        <a href="https://planificadoc.app/paywall" style="${btnStyle}">
          Reactivar con nueva tarjeta
        </a>
      </div>
    ` : `
      <p style="color:#555;font-size:13px;line-height:1.6;margin-top:12px;">
        Si el problema persiste, puedes actualizar tu método de pago.
      </p>
      <div style="text-align:center;">
        <a href="https://planificadoc.app/paywall" style="${btnStyle}">
          Actualizar método de pago
        </a>
      </div>
    `}
    <p style="color:#888;font-size:12px;margin-top:24px;text-align:center;">
      ¿Necesitas ayuda? <a href="mailto:soporte@planificadoc.app" style="color:#003366;">soporte@planificadoc.app</a>
    </p>
  `);

  const subject = esUltimo
    ? "Tu suscripción PlanificaDoc fue cancelada por fallo de pago"
    : `Problema con el pago de PlanificaDoc (intento ${intento}/${maxIntentos})`;

  return sendEmail(email, subject, html);
}

// ── Email 5: Campaña de reactivación (usuarios expirados) ─────────────────────

export async function sendPromoReactivacionEmail(email: string): Promise<boolean> {
  const html = wrapTemplate(`
    <h2 style="color:#003366;margin:0 0 16px;">¡Te extrañamos en PlanificaDoc! 👋</h2>
    <p style="color:#333;font-size:15px;line-height:1.7;">
      PlanificaDoc tiene <strong>muchas más actualizaciones</strong> de las que nos encantaría
      pudieras explorar. No dejes que la carga docente consuma tu valioso tiempo
      haciendo tareas repetitivas.
    </p>
    <p style="color:#333;font-size:15px;line-height:1.7;margin-top:12px;">
      Renueva tu acceso y vuelve a generar planificaciones curriculares, planes
      diarios y semanales con inteligencia artificial — en minutos.
    </p>
    <div style="text-align:center;">
      <a href="https://www.planificadoc.app" style="${btnStyle}">
        🔄 Renovar mi acceso
      </a>
    </div>
    <p style="color:#555;font-size:13px;line-height:1.6;margin-top:24px;text-align:center;">
      ¿Deseas una <strong>asesoría personalizada</strong> para enterarte de todo lo nuevo?<br>
      Contáctanos por WhatsApp:
      <a href="https://wa.me/593978833533" style="color:#25D366;font-weight:700;">
        📱 0978833533
      </a>
    </p>
  `);

  return sendEmail(email, "PlanificaDoc tiene novedades para ti 🎉", html);
}
