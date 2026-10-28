/**
 * Registro especial de mantenimiento (POST /api/auth/register-maintenance).
 *
 * Es el registro que se ofrece ÚNICAMENTE desde el login cuando el correo no
 * existe: crea la cuenta con acceso gratuito temporal (MAINTENANCE_FREE_DAYS)
 * y no debe tocar al registro normal (/register).
 *
 * Cubre el handler con el mismo fake db de drizzle que auth-password-reset.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { docenteAccounts, subscriptions } from "../drizzle/schema";
import { getDb } from "../api/_lib/db";
import { legacyPublicUserId, syncPublicUser } from "../api/_lib/users";
import handler from "../api/auth/[action]";

vi.mock("drizzle-orm", async (importOriginal) => {
  const actual: any = await importOriginal();
  return {
    ...actual,
    eq: (col: any, val: any) => ({ __eq: [col, val] }),
    desc: (col: any) => ({ __desc: col }),
  };
});

vi.mock("../server/email", () => ({
  sendPasswordResetCodeEmail: vi.fn(async () => true),
}));

vi.mock("../api/_lib/db", () => ({
  getDb: vi.fn(),
  getActiveSubscription: vi.fn(async () => null),
}));

vi.mock("../api/_lib/users", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../api/_lib/users")>();
  return { ...actual, syncPublicUser: vi.fn(async () => 17) };
});

type Row = Record<string, any>;

/** Fake db: select/insert/update/delete/execute con la firma del builder de drizzle. */
function createFakeDb() {
  const state = { accounts: [] as Row[], subs: [] as Row[] };

  const rowsOf = (table: any): Row[] => (table === docenteAccounts ? state.accounts : state.subs);

  const colKey = (table: any, col: any): string => {
    for (const [k, v] of Object.entries(table)) if (v === col) return k;
    throw new Error("columna no reconocida por el fake db");
  };

  const filter = (table: any, rows: Row[], cond: any): Row[] => {
    const eqDesc = cond?.__eq;
    if (!eqDesc) return rows;
    const [col, val] = eqDesc;
    const key = colKey(table, col);
    return rows.filter((r) => r[key] === val);
  };

  const selectBuilder = (table: any) => {
    let cond: any = null;
    let lim: number | null = null;
    const api: any = {
      where(c: any) { cond = c; return api; },
      orderBy() { return api; },
      limit(n: number) { lim = n; return api; },
      then(onFulfilled: any, onRejected: any) {
        return Promise.resolve()
          .then(() => {
            let rows = filter(table, [...rowsOf(table)], cond);
            if (lim != null) rows = rows.slice(0, lim);
            return rows;
          })
          .then(onFulfilled, onRejected);
      },
    };
    return api;
  };

  const db = {
    execute: vi.fn(async () => []),
    select: vi.fn(() => ({ from: selectBuilder })),
    insert: vi.fn((table: any) => ({
      values: async (v: Row) => {
        const rows = rowsOf(table);
        rows.push({ id: rows.length + 1, ...v });
        return { insertId: rows.length };
      },
    })),
    update: vi.fn(() => ({ set: () => ({ where: async () => undefined }) })),
    delete: vi.fn(() => ({ where: async () => undefined })),
  };

  return { db, state };
}

async function callHandler(action: string, body: any, method = "POST") {
  const req: any = { query: { action }, method, body, headers: {} };
  const res: any = {
    statusCode: 200,
    body: undefined,
    setHeader: vi.fn(),
    status(code: number) { this.statusCode = code; return this; },
    json(payload: any) { this.body = payload; return this; },
    end() { return this; },
  };
  await handler(req, res);
  return res;
}

const EMAIL = "Docente@Ejemplo.com"; // llega sin normalizar
const NORMALIZED = "docente@ejemplo.com";
const CREDENCIALES = { email: EMAIL, password: "secreta123", nombre: "María González" };
const REGISTRATION_CODE = "TEMPORAL-2026";
const MAINTENANCE_CREDENTIALS = { ...CREDENCIALES, registrationCode: REGISTRATION_CODE };

let fake: ReturnType<typeof createFakeDb>;

beforeEach(() => {
  fake = createFakeDb();
  vi.mocked(getDb).mockReturnValue(fake.db as any);
  vi.clearAllMocks();
  delete process.env.MAINTENANCE_FREE_DAYS;
  process.env.MAINTENANCE_REGISTRATION_CODE = REGISTRATION_CODE;
});

afterEach(() => {
  delete process.env.MAINTENANCE_FREE_DAYS;
  delete process.env.MAINTENANCE_REGISTRATION_CODE;
});

