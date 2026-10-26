import type { VercelRequest, VercelResponse } from "@vercel/node";
import { handleCors } from "../_lib/admin-auth";
import { getDb, getActiveSubscription } from "../_lib/db";
import { docenteAccounts, passwordResetCodes, subscriptions } from "../../drizzle/schema";
import { eq, desc, sql as drizzleSql } from "drizzle-orm";
import { createHmac, randomBytes, randomInt, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { sendPasswordResetCodeEmail } from "../../server/email";
import {
  adminCreateUser,
  adminFindUserByEmail,
  adminSetPassword,
  getBearerToken,
  isLegacyHash,
  isSupabaseAuthConfigured,
  refreshSession,
  signInWithPassword,
  supabaseHashMarker,
  supabaseIdFromMarker,
  verifyAccessToken,
  AuthProviderError,
  type SupabaseSession,
} from "../_lib/supabase-auth";
import { legacyPublicUserId, syncPublicUser } from "../_lib/users";

const scryptAsync = promisify(scrypt);

// ── Recuperación de contraseña (código de un solo uso) ────────────────────────

const RESET_CODE_TTL_MS = 10 * 60 * 1000; // 10 minutos de validez
const RESET_MAX_ATTEMPTS = 5;             // intentos fallidos antes de bloquear
const RESET_RESEND_MS = 60 * 1000;        // 1 código como mínimo por minuto

/** HMAC-SHA256 del código — la BD jamás guarda el código en texto plano. */
function hashCodeReset(code: string): string {
  const secret = process.env.JWT_SECRET || "planificadoc-2026";
  return createHmac("sha256", secret).update(`pw-reset:${code}`).digest("hex");
}

function codesMatch(code: string, storedHash: string): boolean {
  try {
    const a = Buffer.from(hashCodeReset(code), "hex");
    const b = Buffer.from(storedHash, "hex");
    if (a.length === 0 || a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

function toTime(v: Date | string | number | null | undefined): number {
  if (!v) return 0;
  return v instanceof Date ? v.getTime() : new Date(v).getTime();
}

/** Crea la tabla en la primera solicitud (patrón runtime DDL del proyecto). */
async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const derived = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${salt}:${derived.toString("hex")}`;
}

async function verifyPassword(password: string, stored: string): Promise<boolean> {
  try {
    const [salt, key] = stored.split(":");
    const derived = (await scryptAsync(password, salt, 64)) as Buffer;
    const keyBuf = Buffer.from(key, "hex");
    if (derived.length !== keyBuf.length) return false;
    return timingSafeEqual(derived, keyBuf);
  } catch {
    return false;
  }
}

function signToken(email: string, nombre: string): string {
  const secret = process.env.JWT_SECRET || "planificadoc-2026";
  const payload = JSON.stringify({ email, nombre, exp: Date.now() + 30 * 24 * 3600 * 1000 });
  const sig = createHmac("sha256", secret).update(payload).digest("hex");
  return Buffer.from(payload).toString("base64") + "." + sig;
}

/**
 * Crea la cuenta en Supabase Auth (auth.users) e inicia sesión para devolver
 * los tokens reales de Supabase. Devuelve además el marcador `supabase:<id>`
 * que se guarda en docente_accounts.passwordHash (esa tabla ya no almacena
 * claves, solo indica DÓNDE está la credencial).
 */
async function createAccountInSupabase(email: string, password: string, nombre: string) {
  const user = await adminCreateUser(email, password, nombre);
  const session = await signInWithPassword(email, password);
  return { session, marker: supabaseHashMarker(session.user?.id || user.id) };
}

/** Campos de sesión de la respuesta (token + refresh para poder renovarla). */
function sessionFields(session: SupabaseSession | null, token: string) {
  return {
    token,
    refreshToken: session?.refreshToken ?? null,
    expiresAt: session ? Date.now() + session.expiresIn * 1000 : null,
  };
}

/** Traduce un fallo de Supabase a una respuesta HTTP (502 con el motivo). */
function providerErrorResponse(res: any, e: any) {
  if (e instanceof AuthProviderError) {
    return res.status(e.status === 400 || e.status === 401 ? 401 : 502).json({ error: e.message });
  }
  return res.status(502).json({ error: "No se pudo contactar con el servicio de autenticación. Intenta de nuevo." });
}

/**
 * Mensaje de error para el cliente.
 *
 * Drizzle lanza `DrizzleQueryError`, cuyo `message` es solo "Failed query: …"
 * y guarda la causa real (credenciales, tabla, timeout…) en `.cause`. Aquí se
 * loguea siempre el stack completo y, fuera de producción (VERCEL_ENV en
 * preview/development), se añade la causa a la respuesta para poder diagnosticar
 * sin exponer detalles internos de la BD en planificadoc.app.
 */
function errorMessage(e: any): string {
  const cause = e?.cause;
  const causeText = typeof cause === "string" ? cause : cause?.message;
  console.error("[auth] query fallida:", e?.message, "\ncausa:", causeText ?? "(sin causa)", "\n", e?.stack);
  if (causeText && process.env.VERCEL_ENV !== "production") {
    return `${e.message}\n→ causa: ${causeText}`;
  }
  return e?.message ?? "Error interno. Intenta de nuevo.";
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCors(req, res)) return;

  const action = req.query.action as string;

  if (!action) return res.status(400).json({ error: "Acción requerida" });

  const db = getDb();
  if (!db) return res.status(500).json({ error: "Base de datos no disponible" });

  // POST /api/auth/register
  if (action === "register") {
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
    const { email, password, nombre } = req.body || {};
    if (!email || !password || !nombre) {
      return res.status(400).json({ error: "Nombre, correo y contraseña son requeridos" });
    }
    if ((password as string).length < 6) {
      return res.status(400).json({ error: "La contraseña debe tener al menos 6 caracteres" });
    }
    const normalizedEmail = (email as string).trim().toLowerCase();
    const trimmedNombre = (nombre as string).trim();

    try {
      const existing = await db
        .select({ id: docenteAccounts.id })
        .from(docenteAccounts)
        .where(eq(docenteAccounts.email, normalizedEmail))
        .limit(1);

      // Existe también en Supabase Auth (p.ej. creada por el panel de admin
      // sin fila local): mismo criterio de rechazo que el registro normal.
      if (isSupabaseAuthConfigured() && (await adminFindUserByEmail(normalizedEmail))) {
        return res.status(409).json({ error: "Ya existe una cuenta con ese correo. Inicia sesión.", exists: true });
      }

      if (existing.length > 0) {
        return res.status(409).json({ error: "Ya existe una cuenta con ese correo. Inicia sesión.", exists: true });
      }

      // La contraseña se guarda en auth.users (Supabase); en docente_accounts
      // solo queda el marcador con el id de ese usuario.
      let session: SupabaseSession | null = null;
      let passwordHash: string;
      if (isSupabaseAuthConfigured()) {
        const created = await createAccountInSupabase(normalizedEmail, password as string, trimmedNombre);
        session = created.session;
        passwordHash = created.marker;
      } else {
        passwordHash = await hashPassword(password as string);
      }

      await db.insert(docenteAccounts).values({ email: normalizedEmail, nombre: trimmedNombre, passwordHash });

      // Refleja la cuenta en public.users y enlaza suscripciones por correo.
      const supabaseId = supabaseIdFromMarker(passwordHash);
      await syncPublicUser({
        email: normalizedEmail,
        name: trimmedNombre,
        supabaseId: supabaseId ?? legacyPublicUserId(normalizedEmail),
        loginMethod: supabaseId ? "supabase" : "legacy",
        signedIn: true,
      });

      const sub = await getActiveSubscription(normalizedEmail);
      const token = session ? session.accessToken : signToken(normalizedEmail, trimmedNombre);
      return res.json({
        success: true,
        ...sessionFields(session, token),
        email: normalizedEmail,
        nombre: trimmedNombre,
        hasActiveSubscription: !!sub,
        subscriptionEndDate: sub ? sub.endDate : null,
      });
    } catch (e: any) {
      if (e instanceof AuthProviderError) return providerErrorResponse(res, e);
      return res.status(500).json({ error: errorMessage(e) });
    }
  }

  // POST /api/auth/register-maintenance
  //
  // Registro ESPECIAL que solo se ofrece desde el login cuando el correo no
  // existe (ver app/paywall.tsx → handleLogin → notFound). No sustituye al
  // registro normal (/register): aquí la cuenta se crea con acceso gratuito
  // temporal por el mantenimiento preventivo.
  //
  // Duración controlada por MAINTENANCE_FREE_DAYS (días, por defecto 30;
  // "0" crea la cuenta sin acceso). Nada de esto afecta al registro normal.
  if (action === "register-maintenance") {
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
    const { email, password, nombre, registrationCode } = req.body || {};
    if (!email || !password || !nombre) {
      return res.status(400).json({ error: "Nombre, correo y contraseña son requeridos" });
    }
    if ((password as string).length < 6) {
      return res.status(400).json({ error: "La contraseña debe tener al menos 6 caracteres" });
    }
    const configuredCode = process.env.MAINTENANCE_REGISTRATION_CODE?.trim().toUpperCase();
    if (!configuredCode) {
      return res.status(503).json({ error: "El registro temporal no está disponible." });
    }
    const submittedCode = typeof registrationCode === "string" ? registrationCode.trim().toUpperCase() : "";
    const expectedCodeBytes = Buffer.from(configuredCode);
    const submittedCodeBytes = Buffer.from(submittedCode);
    if (
      expectedCodeBytes.length !== submittedCodeBytes.length ||
      !timingSafeEqual(expectedCodeBytes, submittedCodeBytes)
    ) {
      return res.status(403).json({ error: "Código de registro inválido." });
    }
    const normalizedEmail = (email as string).trim().toLowerCase();
    const trimmedNombre = (nombre as string).trim();
    const freeDays = Number.parseInt(process.env.MAINTENANCE_FREE_DAYS ?? "30", 10);

    try {
      const existing = await db
        .select({ id: docenteAccounts.id })
        .from(docenteAccounts)
        .where(eq(docenteAccounts.email, normalizedEmail))
        .limit(1);

      if (existing.length > 0) {
        return res.status(409).json({ error: "Ya existe una cuenta con ese correo. Inicia sesión.", exists: true });
      }
      if (isSupabaseAuthConfigured() && (await adminFindUserByEmail(normalizedEmail))) {
        return res.status(409).json({ error: "Ya existe una cuenta con ese correo. Inicia sesión.", exists: true });
      }

      let session: SupabaseSession | null = null;
      let passwordHash: string;
      if (isSupabaseAuthConfigured()) {
        const created = await createAccountInSupabase(normalizedEmail, password as string, trimmedNombre);
        session = created.session;
        passwordHash = created.marker;
      } else {
        passwordHash = await hashPassword(password as string);
      }
      await db.insert(docenteAccounts).values({ email: normalizedEmail, nombre: trimmedNombre, passwordHash });

      // public.users + enlace con suscripciones previas (p.ej. las creadas
      // desde el pago con este correo antes de registrarse).
      const newSupabaseId = supabaseIdFromMarker(passwordHash);
      const publicUserId = await syncPublicUser({
        email: normalizedEmail,
        name: trimmedNombre,
        supabaseId: newSupabaseId ?? legacyPublicUserId(normalizedEmail),
        loginMethod: newSupabaseId ? "supabase" : "legacy",
        signedIn: true,
      });

      // Acceso gratuito temporal del mantenimiento (solo si freeDays > 0)
      let subscriptionEndDate: Date | null = null;
      if (Number.isFinite(freeDays) && freeDays > 0) {
        subscriptionEndDate = new Date(Date.now() + freeDays * 24 * 3600 * 1000);
        await db.insert(subscriptions).values({
          email: normalizedEmail,
          ...(publicUserId ? { userId: publicUserId } : {}),
          plan: "monthly",
          status: "active",
          amountPaid: 0,
          transactionId: `MAINTENANCE-${Date.now()}`,
          startDate: new Date(),
          endDate: subscriptionEndDate,
          isPromo: true,
          isRecurring: false,
        });
      }

      const token = session ? session.accessToken : signToken(normalizedEmail, trimmedNombre);
      return res.json({
        success: true,
        ...sessionFields(session, token),
        email: normalizedEmail,
        nombre: trimmedNombre,
        hasActiveSubscription: subscriptionEndDate !== null,
        subscriptionEndDate,
        maintenanceFree: subscriptionEndDate !== null,
      });
    } catch (e: any) {
      if (e instanceof AuthProviderError) return providerErrorResponse(res, e);
      return res.status(500).json({ error: errorMessage(e) });
    }
  }

  // POST /api/auth/login
  //
  // La credencial la valida Supabase Auth (auth.users, bcrypt). Si el correo
  // todavía no está migrado (hash scrypt heredado en docente_accounts), se
  // valida con el hash local y, si coincide, la cuenta se migra a Supabase en
  // este mismo login (migración perezosa): la contraseña que acaba de escribir
  // el docente pasa a auth.users y en docente_accounts solo queda el marcador
  // `supabase:<id>`.
  if (action === "login") {
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: "Correo y contraseña requeridos" });

    const normalizedEmail = (email as string).trim().toLowerCase();

    try {
      const accounts = await db.select().from(docenteAccounts).where(eq(docenteAccounts.email, normalizedEmail)).limit(1);
      const account = accounts[0];

      if (isSupabaseAuthConfigured()) {
        // 1) Login normal contra Supabase Auth
        try {
          const session = await signInWithPassword(normalizedEmail, password as string);
          if (account) {
            await db.update(docenteAccounts).set({ lastLoginAt: new Date() }).where(eq(docenteAccounts.email, normalizedEmail));
          }
          const nombre = account?.nombre || (session.user?.user_metadata?.nombre as string) || normalizedEmail;
          if (session.user?.id) {
            await syncPublicUser({ email: normalizedEmail, name: account?.nombre ?? nombre, supabaseId: session.user.id, signedIn: true });
          }
          const sub = await getActiveSubscription(normalizedEmail);
          return res.json({
            success: true,
            ...sessionFields(session, session.accessToken),
            email: normalizedEmail,
            nombre,
            hasActiveSubscription: !!sub,
            subscriptionEndDate: sub ? sub.endDate : null,
            plan: sub ? sub.plan : null,
          });
        } catch (e) {
          // Solo seguimos si el problema fue "credenciales inválidas"; el resto
          // (red, 5xx de Supabase) se propaga al catch exterior.
          if (!(e instanceof AuthProviderError) || e.code !== "invalid_credentials") throw e;

          // 2) La cuenta está en Supabase pero la clave no coincide.
          const supaUser = await adminFindUserByEmail(normalizedEmail);
          if (supaUser) {
            return res.status(401).json({ error: "Contraseña incorrecta. Intenta de nuevo.", invalidCredentials: true });
          }

          // 3) Cuenta heredada sin migrar.
          if (!account) {
            return res.status(401).json({ error: "No encontramos una cuenta con ese correo.", notFound: true });
          }
          if (!isLegacyHash(account.passwordHash)) {
            return res.status(401).json({ error: "Contraseña incorrecta. Intenta de nuevo.", invalidCredentials: true });
          }
          const valid = await verifyPassword(password as string, account.passwordHash);
          if (!valid) {
            return res.status(401).json({ error: "Contraseña incorrecta. Intenta de nuevo.", invalidCredentials: true });
          }

          // 4) Migración perezosa: la clave válida se guarda ahora en Supabase.
          const user = await adminSetPassword(normalizedEmail, password as string);
          const migrated = await signInWithPassword(normalizedEmail, password as string);
          await db
            .update(docenteAccounts)
            .set({ passwordHash: supabaseHashMarker(user.id), lastLoginAt: new Date() })
            .where(eq(docenteAccounts.email, normalizedEmail));
          await syncPublicUser({ email: normalizedEmail, name: account.nombre, supabaseId: user.id, signedIn: true });

          const sub = await getActiveSubscription(normalizedEmail);
          return res.json({
            success: true,
            ...sessionFields(migrated, migrated.accessToken),
            email: normalizedEmail,
            nombre: account.nombre,
            hasActiveSubscription: !!sub,
            subscriptionEndDate: sub ? sub.endDate : null,
            plan: sub ? sub.plan : null,
            migrated: true,
          });
        }
      }

      // ── Modo legacy: Supabase Auth no configurado (entornos de prueba) ──
      if (!account) {
        return res.status(401).json({ error: "No encontramos una cuenta con ese correo.", notFound: true });
      }
      const valid = await verifyPassword(password as string, account.passwordHash);
      if (!valid) return res.status(401).json({ error: "Contraseña incorrecta. Intenta de nuevo.", invalidCredentials: true });

      await db.update(docenteAccounts).set({ lastLoginAt: new Date() }).where(eq(docenteAccounts.email, normalizedEmail));
      await syncPublicUser({
        email: normalizedEmail,
        name: account.nombre,
        supabaseId: legacyPublicUserId(normalizedEmail),
        loginMethod: "legacy",
        signedIn: true,
      });

      const sub = await getActiveSubscription(normalizedEmail);
      const token = signToken(normalizedEmail, account.nombre);
      return res.json({ success: true, ...sessionFields(null, token), email: normalizedEmail, nombre: account.nombre, hasActiveSubscription: !!sub, subscriptionEndDate: sub ? sub.endDate : null, plan: sub ? sub.plan : null });
    } catch (e: any) {
      if (e instanceof AuthProviderError) return providerErrorResponse(res, e);
      return res.status(500).json({ error: errorMessage(e) });
    }
  }

  // POST /api/auth/forgot-password — envía un código de 6 dígitos al correo.
  // Respuesta idéntica exista o no la cuenta (evita filtrar quién está registrado).
  if (action === "forgot-password") {
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
    const { email } = req.body || {};
    if (!email) return res.status(400).json({ error: "Correo requerido" });
    const normalizedEmail = (email as string).trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return res.status(400).json({ error: "Correo inválido" });
    }

    const genericMessage = "Si existe una cuenta con ese correo, recibirás un código de 6 dígitos en unos minutos.";

    try {

      const accounts = await db
        .select()
        .from(docenteAccounts)
        .where(eq(docenteAccounts.email, normalizedEmail))
        .limit(1);

      if (accounts.length > 0) {
        // Rate limit: 1 código por minuto. Se omite el reenvío en silencio pero la
        // respuesta es siempre la genérica para no revelar la existencia de la cuenta.
        const recent = await db
          .select()
          .from(passwordResetCodes)
          .where(eq(passwordResetCodes.email, normalizedEmail))
          .orderBy(desc(passwordResetCodes.sentAt))
          .limit(1);
        const last = recent[0];
        const withinCooldown = last && Date.now() - toTime(last.sentAt) < RESET_RESEND_MS;

        if (!withinCooldown) {
          const code = randomInt(0, 1_000_000).toString().padStart(6, "0");
          // Un solo código activo por correo: el nuevo reemplaza al anterior.
          await db.delete(passwordResetCodes).where(eq(passwordResetCodes.email, normalizedEmail));
          await db.insert(passwordResetCodes).values({
            email: normalizedEmail,
            codeHash: hashCodeReset(code),
            attempts: 0,
            expiresAt: new Date(Date.now() + RESET_CODE_TTL_MS),
            sentAt: new Date(),
          });
          const sent = await sendPasswordResetCodeEmail(normalizedEmail, code, RESET_CODE_TTL_MS / 60000);
          if (!sent) console.error(`[Auth] No se pudo enviar el código de recuperación a ${normalizedEmail}`);
        }
      }

      return res.json({ success: true, message: genericMessage });
    } catch (e: any) {
      return res.status(500).json({ error: errorMessage(e) });
    }
  }

  // POST /api/auth/reset-password — verifica el código (un solo uso) y guarda la contraseña nueva
  if (action === "reset-password") {
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
    const { email, code, password } = req.body || {};
    if (!email || !code || !password) {
      return res.status(400).json({ error: "Correo, código y contraseña son requeridos" });
    }
    const normalizedEmail = (email as string).trim().toLowerCase();
    const codeStr = String(code).trim();
    if (!/^\d{6}$/.test(codeStr)) return res.status(400).json({ error: "El código debe tener 6 dígitos" });
    if ((password as string).length < 6) {
      return res.status(400).json({ error: "La contraseña debe tener al menos 6 caracteres" });
    }

    try {

      const rows = await db
        .select()
        .from(passwordResetCodes)
        .where(eq(passwordResetCodes.email, normalizedEmail))
        .orderBy(desc(passwordResetCodes.sentAt))
        .limit(1);
      const row = rows[0];

      if (!row) {
        return res.status(400).json({ error: "El código no es válido o ya fue usado. Solicita uno nuevo." });
      }
      if (toTime(row.expiresAt) < Date.now()) {
        await db.delete(passwordResetCodes).where(eq(passwordResetCodes.email, normalizedEmail));
        return res.status(400).json({ error: "El código ha expirado. Solicita uno nuevo." });
      }
      if (row.attempts >= RESET_MAX_ATTEMPTS) {
        await db.delete(passwordResetCodes).where(eq(passwordResetCodes.email, normalizedEmail));
        return res.status(400).json({ error: "Demasiados intentos fallidos. Solicita un código nuevo." });
      }

      if (!codesMatch(codeStr, row.codeHash)) {
        await db
          .update(passwordResetCodes)
          .set({ attempts: row.attempts + 1 })
          .where(eq(passwordResetCodes.id, row.id));
        const left = RESET_MAX_ATTEMPTS - (row.attempts + 1);
        return res.status(400).json({
          error: left > 0
            ? `Código incorrecto. Te ${left === 1 ? "queda 1 intento" : `quedan ${left} intentos`}.`
            : "Código incorrecto.",
          attemptsLeft: Math.max(left, 0),
        });
      }

      const accounts = await db
        .select()
        .from(docenteAccounts)
        .where(eq(docenteAccounts.email, normalizedEmail))
        .limit(1);
      if (accounts.length === 0) {
        await db.delete(passwordResetCodes).where(eq(passwordResetCodes.email, normalizedEmail));
        return res.status(400).json({ error: "El código no es válido o ya fue usado. Solicita uno nuevo." });
      }

      // La contraseña nueva se guarda en Supabase Auth (auth.users) y en
      // docente_accounts solo queda el marcador `supabase:<id>`.
      let passwordHash: string;
      if (isSupabaseAuthConfigured()) {
        const user = await adminSetPassword(normalizedEmail, password as string);
        passwordHash = supabaseHashMarker(user.id);
      } else {
        passwordHash = await hashPassword(password as string);
      }
      await db
        .update(docenteAccounts)
        .set({ passwordHash })
        .where(eq(docenteAccounts.email, normalizedEmail));
      const resetSupabaseId = supabaseIdFromMarker(passwordHash);
      if (resetSupabaseId) {
        await syncPublicUser({ email: normalizedEmail, name: accounts[0].nombre, supabaseId: resetSupabaseId });
      }
      // Un solo uso: el código se consume al aplicarse.
      await db.delete(passwordResetCodes).where(eq(passwordResetCodes.email, normalizedEmail));

      return res.json({ success: true, message: "Contraseña actualizada. Ya puedes iniciar sesión." });
    } catch (e: any) {
      if (e instanceof AuthProviderError) return providerErrorResponse(res, e);
      return res.status(500).json({ error: errorMessage(e) });
    }
  }

  // POST /api/auth/refresh — renueva la sesión con el refresh token de Supabase.
  if (action === "refresh") {
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
    const { refreshToken } = req.body || {};
    if (!refreshToken) return res.status(400).json({ error: "refreshToken requerido" });
    if (!isSupabaseAuthConfigured()) return res.status(400).json({ error: "Supabase Auth no está configurado" });

    try {
      const session = await refreshSession(String(refreshToken));
      return res.json({ success: true, ...sessionFields(session, session.accessToken), email: session.user?.email ?? null });
    } catch (e: any) {
      if (e instanceof AuthProviderError) return res.status(401).json({ error: e.message });
      return res.status(500).json({ error: errorMessage(e) });
    }
  }

  // GET/POST /api/auth/me — valida el access token de Supabase y devuelve el
  // usuario autenticado. Es la comprobación de sesión real del backend.
  if (action === "me") {
    const token = getBearerToken(req);
    if (!token) return res.status(401).json({ error: "No autenticado" });
    if (!isSupabaseAuthConfigured()) return res.status(500).json({ error: "Supabase Auth no está configurado" });

    try {
      const payload = await verifyAccessToken(token);
      const email = String(payload.email || payload.sub || "");
      const accounts = email
        ? await db.select().from(docenteAccounts).where(eq(docenteAccounts.email, email.trim().toLowerCase())).limit(1)
        : [];
      const sub = email ? await getActiveSubscription(email.trim().toLowerCase()) : null;
      return res.json({
        user: {
          id: payload.sub,
          email,
          nombre: accounts[0]?.nombre ?? (payload.user_metadata?.nombre as string) ?? null,
          role: payload.role,
        },
        hasActiveSubscription: !!sub,
        subscriptionEndDate: sub ? sub.endDate : null,
        plan: sub ? sub.plan : null,
      });
    } catch (e: any) {
      return res.status(401).json({ error: "Sesión inválida o expirada. Inicia sesión de nuevo." });
    }
  }

  return res.status(404).json({ error: "Acción no encontrada" });
}
