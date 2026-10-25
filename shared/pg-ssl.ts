import type { PoolConfig } from "pg";

/**
 * Normaliza la config de conexión de node-postgres (Supabase).
 *
 * Dos problemas que sin este helper rompen el login en Vercel:
 *
 * 1. Supabase firma con una CA propia ("Supabase Root 2021 CA") que Node no
 *    trae en su almacén de confianza, así que verificar el certificado muere
 *    con `SELF_SIGNED_CERT_IN_CHAIN`.
 *
 * 2. En pg >= 8.23 `sslmode=require` equivale a `verify-full` (ver el
 *    "SECURITY WARNING" de pg-connection-string), es decir: pide verificación
 *    completa y choca contra el punto 1. La semántica real de libpq `require`
 *    es "cifrar sin verificar el certificado", que es lo que Supabase espera
 *    de sus clientes.
 *
 * Por eso se quita el `sslmode` de la URL (si no, la URL pisa al `ssl` que se
 * pase por opción: probado, `?sslmode=require` + `ssl: {...}` falla igual) y se
 * fija `rejectUnauthorized: false` de forma explícita.
 */
export function pgPoolConfig(connectionString: string): PoolConfig {
  let url: URL;
  try {
    url = new URL(connectionString);
  } catch {
    // No es una URL parseable: se pasa tal cual y que pg decida.
    return { connectionString };
  }

  const sslmode = url.searchParams.get("sslmode");

  // Deshabilitado a pedido del que configuró la variable.
  if (sslmode === "disable") return { connectionString };

  // Verificación completa pedida explícitamente: se respeta (el que la pidió
  // sabe que tiene que inyectar la CA con sslrootcert).
  if (sslmode === "verify-full") return { connectionString };

  // Sin sslmode: Supabase siempre va cifrado; para el resto (postgres local)
  // se conserva el comportamiento por defecto de pg, sin SSL.
  if (!sslmode && !url.hostname.endsWith(".supabase.com")) {
    return { connectionString };
  }

  url.searchParams.delete("sslmode");
  return {
    connectionString: url.toString(),
    ssl: { rejectUnauthorized: false },
  };
}