describe("POST /api/auth/register-maintenance", () => {
  it("crea la cuenta y otorga 1 año (365 días) de acceso gratuito (valor por defecto)", async () => {
    const antes = Date.now();
    const res = await callHandler("register-maintenance", MAINTENANCE_CREDENTIALS);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.email).toBe(NORMALIZED);
    expect(res.body.nombre).toBe("María González");
    expect(String(res.body.token)).toContain("."); // sesión iniciada automáticamente

    // Cuenta creada con la contraseña guardada como hash scrypt (salt:hash)
    expect(fake.state.accounts).toHaveLength(1);
    expect(fake.state.accounts[0].email).toBe(NORMALIZED);
    expect(fake.state.accounts[0].passwordHash).toMatch(/^[0-9a-f]+:/);
    expect(fake.state.accounts[0].passwordHash).not.toContain("secreta123");

    // Suscripción gratuita, promocional y de 1 año (plan anual)
    expect(fake.state.subs).toHaveLength(1);
    const sub = fake.state.subs[0];
    expect(sub.email).toBe(NORMALIZED);
    expect(sub.status).toBe("active");
    expect(sub.plan).toBe("anual");
    expect(sub.amountPaid).toBe(0);
    expect(sub.isPromo).toBe(true);
    expect(sub.isRecurring).toBe(false);
    expect(String(sub.transactionId)).toContain("MAINTENANCE");

    const dias = (new Date(sub.endDate).getTime() - new Date(sub.startDate).getTime()) / 86_400_000;
    expect(dias).toBeGreaterThan(364.9);
    expect(dias).toBeLessThan(365.1);
    expect(new Date(sub.startDate).getTime()).toBeGreaterThanOrEqual(antes - 1000);

    expect(res.body.hasActiveSubscription).toBe(true);
    expect(res.body.maintenanceFree).toBe(true);
    expect(new Date(res.body.subscriptionEndDate).getTime()).toBeCloseTo(new Date(sub.endDate).getTime(), -3);
    expect(syncPublicUser).toHaveBeenCalledWith({
      email: NORMALIZED,
      name: "María González",
      supabaseId: legacyPublicUserId(NORMALIZED),
      loginMethod: "legacy",
      signedIn: true,
    });
  });

  it("honra MAINTENANCE_FREE_DAYS=0: crea la cuenta pero sin acceso gratuito", async () => {
    process.env.MAINTENANCE_FREE_DAYS = "0";

    const res = await callHandler("register-maintenance", MAINTENANCE_CREDENTIALS);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(fake.state.accounts).toHaveLength(1);
    expect(fake.state.subs).toHaveLength(0);
    expect(res.body.hasActiveSubscription).toBe(false);
    expect(res.body.maintenanceFree).toBe(false);
    expect(res.body.subscriptionEndDate).toBeNull();
  });

  it("respeta una duración personalizada en días (y entonces no es plan anual)", async () => {
    process.env.MAINTENANCE_FREE_DAYS = "7";

    await callHandler("register-maintenance", MAINTENANCE_CREDENTIALS);

    const sub = fake.state.subs[0];
    expect(sub.plan).toBe("monthly");
    const dias = (new Date(sub.endDate).getTime() - new Date(sub.startDate).getTime()) / 86_400_000;
    expect(Math.round(dias)).toBe(7);
  });

  it("devuelve 409 con exists cuando la cuenta ya está registrada y no toca suscripciones", async () => {
    fake.state.accounts.push({ id: 1, email: NORMALIZED, nombre: "Ya", passwordHash: "salt:hash" });

    const res = await callHandler("register-maintenance", MAINTENANCE_CREDENTIALS);

    expect(res.statusCode).toBe(409);
    expect(res.body.exists).toBe(true);
    expect(res.body.success).toBeUndefined();
    expect(fake.state.accounts).toHaveLength(1);
    expect(fake.state.subs).toHaveLength(0);
  });

  it("valida campos requeridos y longitud mínima de la contraseña", async () => {
    const sinNombre = await callHandler("register-maintenance", { ...MAINTENANCE_CREDENTIALS, nombre: undefined });
    expect(sinNombre.statusCode).toBe(400);

    const corta = await callHandler("register-maintenance", { ...MAINTENANCE_CREDENTIALS, password: "12345" });
    expect(corta.statusCode).toBe(400);
    expect(corta.body.error).toMatch(/6 caracteres/);

    expect(fake.state.accounts).toHaveLength(0);
    expect(fake.state.subs).toHaveLength(0);
  });

  it("rechaza el método GET", async () => {
    const res = await callHandler("register-maintenance", MAINTENANCE_CREDENTIALS, "GET");
    expect(res.statusCode).toBe(405);
  });

  it("rechaza un código incorrecto o ausente sin crear la cuenta", async () => {
    const incorrecto = await callHandler("register-maintenance", { ...CREDENCIALES, registrationCode: "OTRO-CODIGO" });
    expect(incorrecto.statusCode).toBe(403);
    expect(incorrecto.body.error).toMatch(/código de registro inválido/i);

    const ausente = await callHandler("register-maintenance", CREDENCIALES);
    expect(ausente.statusCode).toBe(403);
    expect(fake.state.accounts).toHaveLength(0);
  });

  it("acepta el código sin distinguir mayúsculas", async () => {
    const res = await callHandler("register-maintenance", {
      ...CREDENCIALES,
      registrationCode: REGISTRATION_CODE.toLowerCase(),
    });

    expect(res.statusCode).toBe(200);
    expect(fake.state.accounts).toHaveLength(1);
  });

  it("deshabilita el registro temporal si el código no está configurado", async () => {
    delete process.env.MAINTENANCE_REGISTRATION_CODE;

    const res = await callHandler("register-maintenance", MAINTENANCE_CREDENTIALS);

    expect(res.statusCode).toBe(503);
    expect(fake.state.accounts).toHaveLength(0);
  });
});

describe("POST /api/auth/register (registro normal, no debe cambiar)", () => {
  it("crea la cuenta SIN acceso gratuito", async () => {
    const res = await callHandler("register", CREDENCIALES);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.hasActiveSubscription).toBe(false);
    expect(fake.state.accounts).toHaveLength(1);
    expect(fake.state.subs).toHaveLength(0); // el registro normal nunca otorga acceso
    expect(syncPublicUser).toHaveBeenCalledWith({
      email: NORMALIZED,
      name: "María González",
      supabaseId: legacyPublicUserId(NORMALIZED),
      loginMethod: "legacy",
      signedIn: true,
    });
  });
});
