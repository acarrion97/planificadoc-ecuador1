/**
 * Cliente de Supabase Auth (GoTrue) para el backend.
 *
 * El backend es el ÚNICO que habla con Supabase Auth: las contraseñas viven en
 * `auth.users` (bcrypt, gestionado por Supabase) y nunca se guardan en
 * `docente_accounts`. Ahí solo queda un marcador `supabase:<user_id>` en la
 * columna `passwordHash` para saber que la credencial está migrada (y poder
 * detectar los hashes scrypt legacy de antes de la migración).
 *
 * Endpoints usados (todos contra `${SUPABASE_URL}/auth/v1`):
 *   - POST   /token?grant_type=password          → login (apikey anon)
 *   - POST   /token?grant_type=refresh_token     → renueva la sesión (apikey anon)
 *   - GET    /user                               → valida el access token (apikey anon)
 *   - GET    /admin/users?email=                 → busca usuario (service role)
 *   - POST   /admin/users                        → crea usuario confirmado (service role)
 *   - PUT    /admin/users/{id}                   → cambia contraseña (service role)
 *
 * ATENCIÓN: este archivo se compila a CommonJS en Vercel. No se puede importar
 * `jose` aquí (es ESM-only y provoca `ERR_REQUIRE_ESM` → FUNCTION_INVOCATION_FAILED);
 * por eso la verificación del token se delega en GoTrue en vez de hacerse local.
 *
 * Nunca lanza excepciones no controladas hacia los flujos que no piden
 * autenticación: `syncPasswordToSupabase` (usado por el panel de admin) solo
 * registra el error y devuelve false, para que un problema de Supabase no
 * rompa la operación administrativa.
 */
const AUTH_PREFIX = "/auth/v1";

export type SupabaseUser = {
  id: string;
  email: string;
  user_metadata?: Record<string, unknown>;
  aud?: string;
  created_at?: string;
};

export type SupabaseSession = {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
  user: SupabaseUser;
};

/** Error normalizado del proveedor de autenticación. */
export class AuthProviderError extends Error {
  readonly code: "invalid_credentials" | "user_exists" | "not_configured" | "provider_error";
  readonly status: number;

  constructor(code: AuthProviderError["code"], message: string, status = 0) {
    super(message);
    this.name = "AuthProviderError";
    this.code = code;
    this.status = status;
  }
}

type Config = { url: string; anon: string; service: string | null };

function getConfig(): Config | null {
  const url = (process.env.SUPABASE_URL || "").replace(/\/+$/, "");
  const anon = process.env.SUPABASE_ANON_KEY || "";
  if (!url || !anon) return null;
  return { url, anon, service: process.env.SUPABASE_SERVICE_ROLE_KEY || null };
}

/** true si Supabase Auth está configurado (si no, el backend usa el modo legacy scrypt). */
export function isSupabaseAuthConfigured(): boolean {
  return getConfig() !== null;
}

type GotrueResponse = { ok: boolean; status: number; json: any };

async function callGoTrue(
  path: string,
  opts: { method?: string; body?: unknown; service?: boolean } = {},
): Promise<GotrueResponse> {
  const cfg = getConfig();
  if (!cfg) throw new AuthProviderError("not_configured", "Supabase Auth no está configurado (falta SUPABASE_URL o SUPABASE_ANON_KEY)");

  if (opts.service && !cfg.service) {
    throw new AuthProviderError("not_configured", "Falta SUPABASE_SERVICE_ROLE_KEY para las operaciones de administración");
  }

  const res = await fetch(`${cfg.url}${AUTH_PREFIX}${path}`, {
    method: opts.method || "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: opts.service && cfg.service ? cfg.service : cfg.anon,
      ...(opts.service && cfg.service ? { Authorization: `Bearer ${cfg.service}` } : {}),
    },
    body: opts.body === undefined ? undefined : JSON.stringify(opts.body),
  });

  let json: any = null;
  const text = await res.text();
  if (text) {
    try {
      json = JSON.parse(text);
    } catch {
      json = { message: text };
    }
  }
  return { ok: res.ok, status: res.status, json };
}

/** Mensaje legible de un error de GoTrue (formatos viejos y nuevos). */
function providerMessage(json: any): string {
  return (
    json?.error_description ||
    json?.msg ||
    json?.message ||
    json?.error ||
    "Error del proveedor de autenticación"
  );
}

function looksLikeInvalidCredentials(json: any): boolean {
  const raw = JSON.stringify(json || {}).toLowerCase();
  return raw.includes("invalid login credentials") || raw.includes("invalid_credentials");
}

