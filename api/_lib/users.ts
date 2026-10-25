/**
 * `public.users` — la tabla de usuarios de la aplicación.
 *
 * Esta tabla era el núcleo del login antiguo (OAuth/express) y quedó vacía
 * cuando la autenticación pasó a Supabase Auth: mientras `auth.users`,
 * `docente_accounts` y `subscriptions` se iban llenando, `public.users` no
 * tenía ninguna fila y las tablas dependientes (p.ej. `subscriptions.userId`)
 * quedaban sin su referencia.
 *
 * Regla: cada vez que se crea o autentica una cuenta se refleja aquí su fila,
 * con `openId` = id del usuario en `auth.users` (o un id estable derivado del
 * correo cuando Supabase Auth no está configurado).
 * Después se enlazan las suscripciones existentes por correo (`userId`).
 *
 * Todo es "best effort": si falla, se registra el aviso y el flujo de
 * autenticación sigue adelante — `public.users` no puede romper un login.
 */
import { createHash } from "node:crypto";
import { eq } from "drizzle-orm";
import { subscriptions, users } from "../../drizzle/schema";
import { getDb } from "./db";

/** Identificador estable para cuentas locales sin Supabase Auth. */
export function legacyPublicUserId(email: string): string {
  const normalizedEmail = email.trim().toLowerCase();
  const hash = createHash("sha256").update(normalizedEmail).digest("hex");
  return `legacy:${hash.slice(0, 57)}`;
}

export type PublicUserInput = {
  /** Correo de la cuenta (se normaliza a minúsculas). */
  email: string;
  /** Id del usuario en `auth.users` (Supabase Auth). */
  supabaseId: string;
  /** Nombre visible; si no se pasa, no se toca el que ya hubiera. */
  name?: string | null;
  /** "supabase" por defecto (email+contraseña vía GoTrue). */
  loginMethod?: string;
  role?: "user" | "admin";
  /** true cuando además se emite sesión (login/registro) → actualiza `lastSignedIn`. */
  signedIn?: boolean;
};

/**
 * Crea (o actualiza) la fila de `public.users` de una cuenta.
 * Devuelve su `users.id` o `null` si no pudo resolverse. Nunca lanza.
 */
export async function upsertPublicUser(input: PublicUserInput): Promise<number | null> {
  try {
    const db = getDb();
    if (!db) return null;

    const email = input.email.trim().toLowerCase();
    if (!email || !input.supabaseId) return null;

    const now = new Date();
    const set: Record<string, unknown> = { email, updatedAt: now };
    if (input.name != null) set.name = input.name;
    if (input.loginMethod) set.loginMethod = input.loginMethod;
    if (input.signedIn) set.lastSignedIn = now;

    const row = await db
      .insert(users)
      .values({
        openId: input.supabaseId,
        email,
        name: input.name ?? null,
        loginMethod: input.loginMethod ?? "supabase",
        role: input.role ?? "user",
        lastSignedIn: now,
      })
      .onConflictDoUpdate({
        // openId es único: la fila ya existe → se actualiza sin tocar `role`
        // (así no se degrada un admin a usuario).
        target: users.openId,
        set,
      })
      .returning({ id: users.id });

    return row?.[0]?.id ?? null;
  } catch (e) {
    console.warn("[users] No se pudo reflejar la cuenta en public.users:", (e as Error)?.message ?? e);
    return null;
  }
}

/**
 * Enlaza con `users.id` todas las suscripciones de un correo que todavía no
 * tengan `userId`. Nunca lanza.
 */
export async function linkSubscriptionsToUser(email: string, userId: number): Promise<void> {
  try {
    const db = getDb();
    if (!db || !userId) return;
    const normalized = email.trim().toLowerCase();

    const rows = await db.select({ id: subscriptions.id, userId: subscriptions.userId }).from(subscriptions).where(eq(subscriptions.email, normalized));
    for (const r of rows) {
      if (r.userId != null) continue;
      await db.update(subscriptions).set({ userId }).where(eq(subscriptions.id, r.id));
    }
  } catch (e) {
    console.warn("[users] No se pudieron enlazar suscripciones:", (e as Error)?.message ?? e);
  }
}

/**
 * Refleja una cuenta autenticada en `public.users` y enlaza sus
 * suscripciones pendientes. Es la llamada que usan login, registro y admin.
 * Devuelve `users.id` o `null`. Nunca lanza.
 */
export async function syncPublicUser(input: PublicUserInput): Promise<number | null> {
  const id = await upsertPublicUser(input);
  if (id) await linkSubscriptionsToUser(input.email, id);
  return id;
}

/**
 * `users.id` de un correo, para rellenar referencias externas
 * (p.ej. `payment_attribution.user_id`). `null` si no existe o falla.
 */
export async function findPublicUserIdByEmail(email: string): Promise<number | null> {
  try {
    const db = getDb();
    if (!db) return null;
    const rows = await db.select({ id: users.id }).from(users).where(eq(users.email, email.trim().toLowerCase())).limit(1);
    return rows[0]?.id ?? null;
  } catch (e) {
    console.warn("[users] No se pudo resolver el usuario:", (e as Error)?.message ?? e);
    return null;
  }
}
