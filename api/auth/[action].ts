import type { VercelRequest, VercelResponse } from "@vercel/node";
import { handleCors } from "../_lib/admin-auth";
import { getDb, getActiveSubscription } from "../_lib/db";
import { docenteAccounts } from "../../drizzle/schema";
import { eq, sql as drizzleSql } from "drizzle-orm";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { SignJWT, jwtVerify } from "jose";

const scryptAsync = promisify(scrypt);

function getJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET || "planificadoc-jwt-secret-2026-fallback";
  return new TextEncoder().encode(secret);
}

async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${salt}:${derivedKey.toString("hex")}`;
}

async function verifyPassword(password: string, hash: string): Promise<boolean> {
  try {
    const [salt, key] = hash.split(":");
    const derivedKey = (await scryptAsync(password, salt, 64)) as Buffer;
    const keyBuffer = Buffer.from(key, "hex");
    return timingSafeEqual(derivedKey, keyBuffer);
  } catch {
    return false;
  }
}

async function createToken(email: string, nombre: string): Promise<string> {
  return new SignJWT({ email, nombre })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(getJwtSecret());
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCors(req, res)) return;

  const action = req.query.action as string;
  const db = getDb();
  if (!db) return res.status(500).json({ error: "Base de datos no disponible" });

  // ─── SETUP: CREATE TABLE IF NOT EXISTS ───────────────────────────────────
  // GET /api/auth/setup — run once to create the docente_accounts table
  if (action === "setup") {
    try {
      await db.execute(drizzleSql.raw(`
        CREATE TABLE IF NOT EXISTS docente_accounts (
          id INT AUTO_INCREMENT PRIMARY KEY,
          email VARCHAR(320) NOT NULL UNIQUE,
          nombre VARCHAR(255) NOT NULL,
          passwordHash VARCHAR(512) NOT NULL,
          createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
          updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL
        )
      `));
      return res.json({ success: true, message: "Tabla docente_accounts lista." });
    } catch (e: any) {
      return res.status(500).json({ error: e.message });
    }
  }

  // ─── REGISTER ─────────────────────────────────────────────────────────────
  // POST /api/auth/register
  if (action === "register") {
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

    const { email, password, nombre } = req.body || {};

    if (!email || !password || !nombre) {
      return res.status(400).json({ error: "Nombre, correo y contraseña son requeridos" });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return res.status(400).json({ error: "Correo inválido" });
    }
    if ((password as string).length < 6) {
      return res.status(400).json({ error: "La contraseña debe tener al menos 6 caracteres" });
    }

    const normalizedEmail = (email as string).trim().toLowerCase();
    const trimmedNombre = (nombre as string).trim();

    // Check if already exists
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

    // Check if they already have a subscription (e.g. paid before creating account)
    const sub = await getActiveSubscription(normalizedEmail);
    const token = await createToken(normalizedEmail, trimmedNombre);

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

  // ─── LOGIN ────────────────────────────────────────────────────────────────
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
      // No account → tell them to register
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
    const token = await createToken(normalizedEmail, account.nombre);

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

  // ─── FORGOT PASSWORD (placeholder) ───────────────────────────────────────
  if (action === "forgot-password") {
    return res.json({
      success: true,
      message: "Si tienes una cuenta, recibirás instrucciones. Contacta a soporte por WhatsApp si no recibes nada.",
    });
  }

  return res.status(404).json({ error: "Acción no encontrada" });
}
