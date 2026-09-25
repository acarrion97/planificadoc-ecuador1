import type { VercelRequest, VercelResponse } from "@vercel/node";
import { handleCors } from "../_lib/admin-auth";
import { getDb, getActiveSubscription } from "../_lib/db";
import { docenteAccounts, passwordResetCodes } from "../../drizzle/schema";
import { eq, desc, sql as drizzleSql } from "drizzle-orm";
import { createHmac, randomBytes, randomInt, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { sendPasswordResetCodeEmail } from "../../server/email";

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
async function ensurePasswordResetTable(db: NonNullable<ReturnType<typeof getDb>>) {
  await db.execute(drizzleSql.raw(
    `CREATE TABLE IF NOT EXISTS password_reset_codes (
      id INT AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(320) NOT NULL,
      codeHash VARCHAR(128) NOT NULL,
      attempts INT NOT NULL DEFAULT 0,
      expiresAt TIMESTAMP NOT NULL,
      sentAt TIMESTAMP NOT NULL,
      KEY idx_password_reset_email (email)
    )`
  ));
}

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

      if (existing.length > 0) {
        return res.status(409).json({ error: "Ya existe una cuenta con ese correo. Inicia sesión.", exists: true });
      }

      const passwordHash = await hashPassword(password as string);
      await db.insert(docenteAccounts).values({ email: normalizedEmail, nombre: trimmedNombre, passwordHash });

      const sub = await getActiveSubscription(normalizedEmail);
      const token = signToken(normalizedEmail, trimmedNombre);
      return res.json({ success: true, token, email: normalizedEmail, nombre: trimmedNombre, hasActiveSubscription: !!sub, subscriptionEndDate: sub ? sub.endDate : null });
    } catch (e: any) {
      return res.status(500).json({ error: e.message });
    }
  }

  // POST /api/auth/login
  if (action === "login") {
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: "Correo y contraseña requeridos" });

    const normalizedEmail = (email as string).trim().toLowerCase();

    try {
      const accounts = await db.select().from(docenteAccounts).where(eq(docenteAccounts.email, normalizedEmail)).limit(1);
      if (accounts.length === 0) {
        return res.status(401).json({ error: "No encontramos una cuenta con ese correo.", notFound: true });
      }
      const account = accounts[0];
      const valid = await verifyPassword(password as string, account.passwordHash);
      if (!valid) return res.status(401).json({ error: "Contraseña incorrecta. Intenta de nuevo." });

      try {
        await db.execute(drizzleSql.raw(`ALTER TABLE docente_accounts ADD COLUMN IF NOT EXISTS lastLoginAt TIMESTAMP NULL`));
      } catch (_) { /* ya existe */ }
      await db.update(docenteAccounts).set({ lastLoginAt: new Date() }).where(eq(docenteAccounts.email, normalizedEmail));

      const sub = await getActiveSubscription(normalizedEmail);
      const token = signToken(normalizedEmail, account.nombre);
      return res.json({ success: true, token, email: normalizedEmail, nombre: account.nombre, hasActiveSubscription: !!sub, subscriptionEndDate: sub ? sub.endDate : null, plan: sub ? sub.plan : null });
    } catch (e: any) {
      return res.status(500).json({ error: e.message });
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
      await ensurePasswordResetTable(db);

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
      return res.status(500).json({ error: e.message });
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
      await ensurePasswordResetTable(db);

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

      const passwordHash = await hashPassword(password as string);
      await db
        .update(docenteAccounts)
        .set({ passwordHash })
        .where(eq(docenteAccounts.email, normalizedEmail));
      // Un solo uso: el código se consume al aplicarse.
      await db.delete(passwordResetCodes).where(eq(passwordResetCodes.email, normalizedEmail));

      return res.json({ success: true, message: "Contraseña actualizada. Ya puedes iniciar sesión." });
    } catch (e: any) {
      return res.status(500).json({ error: e.message });
    }
  }

  return res.status(404).json({ error: "Acción no encontrada" });
}
