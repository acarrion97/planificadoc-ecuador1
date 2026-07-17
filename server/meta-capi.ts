// server/meta-capi.ts
// Envía eventos a la Meta Conversions API (CAPI) desde el servidor.
// Se usa en el paso de confirmación de PayPhone, cuando ya SABEMOS que el pago fue aprobado.

import crypto from "node:crypto";

const META_GRAPH_VERSION = "v21.0";

type PurchaseInput = {
  eventId: string; // MISMO id que el píxel del navegador -> Meta deduplica
  value: number;   // en unidades de moneda, ej. 9.99 (NO centavos)
  currency: string; // "USD"
  eventSourceUrl?: string | null;
  fbp?: string | null;
  fbc?: string | null;
  clientIp?: string | null;
  userAgent?: string | null;
  email?: string | null;
  phone?: string | null;
  externalId?: string | null;
  eventTime?: number;
};

// email: trim + lowercase + SHA-256
function hashEmail(email: string): string {
  return crypto.createHash("sha256").update(email.trim().toLowerCase()).digest("hex");
}

// phone: solo dígitos → normalizar Ecuador (09... → 5939..., 9... de 9 dígitos → 5939...)
// → SHA-256  (nunca lowercasear fbp/fbc — esos se pasan directo)
function hashPhone(phone: string): string {
  let digits = phone.replace(/[^0-9]/g, "");
  // Ecuador: números locales empiezan con 0 (ej. 0987654321 → 10 dígitos)
  if (digits.startsWith("0") && digits.length === 10) {
    digits = "593" + digits.slice(1); // 0987... → 593987...
  } else if (digits.length === 9 && !digits.startsWith("593")) {
    // ya sin el 0 inicial (ej. 987654321)
    digits = "593" + digits;
  }
  return crypto.createHash("sha256").update(digits).digest("hex");
}

export async function sendMetaPurchase(input: PurchaseInput) {
  const pixelId = process.env.META_PIXEL_ID;
  const token   = process.env.META_CAPI_TOKEN;

  if (!pixelId || !token) {
    console.warn("[meta-capi] META_PIXEL_ID o META_CAPI_TOKEN no configurados — saltando");
    return { ok: false, skipped: true };
  }

  const userData: Record<string, unknown> = {};
  if (input.fbp)        userData.fbp = input.fbp;
  if (input.fbc)        userData.fbc = input.fbc;
  if (input.clientIp)   userData.client_ip_address = input.clientIp;
  if (input.userAgent)  userData.client_user_agent = input.userAgent;
  if (input.email)      userData.em = [hashEmail(input.email)];
  if (input.phone)      userData.ph = [hashPhone(input.phone)];
  if (input.externalId) userData.external_id = [sha256(input.externalId)];

  const body: Record<string, unknown> = {
    data: [
      {
        event_name: "Purchase",
        event_time: input.eventTime ?? Math.floor(Date.now() / 1000),
        event_id: input.eventId,
        action_source: "website",
        event_source_url: input.eventSourceUrl ?? undefined,
        user_data: userData,
        custom_data: {
          value: Number(input.value.toFixed(2)),
          currency: input.currency,
        },
      },
    ],
  };

  if (process.env.META_TEST_EVENT_CODE) {
    body.test_event_code = process.env.META_TEST_EVENT_CODE;
  }

  const url = `https://graph.facebook.com/${META_GRAPH_VERSION}/${pixelId}/events?access_token=${token}`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const json = (await res.json().catch(() => ({}))) as Record<string, unknown>;

    if (!res.ok) {
      console.error("[meta-capi] Purchase falló", res.status, json);
      return { ok: false, status: res.status, response: json };
    }

    console.log("[meta-capi] Purchase enviado eventId=%s", input.eventId, json);
    return { ok: true, response: json };
  } catch (err: any) {
    console.error("[meta-capi] fetch error:", err?.message);
    return { ok: false, error: err?.message };
  }
}
