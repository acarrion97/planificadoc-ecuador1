import type { VercelRequest, VercelResponse } from "@vercel/node";
import { handleCors } from "../_lib/admin-auth";
import { getDb, getActiveSubscription } from "../_lib/db";
import { docenteAccounts } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import { createHmac, randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scryptAsync = promisify(scrypt);

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

      const sub = await getActiveSubscription(normalizedEmail);
      const token = signToken(normalizedEmail, account.nombre);
      return res.json({ success: true, token, email: normalizedEmail, nombre: account.nombre, hasActiveSubscription: !!sub, subscriptionEndDate: sub ? sub.endDate : null, plan: sub ? sub.plan : null });
    } catch (e: any) {
      return res.status(500).json({ error: e.message });
    }
  }

  return res.status(404).json({ error: "Acción no encontrada" });
}
