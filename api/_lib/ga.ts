// Google Analytics 4 para las páginas de pago generadas por el servidor
// (api/payment/page.ts y api/payment/confirm.ts). Esas páginas son HTML aparte
// y NO pasan por app/+html.tsx, por eso necesitan su propio tag.
//
// PRIVACIDAD: las URLs de pago llevan email, cédula, teléfono, titular de la
// tarjeta y el token de la tarjeta en el query string. Por eso page_location se
// fija SIEMPRE a origin + pathname: nunca se envía el query string a Google.

export const GA_MEASUREMENT_ID = "G-1C66PK389J";

type PlanType = "monthly" | "annual";
type CheckoutFlow = "trial" | "subscription";

const PLAN_ITEM: Record<PlanType, { item_id: string; item_name: string }> = {
  monthly: { item_id: "plan_monthly", item_name: "Plan mensual" },
  annual: { item_id: "plan_annual", item_name: "Plan anual" },
};

/**
 * Tag de GA4 + helper `window.__gaTrackActivation(resp, fallbackTxId)`.
 * Va dentro del <head>. Si algo falla, nunca debe romper el flujo de pago.
 */
export function gaHeadSnippet(): string {
  return `
  <script async src="https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}"></script>
  <script>
    (function () {
      try {
        window.dataLayer = window.dataLayer || [];
        window.gtag = function () { window.dataLayer.push(arguments); };
        window.gtag('js', new Date());
        window.gtag('config', '${GA_MEASUREMENT_ID}', {
          page_location: location.origin + location.pathname,
          page_referrer: ''
        });

        // Evento tras activar el pago. "resp" es la respuesta de /api/payment/activate.
        //  - trial   -> start_trial (solo se cobró $1 de verificación; NO es un purchase)
        //  - pca / suscripción pagada -> purchase
        window.__gaTrackActivation = function (resp, fallbackTxId) {
          try {
            if (!resp || !resp.success || resp.alreadyActivated) return;
            var txId = resp.clientTxId || fallbackTxId || '';
            if (resp.type === 'trial') {
              window.gtag('event', 'start_trial', {
                transaction_id: txId,
                plan: resp.plan || '',
                plan_value: resp.planValue || 0,
                currency: 'USD'
              });
              return;
            }
            var isPca = resp.type === 'pca';
            var amount = Number(resp.amount || 0);
            window.gtag('event', 'purchase', {
              transaction_id: txId,
              value: amount,
              currency: 'USD',
              items: [{
                item_id: isPca ? 'pca_document' : 'plan_' + (resp.plan || 'monthly'),
                item_name: isPca ? 'Documento PCA' : (resp.plan === 'annual' ? 'Plan anual' : 'Plan mensual'),
                price: amount,
                quantity: 1
              }]
            });
          } catch (e) {}
        };
      } catch (e) {}
    })();
  </script>`;
}

/** Evento begin_checkout para la página donde se muestra el botón de PayPhone. */
export function gaBeginCheckoutSnippet(plan: PlanType, flow: CheckoutFlow, planPriceCents: number): string {
  const price = Number((planPriceCents / 100).toFixed(2));
  const params = {
    currency: "USD",
    value: price,
    plan,
    flow,
    items: [{ ...PLAN_ITEM[plan], price, quantity: 1 }],
  };
  // JSON.stringify solo recibe valores internos (nunca datos del usuario).
  return `
  <script>
    try { window.gtag && window.gtag('event', 'begin_checkout', ${JSON.stringify(params)}); } catch (e) {}
  </script>`;
}
