import type { VercelRequest, VercelResponse } from "@vercel/node";
import { handleCors } from "../_lib/admin-auth";
import { getDb, getActiveSubscription } from "../_lib/db";
import { docenteAccounts } from "../../drizzle/schema";
import { eq, sql as rawSql } from "drizzle-orm";
import { scrypt, randomBytes, timingSafeEqual, createHmac } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

// ─── Password hashing (scrypt) ────────────────────────────────────────────────

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
    return timingSafeEqual(derived, keyBuf);
  } catch {
    return false;
  }
}

// ─── Simple JWT with Node crypto (no external deps) ──────────────────────────

function b64url(data: string): string {
  return Buffer.from(data).toString("base64url");
}

function getSecret(): string {
  return process.env.JWT_SECRET || "planificadoc-jwt-secret-2026-fallback";
}

function signToken(payload: Record<string, unknown>): string {
  const header = b64url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const exp = Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60; // 30 days
  const body = b64url(JSON.stringify({ ...payload, exp, iat: Math.floor(Date.now() / 1000) }));
  const sig = createHmac("sha256", getSecret())
    .update(`${header}.${body}`)
    .digest("base64url");
  return `${header}.${body}.${sig}`;
}

function verifyToken(token: string): Record<string, unknown> | null {
  try {
    const [header, body, sig] = token.split(".");
    const expected = createHmac("sha256", getSecret())
      .update(`${header}.${body}`)
      .digest("base64url");
    if (!timingSafeEqual(Buffer.from(sig, "utf8"), Buffer.from(expected, "utf8"))) return null;
    const payload = JSON.parse(Buffer.from(body, "base64url").toString());
    if (payload.exp && payload.exp < Date.now() / 1000) return null;
    return payload;
  } catch {
    return null;
  }
}

// ─── Handler ──────────────────────────────────────────────────────────────────

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCors(req, res)) return;

  const action = req.query.action as string;
  const db = getDb();
  if (!db) return res.status(500).json({ error: "Base de datos no disponible" });

  // GET /api/auth/setup — crear tabla si no existe
  if (action === "setup") {
    try {
      await db.execute(rawSql.raw(
        `CREATE TABLE IF NOT EXISTS docente_accounts (
          id INT AUTO_INCREMENT PRIMARY KEY,
          email VARCHAR(320) NOT NULL UNIQUE,
          nombre VARCHAR(255) NOT NULL,
          passwordHash VARCHAR(512) NOT NULL,
          createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
          updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL
        )`
      ));
      return res.json({ success: true, message: "Tabla lista." });
    } catch (e: any) {
      return res.status(500).json({ error: e.message });
    }
  }

  // POST /api/auth/register
  if (action === "register") {
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

    const { email, password, nombre } = req.body || {};
    if (!email || !password || !nombre) {
      return res.status(400).json({ error: "Nombre, correo y contraseña son requeridos" });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((email as string).trim())) {
      return res.status(400).json({ error: "Correo inválido" });
    }
    if ((password as string).length < 6) {
      return res.status(400).json({ error: "La contraseña debe tener al menos 6 caracteres" });
    }

    const normalizedEmail = (email as string).trim().toLowerCase();
    const trimmedNombre = (nombre as string).trim();

    const existing = await db
      .select({ id: docenteAccounts.id })
      .from(docenteAccounts)
      .where(eq(docenteAccounts.email, normalizedEmail))
      .limit(1);

    if (existing.length > 0) {
      return res.status(409).json({
        error: "Ya existe una cuenta con ese correo. Inicia sesión.",
        exists: true,
      });
    }

    const passwordHash = await hashPassword(password as string);
    await db.insert(docenteAccounts).values({
      email: normalizedEmail,
      nombre: trimmedNombre,
      passwordHash,
    });

    const sub = await getActiveSubscription(normalizedEmail);
    const token = signToken({ email: normalizedEmail, nombre: trimmedNombre });

    return res.json({
      success: true,
      token,
      email: normalizedEmail,
      nombre: trimmedNombre,
      hasActiveSubscription: !!sub,
      subscriptionEndDate: sub ? sub.endDate : null,
      plan: sub ? sub.plan : null,
    });
  }

  // POST /api/auth/login
  if (action === "login") {
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: "Correo y contraseña requeridos" });
    }

    const normalizedEmail = (email as string).trim().toLowerCase();

    const accounts = await db
      .select()
      .from(docenteAccounts)
      .where(eq(docenteAccounts.email, normalizedEmail))
      .limit(1);

    if (accounts.length === 0) {
      return res.status(401).json({
        error: "No encontramos una cuenta con ese correo.",
        notFound: true,
      });
    }

    const account = accounts[0];
    const valid = await verifyPassword(password as string, account.passwordHash);
    if (!valid) {
      return res.status(401).json({ error: "Contraseña incorrecta. Intenta de nuevo." });
    }

    const sub = await getActiveSubscription(normalizedEmail);
    const token = signToken({ email: normalizedEmail, nombre: account.nombre });

    return res.json({
      success: true,
      token,
      email: normalizedEmail,
      nombre: account.nombre,
      hasActiveSubscription: !!sub,
      subscriptionEndDate: sub ? sub.endDate : null,
      plan: sub ? sub.plan : null,
    });
  }

  return res.status(404).json({ error: "Acción no encontrada" });
}
