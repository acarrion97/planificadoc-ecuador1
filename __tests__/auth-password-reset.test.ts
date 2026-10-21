/**
 * Recuperación de contraseña con código de un solo uso al correo.
 *
 * Cubre el handler /api/auth/[action] (forgot-password + reset-password) con:
 * - un fake db con la misma forma del query builder de drizzle (eq/desc mockeados),
 * - el envío de correo mockeado (para conocer el código sin exponerlo en la BD).
 */
import { beforeEach, describe, expect, it, vi } from "vitest";
import { docenteAccounts } from "../drizzle/schema";
import { sendPasswordResetCodeEmail } from "../server/email";
import { getDb } from "../api/_lib/db";
import handler from "../api/auth/[action]";

// drizzle-orm: eq/desc se convierten en descriptores interpretables por el fake db.
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

type Row = Record<string, any>;

/** Fake db: select/insert/update/delete/execute con la firma del builder de drizzle. */
function createFakeDb() {
  const state = { accounts: [] as Row[], codes: [] as Row[] };

  const rowsOf = (table: any): Row[] => (table === docenteAccounts ? state.accounts : state.codes);

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
    let order: any = null;
    let lim: number | null = null;
    const api: any = {
      where(c: any) { cond = c; return api; },
      orderBy(o: any) { order = o; return api; },
      limit(n: number) { lim = n; return api; },
      then(onFulfilled: any, onRejected: any) {
        return Promise.resolve()
          .then(() => {
            let rows = filter(table, [...rowsOf(table)], cond);
            if (order?.__desc) {
              const key = colKey(table, order.__desc);
              rows.sort((a, b) => new Date(b[key]).getTime() - new Date(a[key]).getTime());
            }
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
    update: vi.fn((table: any) => ({
      set: (data: Row) => ({
        where: async (cond: any) => {
          for (const r of filter(table, [...rowsOf(table)], cond)) Object.assign(r, data);
        },
      }),
    })),
    delete: vi.fn((table: any) => ({
      where: async (cond: any) => {
        const rows = rowsOf(table);
        for (const r of filter(table, [...rows], cond)) rows.splice(rows.indexOf(r), 1);
      },
    })),
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

const EMAIL = "docente@ejemplo.com";
let fake: ReturnType<typeof createFakeDb>;

function seedAccount(passwordHash = "salt:hash-original") {
  fake.state.accounts.push({ id: 1, email: EMAIL, nombre: "Docente", passwordHash });
}

function sentCode(): string {
  const calls = vi.mocked(sendPasswordResetCodeEmail).mock.calls;
  return calls[calls.length - 1][1];
}

beforeEach(() => {
  fake = createFakeDb();
  vi.mocked(getDb).mockReturnValue(fake.db as any);
  vi.mocked(sendPasswordResetCodeEmail).mockClear().mockResolvedValue(true);
});

describe("POST /api/auth/forgot-password", () => {
  it("envía un código de 6 dígitos y guarda solo su hash con caducidad de 10 min", async () => {
    seedAccount();

    // El correo se normaliza a minúsculas
    const res = await callHandler("forgot-password", { email: `  ${EMAIL.toUpperCase()} ` });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(sendPasswordResetCodeEmail).toHaveBeenCalledTimes(1);

    const [to, code, minutes] = vi.mocked(sendPasswordResetCodeEmail).mock.calls[0];
    expect(to).toBe(EMAIL);
    expect(code).toMatch(/^\d{6}$/);
    expect(minutes).toBe(10);

    expect(fake.state.codes).toHaveLength(1);
    expect(fake.state.codes[0].codeHash).not.toBe(code); // jamás en texto plano
    const ttl = new Date(fake.state.codes[0].expiresAt).getTime() - Date.now();
    expect(ttl).toBeGreaterThan(9 * 60_000);
    expect(ttl).toBeLessThanOrEqual(10 * 60_000);
  });

  it("no filtra la existencia de cuentas: misma respuesta con y sin cuenta", async () => {
    const sinCuenta = await callHandler("forgot-password", { email: "fantasma@ejemplo.com" });

    seedAccount();
    const conCuenta = await callHandler("forgot-password", { email: EMAIL });

    expect(sinCuenta.statusCode).toBe(200);
    expect(conCuenta.statusCode).toBe(200);
    expect(conCuenta.body).toEqual(sinCuenta.body);
    expect(sendPasswordResetCodeEmail).toHaveBeenCalledTimes(1); // solo a la cuenta real
  });

  it("limita los reenvíos a 1 por minuto sin alterar la respuesta", async () => {
    seedAccount();
    await callHandler("forgot-password", { email: EMAIL });
    const segunda = await callHandler("forgot-password", { email: EMAIL });

    expect(segunda.statusCode).toBe(200);
    expect(sendPasswordResetCodeEmail).toHaveBeenCalledTimes(1);
    expect(fake.state.codes).toHaveLength(1);
  });

  it("valida método y correo", async () => {
    const get = await callHandler("forgot-password", {}, "GET");
    expect(get.statusCode).toBe(405);

    const badEmail = await callHandler("forgot-password", { email: "no-es-correo" });
    expect(badEmail.statusCode).toBe(400);

    const sinCorreo = await callHandler("forgot-password", {});
    expect(sinCorreo.statusCode).toBe(400);
  });
});

describe("POST /api/auth/reset-password", () => {
  it("restablece la contraseña, consume el código (un solo uso) y permite login", async () => {
    seedAccount("salt:hash-original");
    await callHandler("forgot-password", { email: EMAIL });
    const code = sentCode();

    const res = await callHandler("reset-password", { email: EMAIL, code, password: "nueva123" });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(fake.state.accounts[0].passwordHash).not.toBe("salt:hash-original");
    expect(fake.state.codes).toHaveLength(0); // un solo uso: se consume

    // El mismo código ya no sirve
    const reuso = await callHandler("reset-password", { email: EMAIL, code, password: "otra1234" });
    expect(reuso.statusCode).toBe(400);
    expect(fake.state.accounts[0].passwordHash).not.toContain("otra1234");

    // Login con la contraseña nueva
    const login = await callHandler("login", { email: EMAIL, password: "nueva123" });
    expect(login.statusCode).toBe(200);
    expect(login.body.success).toBe(true);

    // Y con la vieja ya no
    const loginVieja = await callHandler("login", { email: EMAIL, password: "cualquier1" });
    expect(loginVieja.statusCode).toBe(401);
  });

  it("acumula intentos con código incorrecto y bloquea a los 5", async () => {
    seedAccount();
    await callHandler("forgot-password", { email: EMAIL });
    const code = sentCode();
    const wrong = code === "000000" ? "111111" : "000000";

    for (let i = 1; i <= 5; i++) {
      const r = await callHandler("reset-password", { email: EMAIL, code: wrong, password: "nueva123" });
      expect(r.statusCode).toBe(400);
      expect(r.body.error).toContain("Código incorrecto");
      expect(fake.state.codes[0].attempts).toBe(i);
    }

    const bloqueado = await callHandler("reset-password", { email: EMAIL, code, password: "nueva123" });
    expect(bloqueado.statusCode).toBe(400);
    expect(bloqueado.body.error).toContain("Demasiados intentos");
    expect(fake.state.codes).toHaveLength(0); // el código bloqueado se descarta

    // La contraseña no cambió
    const login = await callHandler("login", { email: EMAIL, password: "nueva123" });
    expect(login.statusCode).toBe(401);
  });

  it("rechaza códigos expirados y borra el registro", async () => {
    seedAccount();
    await callHandler("forgot-password", { email: EMAIL });
    const code = sentCode();
    fake.state.codes[0].expiresAt = new Date(Date.now() - 1000);

    const res = await callHandler("reset-password", { email: EMAIL, code, password: "nueva123" });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toContain("expirado");
    expect(fake.state.codes).toHaveLength(0);
  });

  it("valida formato del código y longitud de la contraseña sin consumir el código", async () => {
    seedAccount();
    await callHandler("forgot-password", { email: EMAIL });
    const code = sentCode();

    const codigoCorto = await callHandler("reset-password", { email: EMAIL, code: "12", password: "nueva123" });
    expect(codigoCorto.statusCode).toBe(400);

    const passCorta = await callHandler("reset-password", { email: EMAIL, code, password: "12345" });
    expect(passCorta.statusCode).toBe(400);

    const sinCampos = await callHandler("reset-password", { email: EMAIL });
    expect(sinCampos.statusCode).toBe(400);

    expect(fake.state.codes).toHaveLength(1); // sigue disponible
  });

  it("responde 400 si no hay código vigente para el correo", async () => {
    const res = await callHandler("reset-password", { email: EMAIL, code: "123456", password: "nueva123" });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toContain("Solicita uno nuevo");
  });
});
