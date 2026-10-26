/**
 * Login / registro / recuperación contra Supabase Auth (auth.users).
 *
 * En estos tests SUPABASE_URL + SUPABASE_ANON_KEY + SUPABASE_SERVICE_ROLE_KEY
 * están definidos, así que el handler usa la ruta de Supabase real (no la
 * legacy de scrypt). El `fetch` global queda mockeado con un GoTrue falso:
 * se comprueba que las contraseñas viven allí y que el hash scrypt heredado de
 * docente_accounts se migra en el primer login ("migración perezosa").
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createHash, randomBytes, scrypt as scryptCb } from "node:crypto";
import { promisify } from "node:util";
import { docenteAccounts, passwordResetCodes } from "../drizzle/schema";
import { sendPasswordResetCodeEmail } from "../server/email";
import { getDb } from "../api/_lib/db";
import { isSupabaseAuthConfigured, syncPasswordToSupabase, isLegacyHash, supabaseHashMarker } from "../api/_lib/supabase-auth";
import handler from "../api/auth/[action]";

const scryptAsync = promisify(scryptCb);

const SUPABASE_URL = "https://test-project.supabase.co";
const EMAIL = "docente@ejemplo.com";
const NOMBRE = "Docente Ejemplo";

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

/** Fake db con la misma forma del query builder de drizzle (igual que el resto de suites). */
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

// ── GoTrue falso (fetch mockeado) ────────────────────────────────────────────

type SupaUser = { id: string; email: string; password: string; metadata: { nombre?: string } };

const supa = { users: [] as SupaUser[] };
const fetchLog: { url: string; method: string; body: any }[] = [];

function jsonResponse(status: number, json: any) {
  return {
    ok: status >= 200 && status < 300,
    status,
    text: async () => JSON.stringify(json),
    json: async () => json,
  };
}

function findUser(email: string) {
  return supa.users.find((u) => u.email === email) || null;
}

async function fakeFetch(input: any, init: any = {}) {
  const url = String(input);
  const method = (init.method || "GET").toUpperCase();
  const body = init.body ? JSON.parse(init.body) : {};
  fetchLog.push({ url, method, body });

  if (url.includes("/auth/v1/token?grant_type=password")) {
    const user = supa.users.find((u) => u.email === body.email && u.password === body.password);
    if (!user) return jsonResponse(400, { error: "invalid_grant", error_description: "Invalid login credentials" });
    return jsonResponse(200, {
      access_token: `at-${user.id}`,
      token_type: "bearer",
      expires_in: 3600,
      refresh_token: `rt-${user.id}`,
      user: { id: user.id, email: user.email, user_metadata: user.metadata },
    });
  }

  if (url.includes("/auth/v1/token?grant_type=refresh_token")) {
    const user = supa.users.find((u) => `rt-${u.id}` === body.refresh_token);
    if (!user) return jsonResponse(400, { error: "invalid_grant", error_description: "Invalid Refresh Token: Refresh Token Not Found" });
    return jsonResponse(200, {
      access_token: `at2-${user.id}`,
      token_type: "bearer",
      expires_in: 3600,
      refresh_token: `rt2-${user.id}`,
      user: { id: user.id, email: user.email, user_metadata: user.metadata },
    });
  }

  if (url.includes("/auth/v1/admin/users?email=")) {
    const email = decodeURIComponent(url.split("email=")[1].split("&")[0]);
    const user = findUser(email);
    return jsonResponse(200, { users: user ? [{ id: user.id, email: user.email, user_metadata: user.metadata }] : [] });
  }

  if (method === "POST" && url.endsWith("/auth/v1/admin/users")) {
    if (findUser(body.email)) return jsonResponse(422, { code: 422, msg: "A user with this email address has already been registered" });
    const user: SupaUser = { id: `su-${supa.users.length + 1}`, email: body.email, password: body.password, metadata: body.user_metadata || {} };
    supa.users.push(user);
    // Solo el panel de admin puede crear usuarios ya confirmados.
    if (body.email_confirm !== true) return jsonResponse(422, { code: 422, msg: "email_confirm requerido" });
    return jsonResponse(200, { id: user.id, email: user.email, user_metadata: user.metadata });
  }

  if (method === "PUT" && url.includes("/auth/v1/admin/users/")) {
    const id = url.split("/admin/users/")[1];
    const user = supa.users.find((u) => u.id === id);
    if (!user) return jsonResponse(404, { msg: "User not found" });
    if (body.password) user.password = body.password;
    return jsonResponse(200, { id: user.id, email: user.email });
  }

  // GET /auth/v1/user → lo que el backend usa para validar el access token.
  if (url.includes("/auth/v1/user")) {
    const header = init.headers || {};
    const auth = String(header.Authorization || header.authorization || "");
    const token = auth.replace(/^Bearer\s+/i, "").trim();
    const user = supa.users.find((u) => token === `at-${u.id}` || token === `at2-${u.id}`);
    if (!user) return jsonResponse(401, { code: 401, msg: "invalid JWT" });
    return jsonResponse(200, {
      id: user.id,
      aud: "authenticated",
      role: "authenticated",
      email: user.email,
      user_metadata: user.metadata,
    });
  }

  return jsonResponse(404, { msg: `ruta no implementada en el GoTrue falso: ${url}` });
}