function looksLikeExistingUser(json: any, status: number): boolean {
  if (status === 422) return true;
  const raw = JSON.stringify(json || {}).toLowerCase();
  return raw.includes("already registered") || raw.includes("email_exists") || raw.includes("user_already_exists");
}

function toSession(json: any): SupabaseSession {
  return {
    accessToken: json.access_token,
    refreshToken: json.refresh_token,
    expiresIn: Number(json.expires_in ?? 3600),
    tokenType: String(json.token_type ?? "bearer"),
    user: {
      id: json.user?.id,
      email: json.user?.email,
      user_metadata: json.user?.user_metadata,
      aud: json.user?.aud,
      created_at: json.user?.created_at,
    },
  };
}

// ── Sesión: login y refresh ──────────────────────────────────────────────────

/** Login con email + contraseña. Lanza AuthProviderError("invalid_credentials"). */
export async function signInWithPassword(email: string, password: string): Promise<SupabaseSession> {
  const res = await callGoTrue(`/token?grant_type=password`, {
    method: "POST",
    body: { email, password },
  });
  if (!res.ok) {
    if (looksLikeInvalidCredentials(res.json)) {
      throw new AuthProviderError("invalid_credentials", "Correo o contraseña incorrectos", res.status);
    }
    throw new AuthProviderError("provider_error", providerMessage(res.json), res.status);
  }
  return toSession(res.json);
}

/** Renueva la sesión con el refresh token. */
export async function refreshSession(refreshToken: string): Promise<SupabaseSession> {
  const res = await callGoTrue(`/token?grant_type=refresh_token`, {
    method: "POST",
    body: { refresh_token: refreshToken },
  });
  if (!res.ok) {
    if (looksLikeInvalidCredentials(res.json) || res.status === 400 || res.status === 401) {
      throw new AuthProviderError("invalid_credentials", "Sesión expirada. Inicia sesión de nuevo.", res.status);
    }
    throw new AuthProviderError("provider_error", providerMessage(res.json), res.status);
  }
  return toSession(res.json);
}

// ── Administración de usuarios ───────────────────────────────────────────────

/**
 * Busca un usuario por email. Devuelve null si no existe o si no hay service key.
 *
 * ATENCIÓN: GoTrue NO filtra por `email` en `GET /admin/users` — ignora el
 * parámetro y devuelve siempre las primeras filas del listado. Por eso aquí se
 * pagina el listado y se compara el correo en el cliente. Con la versión
 * anterior (que leía `users[0]` del resultado filtrado) cualquier correo
 * "existía": los registros respondían 409 y el login no devolvía `notFound`,
 * además de poder cambiarse la contraseña al usuario equivocado.
 */
export async function adminFindUserByEmail(email: string): Promise<SupabaseUser | null> {
  const cfg = getConfig();
  if (!cfg?.service) return null;
  const target = (email ?? "").trim().toLowerCase();
  if (!target) return null;

  const perPage = 200;
  const maxPages = 25; // 5.000 cuentas: tope para no paginar sin fin

  try {
    for (let page = 1; page <= maxPages; page++) {
      const res = await callGoTrue(`/admin/users?page=${page}&per_page=${perPage}`, { method: "GET", service: true });
      if (!res.ok) return null;

      const users = res.json?.users;
      if (!Array.isArray(users) || users.length === 0) return null;

      const match = users.find((u: any) => String(u?.email ?? "").trim().toLowerCase() === target);
      if (match) {
        return { id: match.id, email: match.email, user_metadata: match.user_metadata, aud: match.aud, created_at: match.created_at };
      }
      if (users.length < perPage) return null; // última página alcanzada
    }
    return null;
  } catch (e) {
    console.error("[supabase-auth] adminFindUserByEmail falló:", e);
    return null;
  }
}

/**
 * Crea el usuario en `auth.users` YA CONFIRMADO (el registro actual entra en
 * la app de inmediato, sin verificar correo: así se conserva el flujo actual).
 * Si ya existe, actualiza su contraseña.
 */
export async function adminCreateUser(email: string, password: string, nombre?: string): Promise<SupabaseUser> {
  const res = await callGoTrue(`/admin/users`, {
    method: "POST",
    service: true,
    body: {
      email,
      password,
      email_confirm: true,
      ...(nombre ? { user_metadata: { nombre } } : {}),
    },
  });

  if (res.ok && res.json?.id) {
    return { id: res.json.id, email: res.json.email ?? email, user_metadata: res.json.user_metadata };
  }

  if (looksLikeExistingUser(res.json, res.status)) {
    const existing = await adminFindUserByEmail(email);
    if (existing) {
      await adminSetPassword(email, password);
      return existing;
    }
  }

  throw new AuthProviderError("provider_error", providerMessage(res.json), res.status);
}

