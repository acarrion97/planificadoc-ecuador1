import { describe, it, expect } from "vitest";
import { gaHeadSnippet, gaBeginCheckoutSnippet, GA_MEASUREMENT_ID } from "../api/_lib/ga";

/** Extrae el contenido de los <script> inline (sin src). */
function inlineScripts(html: string): string[] {
  return [...html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)].map((m) => m[1]);
}

/** Ejecuta los scripts en un "navegador" falso y devuelve lo que quedó en dataLayer. */
function run(html: string, loc: { origin: string; pathname: string; search: string }, win: any = {}) {
  const location = { ...loc, hostname: "planificadoc.app" };
  for (const code of inlineScripts(html)) {
    new Function("window", "location", code)(win, location);
  }
  return win;
}

const CONFIRM_URL = {
  origin: "https://planificadoc.app",
  pathname: "/api/payment/confirm",
  // Así llegan las URLs reales de pago: con datos personales y el token de la tarjeta.
  search: "?email=docente@ejemplo.com&documentId=0912345678&phoneNumber=%2B593987654321&cardHolder=Docente%20Ejemplo&ctoken=SECRET",
};

const events = (win: any) =>
  (win.dataLayer as IArguments[]).map((a) => Array.from(a)).filter((a) => a[0] === "event");

describe("Google Analytics en las páginas de pago", () => {
  it("carga gtag.js con el ID de medición correcto", () => {
    expect(gaHeadSnippet()).toContain(`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`);
    expect(GA_MEASUREMENT_ID).toBe("G-1C66PK389J");
  });

  it("nunca envía el query string (datos personales) a Google", () => {
    const win = run(gaHeadSnippet(), CONFIRM_URL);
    const config = (win.dataLayer as IArguments[]).map((a) => Array.from(a)).find((a) => a[0] === "config") as any[];
    expect(config[1]).toBe(GA_MEASUREMENT_ID);
    expect(config[2].page_location).toBe("https://planificadoc.app/api/payment/confirm");
    expect(JSON.stringify(win.dataLayer)).not.toMatch(/0912345678|docente@ejemplo|Docente|SECRET|987654321/);
  });

  it("start_trial al activar una prueba (no es un purchase, solo se cobró $1)", () => {
    const win = run(gaHeadSnippet(), CONFIRM_URL);
    win.__gaTrackActivation(
      { success: true, type: "trial", clientTxId: "PDOC-1", plan: "annual", planValue: 58.71 },
      "fallback",
    );
    const ev = events(win);
    expect(ev).toHaveLength(1);
    expect(ev[0][1]).toBe("start_trial");
    expect(ev[0][2]).toMatchObject({ transaction_id: "PDOC-1", plan: "annual", plan_value: 58.71 });
    expect(ev[0][2]).not.toHaveProperty("value");
  });

  it("purchase al activar una suscripción pagada", () => {
    const win = run(gaHeadSnippet(), CONFIRM_URL);
    win.__gaTrackActivation({ success: true, clientTxId: "PDOC-2", plan: "monthly", amount: 6.99 }, "");
    const ev = events(win);
    expect(ev).toHaveLength(1);
    expect(ev[0][1]).toBe("purchase");
    expect(ev[0][2]).toMatchObject({ transaction_id: "PDOC-2", value: 6.99, currency: "USD" });
    expect(ev[0][2].items[0]).toMatchObject({ item_id: "plan_monthly", price: 6.99, quantity: 1 });
  });

  it("purchase al pagar un documento PCA", () => {
    const win = run(gaHeadSnippet(), CONFIRM_URL);
    win.__gaTrackActivation({ success: true, type: "pca", pcaId: 7, clientTxId: "PDOC-3", amount: 14.99 }, "");
    const ev = events(win);
    expect(ev[0][1]).toBe("purchase");
    expect(ev[0][2].items[0].item_id).toBe("pca_document");
    expect(ev[0][2].value).toBe(14.99);
  });

  it("usa el id del servidor de respaldo si la respuesta no trae clientTxId", () => {
    const win = run(gaHeadSnippet(), CONFIRM_URL);
    win.__gaTrackActivation({ success: true, plan: "annual", amount: 58.71 }, "PDOC-FALLBACK");
    expect(events(win)[0][2].transaction_id).toBe("PDOC-FALLBACK");
  });

  it("no cuenta nada si el pago falló o ya estaba activado (recargas de la página)", () => {
    const win = run(gaHeadSnippet(), CONFIRM_URL);
    win.__gaTrackActivation({ success: false, message: "Pago cancelado" }, "x");
    win.__gaTrackActivation({ success: true, alreadyActivated: true }, "x");
    win.__gaTrackActivation(null, "x");
    win.__gaTrackActivation(undefined, "x");
    expect(events(win)).toHaveLength(0);
  });

  it("begin_checkout lleva el plan y el precio reales", () => {
    const win = run(gaHeadSnippet() + gaBeginCheckoutSnippet("annual", "subscription", 5871), CONFIRM_URL);
    const ev = events(win);
    expect(ev).toHaveLength(1);
    expect(ev[0][1]).toBe("begin_checkout");
    expect(ev[0][2]).toMatchObject({ currency: "USD", value: 58.71, plan: "annual", flow: "subscription" });
    expect(ev[0][2].items[0]).toMatchObject({ item_id: "plan_annual", price: 58.71 });
  });

  it("begin_checkout no rompe la página si Analytics no cargó", () => {
    expect(() => run(gaBeginCheckoutSnippet("monthly", "trial", 699), CONFIRM_URL)).not.toThrow();
  });
});