// ── utilidades ──────────────────────────────────────────────────────────────

async function legacyHash(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const derived = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${salt}:${derived.toString("hex")}`;
}

async function callHandler(action: string, body: any, method = "POST", headers: Record<string, string> = {}) {
  const req: any = { query: { action }, method, body, headers };
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

const callsTo = (fragment: string) => fetchLog.filter((c) => c.url.includes(fragment));

let fake: ReturnType<typeof createFakeDb>;

beforeEach(async () => {
  fake = createFakeDb();
  vi.mocked(getDb).mockReturnValue(fake.db as any);
  vi.mocked(sendPasswordResetCodeEmail).mockClear().mockResolvedValue(true);

  supa.users.length = 0;
  fetchLog.length = 0;

  vi.stubEnv("SUPABASE_URL", SUPABASE_URL);
  vi.stubEnv("SUPABASE_ANON_KEY", "anon-key-de-prueba");
  vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "service-key-de-prueba");
  vi.stubGlobal("fetch", vi.fn(fakeFetch));
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("configuración", () => {
  it("reconoce Supabase Auth como proveedor activo con las variables definidas", () => {
    expect(isSupabaseAuthConfigured()).toBe(true);
    expect(isLegacyHash(supabaseHashMarker("su-1"))).toBe(false);
    expect(isLegacyHash("a1b2c3:deadbeef")).toBe(true);
  });

  it("syncPasswordToSupabase no rompe sin credenciales y devuelve el id con ellas", async () => {
    expect(await syncPasswordToSupabase(EMAIL, "clave123")).toBe("su-1");
    vi.stubEnv("SUPABASE_URL", "");
    expect(await syncPasswordToSupabase(EMAIL, "clave123")).toBeNull();
  });
});

describe("POST /api/auth/login (Supabase Auth)", () => {
  it("valida la contraseña con Supabase y devuelve sus tokens", async () => {
    supa.users.push({ id: "su-9", email: EMAIL, password: "secreta1", metadata: { nombre: NOMBRE } });
    fake.state.accounts.push({ id: 1, email: EMAIL, nombre: NOMBRE, passwordHash: supabaseHashMarker("su-9") });

    const res = await callHandler("login", { email: EMAIL, password: "secreta1" });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBe("at-su-9");
    expect(res.body.refreshToken).toBe("rt-su-9");
    expect(res.body.expiresAt).toBeGreaterThan(Date.now());
    expect(fake.state.accounts[0].lastLoginAt).toBeInstanceOf(Date);
    // La contraseña jamás viaja en claro a la BD propia
    expect(fake.state.accounts[0].passwordHash).toBe(supabaseHashMarker("su-9"));
  });

  it("rechaza la contraseña incorrecta sin filtrar más detalle", async () => {
    supa.users.push({ id: "su-9", email: EMAIL, password: "secreta1", metadata: {} });
    fake.state.accounts.push({ id: 1, email: EMAIL, nombre: NOMBRE, passwordHash: supabaseHashMarker("su-9") });

    const res = await callHandler("login", { email: EMAIL, password: "otra-clave" });

    expect(res.statusCode).toBe(401);
    expect(res.body.error).toContain("Contraseña incorrecta");
    expect(res.body.notFound).toBeUndefined();
    expect(res.body.invalidCredentials).toBe(true);
  });

  it("migra a Supabase en el primer login de una cuenta con hash scrypt heredado", async () => {
    fake.state.accounts.push({ id: 1, email: EMAIL, nombre: NOMBRE, passwordHash: await legacyHash("secreta1") });

    const res = await callHandler("login", { email: EMAIL, password: "secreta1" });

    expect(res.statusCode).toBe(200);
    expect(res.body.migrated).toBe(true);
    expect(res.body.token).toBe("at-su-1");
    // Creada en auth.users y el hash local sustituido por el marcador
    expect(supa.users).toHaveLength(1);
    expect(supa.users[0].email).toBe(EMAIL);
    expect(supa.users[0].password).toBe("secreta1");
    expect(fake.state.accounts[0].passwordHash).toBe(supabaseHashMarker("su-1"));
    expect(fetchLog.some((c) => c.url.endsWith("/auth/v1/admin/users") && c.method === "POST")).toBe(true);
  });

  it("no migra nada si la contraseña heredada es incorrecta", async () => {
    fake.state.accounts.push({ id: 1, email: EMAIL, nombre: NOMBRE, passwordHash: await legacyHash("secreta1") });
    const antes = fake.state.accounts[0].passwordHash;

    const res = await callHandler("login", { email: EMAIL, password: "incorrecta" });

    expect(res.statusCode).toBe(401);
    expect(res.body.error).toContain("Contraseña incorrecta");
    expect(res.body.invalidCredentials).toBe(true);
    expect(supa.users).toHaveLength(0);
    expect(fake.state.accounts[0].passwordHash).toBe(antes);
    expect(callsTo("/auth/v1/admin/users").filter((c) => c.method === "POST")).toHaveLength(0);
  });

  it("devuelve notFound cuando el correo no existe ni en Supabase ni localmente", async () => {
    const res = await callHandler("login", { email: "nadie@ejemplo.com", password: "secreta1" });

    expect(res.statusCode).toBe(401);
    expect(res.body.notFound).toBe(true);
    expect(res.body.invalidCredentials).toBeUndefined();
    expect(res.body.error).toContain("No encontramos una cuenta");
  });
});

describe("POST /api/auth/register (Supabase Auth)", () => {
  it("crea el usuario confirmado en auth.users y solo guarda el marcador local", async () => {
    const res = await callHandler("register", { email: EMAIL, password: "secreta1", nombre: NOMBRE });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBe("at-su-1");
    expect(res.body.refreshToken).toBe("rt-su-1");

    const creada = fetchLog.find((c) => c.url.endsWith("/auth/v1/admin/users") && c.method === "POST");
    expect(creada?.body.email).toBe(EMAIL);
    expect(creada?.body.email_confirm).toBe(true);

    expect(fake.state.accounts).toHaveLength(1);
    expect(fake.state.accounts[0].passwordHash).toBe(supabaseHashMarker("su-1"));
    expect(fake.state.accounts[0].passwordHash).not.toContain("secreta1");
  });

  it("rechaza con 409 un correo ya registrado en Supabase", async () => {
    supa.users.push({ id: "su-7", email: EMAIL, password: "otra123", metadata: {} });

    const res = await callHandler("register", { email: EMAIL, password: "secreta1", nombre: NOMBRE });

    expect(res.statusCode).toBe(409);
    expect(res.body.exists).toBe(true);
    expect(fake.state.accounts).toHaveLength(0);
  });
});

describe("POST /api/auth/reset-password (Supabase Auth)", () => {
  async function pedirCodigo(): Promise<string> {
    await callHandler("forgot-password", { email: EMAIL });
    const calls = vi.mocked(sendPasswordResetCodeEmail).mock.calls;
    return calls[calls.length - 1][1];
  }

  it("cambia la contraseña en Supabase y consume el código", async () => {
    supa.users.push({ id: "su-3", email: EMAIL, password: "vieja123", metadata: {} });
    fake.state.accounts.push({ id: 1, email: EMAIL, nombre: NOMBRE, passwordHash: supabaseHashMarker("su-3") });
    const code = await pedirCodigo();

    const res = await callHandler("reset-password", { email: EMAIL, code, password: "nueva123" });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(supa.users[0].password).toBe("nueva123");
    expect(fake.state.accounts[0].passwordHash).toBe(supabaseHashMarker("su-3"));
    expect(fake.state.codes).toHaveLength(0);

    // Y el login ya valida contra Supabase con la clave nueva
    const login = await callHandler("login", { email: EMAIL, password: "nueva123" });
    expect(login.statusCode).toBe(200);
    expect(login.body.token).toBe("at-su-3");
  });
});

describe("POST /api/auth/refresh (Supabase Auth)", () => {
  it("renueva la sesión con el refresh token", async () => {
    supa.users.push({ id: "su-5", email: EMAIL, password: "secreta1", metadata: {} });

    const res = await callHandler("refresh", { refreshToken: "rt-su-5" });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBe("at2-su-5");
    expect(res.body.refreshToken).toBe("rt2-su-5");
    expect(res.body.email).toBe(EMAIL);
  });

  it("devuelve 401 si el refresh token ya no sirve", async () => {
    const res = await callHandler("refresh", { refreshToken: "rt-vencido" });
    expect(res.statusCode).toBe(401);
    expect(res.body.error).toContain("Sesión");
  });

  it("valida que venga el refresh token", async () => {
    const res = await callHandler("refresh", {});
    expect(res.statusCode).toBe(400);
  });
});

describe("GET /api/auth/me (verificación del access token)", () => {
  it("devuelve 401 sin token", async () => {
    const res = await callHandler("me", undefined, "GET");
    expect(res.statusCode).toBe(401);
  });

  it("devuelve 401 con un token que Supabase no emitió", async () => {
    const res = await callHandler("me", undefined, "GET", { authorization: "Bearer at-su-1-manipulado" });
    expect(res.statusCode).toBe(401);
  });

  it("devuelve el usuario autenticado con el access token del login", async () => {
    supa.users.push({ id: "su-1", email: EMAIL, password: "secreta1", metadata: { nombre: NOMBRE } });
    fake.state.accounts.push({ id: 1, email: EMAIL, nombre: NOMBRE, passwordHash: supabaseHashMarker("su-1") });

    const login = await callHandler("login", { email: EMAIL, password: "secreta1" });
    expect(login.statusCode).toBe(200);

    const res = await callHandler("me", undefined, "GET", { authorization: `Bearer ${login.body.token}` });

    expect(res.statusCode).toBe(200);
    expect(res.body.user.id).toBe("su-1");
    expect(res.body.user.email).toBe(EMAIL);
    expect(res.body.user.nombre).toBe(NOMBRE);
    expect(res.body.user.role).toBe("authenticated");

    // La verificación delega en GoTrue (GET /auth/v1/user)
    expect(callsTo("/auth/v1/user")).toHaveLength(1);
  });

  it("no usa el digest del correo como credencial (el hash nunca autentica)", async () => {
    // Un "hash" de los que quedan en la BD no sirve como token de sesión.
    const res = await callHandler("me", undefined, "GET", {
      authorization: `Bearer ${createHash("sha256").update(EMAIL).digest("hex")}`,
    });
    expect(res.statusCode).toBe(401);
  });
});