/** Cambia la contraseña de un usuario existente; si no existe, lo crea. */
export async function adminSetPassword(email: string, password: string): Promise<SupabaseUser> {
  const existing = await adminFindUserByEmail(email);
  if (!existing) return adminCreateUser(email, password);

  const res = await callGoTrue(`/admin/users/${existing.id}`, {
    method: "PUT",
    service: true,
    body: { password },
  });
  if (!res.ok) throw new AuthProviderError("provider_error", providerMessage(res.json), res.status);
  return existing;
}

/**
 * Sincroniza una contraseña fijada por el panel de admin con Supabase Auth.
 * Devuelve el id de `auth.users` si la sincronizó, o null si no (Supabase sin
 * configurar o error). Nunca lanza: un fallo aquí no debe romper la operación
 * administrativa, y en ese caso el login sigue funcionando con el hash local.
 */
export async function syncPasswordToSupabase(email: string, password: string, nombre?: string): Promise<string | null> {
  if (!isSupabaseAuthConfigured()) return null;
  try {
    const user = await adminSetPassword(email, password);
    return user.id ?? null;
  } catch (e) {
    console.error(`[supabase-auth] No se pudo sincronizar la contraseña de ${email}:`, e);
    return null;
  }
}

// ── Verificación del acceso ──────────────────────────────────────────────────

/**
 * Verifica un access_token de Supabase Auth.
 *
 * Se delega en GoTrue (`GET /auth/v1/user`), que comprueba firma y expiración
 * en su lado. Así el backend no tiene que verificar el JWT por su cuenta:
 * evita cachear el JWKS y, sobre todo, evita importar `jose` aquí — que es
 * ESM-only y revienta las funciones CommonJS de Vercel con `ERR_REQUIRE_ESM`.
 */
export type VerifiedUser = {
  sub: string;
  email?: string;
  role?: string;
  user_metadata?: Record<string, unknown>;
};

export async function verifyAccessToken(token: string): Promise<VerifiedUser> {
  const cfg = getConfig();
  if (!cfg) throw new AuthProviderError("not_configured", "Supabase Auth no está configurado");

  let res: Response;
  try {
    res = await fetch(`${cfg.url}${AUTH_PREFIX}/user`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        apikey: cfg.anon,
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (e) {
    throw new AuthProviderError("provider_error", "No se pudo verificar la sesión con Supabase");
  }

  let json: any = null;
  try {
    json = await res.json();
  } catch {
    json = null;
  }

  if (!res.ok || !json?.id) {
    throw new AuthProviderError("invalid_credentials", "Sesión inválida o expirada", res.status);
  }

  return {
    sub: String(json.id),
    email: json.email ?? undefined,
    role: json.role ?? undefined,
    user_metadata: json.user_metadata ?? undefined,
  };
}

/** Extrae el Bearer token de una request de Vercel/Express. */
export function getBearerToken(req: any): string | null {
  const header = (req?.headers?.authorization || req?.headers?.Authorization || "") as string;
  if (header.toLowerCase().startsWith("bearer ")) return header.slice(7).trim();
  const cookie = req?.headers?.cookie as string | undefined;
  if (cookie) {
    const match = cookie.match(/(?:^|;\s*)(?:sb-access-token|access_token)=([^;]+)/);
    if (match) return decodeURIComponent(match[1]);
  }
  return null;
}

/** Prefijo del marcador que se guarda en docente_accounts.passwordHash cuando la clave vive en Supabase. */
export const SUPABASE_MARKER_PREFIX = "supabase:";

/** Marca que se guarda en docente_accounts.passwordHash cuando la clave vive en Supabase. */
export function supabaseHashMarker(userId: string): string {
  return `${SUPABASE_MARKER_PREFIX}${userId}`;
}

/**
 * Id de `auth.users` contenido en un marcador `supabase:<id>`.
 * Devuelve `null` si el hash es scrypt heredado o está vacío.
 */
export function supabaseIdFromMarker(passwordHash: string | null | undefined): string | null {
  if (!passwordHash || !passwordHash.startsWith(SUPABASE_MARKER_PREFIX)) return null;
  const id = passwordHash.slice(SUPABASE_MARKER_PREFIX.length);
  return id || null;
}

/**
 * true si `passwordHash` es un hash scrypt heredado (aún sin migrar a Supabase).
 * Los marcadores `supabase:<id>` y las cadenas vacías no lo son.
 */
export function isLegacyHash(passwordHash: string | null | undefined): boolean {
  if (!passwordHash) return false;
  if (passwordHash.startsWith(SUPABASE_MARKER_PREFIX)) return false;
  return passwordHash.includes(":");
}
