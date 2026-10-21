import { describe, it, expect, vi, beforeEach } from "vitest";

// Base de datos simulada: captura lo que se guarda en payment_attribution.
const saved: Record<string, any>[] = [];
const fakeDb = {
  insert: () => ({
    values: (v: Record<string, any>) => {
      saved.push(v);
      return { onDuplicateKeyUpdate: async () => undefined };
    },
  }),
};

vi.mock("../api/_lib/db", () => ({
  createPaymentTransaction: vi.fn(async () => 1),
  setPcaClientTxId: vi.fn(async () => undefined),
  getDb: () => fakeDb,
}));
vi.mock("../drizzle/schema", () => ({ paymentAttribution: {} }));

import handler from "../api/payment/page";
import { stripQuery } from "../api/_lib/safe-url";

function call(req: Record<string, any>): Promise<{ status: number; body: string }> {
  return new Promise((resolve) => {
    const res: any = {
      _status: 200,
      setHeader() {},
      status(c: number) { this._status = c; return this; },
      send(b: unknown) { resolve({ status: this._status, body: String(b) }); },
      json(b: unknown) { resolve({ status: this._status, body: JSON.stringify(b) }); },
      end() { resolve({ status: this._status, body: "" }); },
    };
    handler({ method: "GET", query: {}, headers: {}, body: {}, socket: {}, ...req } as any, res);
  });
}

const BUYER = {
  email: "docente@ejemplo.com",
  documentId: "0912345678",
  phoneNumber: "+593987654321",
  cardHolder: "Docente Ejemplo",
};

beforeEach(() => {
  saved.length = 0;
  process.env.PAYPHONE_TOKEN = "tok_test";
  process.env.PAYPHONE_STORE_ID = "store_test";
});

describe("página de pago: prueba gratis", () => {
  it("se genera sin error (antes fallaba con HTTP 500: fbpFromUrl usada antes de declararse)", async () => {
    const r = await call({ query: { ...BUYER, plan: "annual", type: "trial", fbp: "fb.1.1.2", fbc: "fb.1.1.abc" } });
    expect(r.status).toBe(200);
    expect(r.body).toContain("Prueba Gratuita");
    expect(r.body).toContain("'begin_checkout'");
    expect(r.body).toContain('"flow":"trial"');
  });

  it("guarda fbp/fbc de la URL con la URL de origen SIN query string", async () => {
    await call({
      query: { ...BUYER, plan: "monthly", type: "trial", fbp: "fb.1.1.2", fbc: "fb.1.1.abc" },
      headers: { referer: "https://planificadoc.app/paywall?email=docente@ejemplo.com&documentId=0912345678" },
    });
    expect(saved).toHaveLength(1);
    expect(saved[0].fbp).toBe("fb.1.1.2");
    expect(saved[0].fbc).toBe("fb.1.1.abc");
    expect(saved[0].sourceUrl).toBe("https://planificadoc.app/paywall");
  });
});

describe("página de pago: suscripción", () => {
  it("se genera con begin_checkout y el precio real del plan", async () => {
    const r = await call({ query: { ...BUYER, plan: "annual" } });
    expect(r.status).toBe(200);
    expect(r.body).toContain('"value":58.71');
    expect(r.body).toContain('"flow":"subscription"');
  });

  it("guarda la URL de origen sin query string", async () => {
    await call({
      query: { ...BUYER, plan: "monthly", fbp: "fb.1.1.2" },
      headers: { referer: "https://planificadoc.app/paywall?phoneNumber=%2B593987654321" },
    });
    expect(saved[0].sourceUrl).toBe("https://planificadoc.app/paywall");
  });
});

describe("atribución (POST): privacidad", () => {
  it("guarda sourceUrl sin email, cédula, teléfono ni nombre", async () => {
    const dirty =
      "https://planificadoc.app/api/payment/page?email=docente@ejemplo.com&documentId=0912345678&phoneNumber=%2B593987654321&cardHolder=Docente%20Ejemplo";
    const r = await call({
      method: "POST",
      body: { clientTxId: "PDOC-1", eventId: "evt_1", value: 6.99, sourceUrl: dirty },
    });
    expect(r.status).toBe(200);
    expect(saved[0].sourceUrl).toBe("https://planificadoc.app/api/payment/page");
    expect(JSON.stringify(saved[0].sourceUrl)).not.toMatch(/0912345678|docente@|Docente|987654321/);
  });
});

describe("stripQuery", () => {
  it("deja solo origin + pathname", () => {
    expect(stripQuery("https://planificadoc.app/a/b?x=1#h")).toBe("https://planificadoc.app/a/b");
  });
  it("devuelve null con valores inválidos", () => {
    expect(stripQuery(undefined)).toBeNull();
    expect(stripQuery("")).toBeNull();
    expect(stripQuery("no es una url")).toBeNull();
    expect(stripQuery(42)).toBeNull();
  });
});
