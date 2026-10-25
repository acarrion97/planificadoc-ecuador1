/**
 * Aplica las migraciones de `supabase/migrations/*.sql` en orden.
 *
 * Este es el `db:push` del proyecto desde la migración a PostgreSQL/Supabase:
 * la fuente de verdad del esquema son esos archivos SQL (no `drizzle-kit`,
 * cuyas migraciones MySQL quedaron archivadas en `drizzle/legacy-mysql/`).
 *
 * Es idempotente: lleva la cuenta de lo ya aplicado en la tabla
 * `public.schema_migrations`, así que re-ejecutarlo no vuelve a correr lo que
 * ya está aplicado (el esquema inicial NO usa `IF NOT EXISTS`).
 *
 * Uso:
 *   npx tsx scripts/db-push.ts             # aplica lo pendiente
 *   npx tsx scripts/db-push.ts --dry-run   # solo lista qué aplicaría
 *
 * La conexión sale de `SUPABASE_DB_URL` (prioridad) o `DATABASE_URL`,
 * con la normalización SSL de `shared/pg-ssl.ts`.
 */
import fs from "fs";
import path from "path";
import { Client } from "pg";
import { pgPoolConfig } from "../shared/pg-ssl";

// Carga .env sin pisar lo que ya venga del entorno (patrón de scripts/load-env.js).
const envPath = path.resolve(process.cwd(), ".env");
if (fs.existsSync(envPath)) {
  for (const raw of fs.readFileSync(envPath, "utf8").split("\n")) {
    const line = raw.trim();
    if (!line || line.startsWith("#") || !line.includes("=")) continue;
    const i = line.indexOf("=");
    const key = line.slice(0, i).trim();
    const value = line.slice(i + 1).trim().replace(/^["']|["']$/g, "");
    if (!process.env[key]) process.env[key] = value;
  }
}

// Tipado como `string` para que el chequeo valga también dentro de `main()`.
const connectionString: string = (() => {
  const url = process.env.SUPABASE_DB_URL || process.env.DATABASE_URL;
  if (!url) {
    console.error("✗ Definí SUPABASE_DB_URL (o DATABASE_URL) antes de correr db:push.");
    process.exit(1);
  }
  return url;
})();

const MIGRATIONS_DIR = path.resolve(process.cwd(), "supabase/migrations");
const dryRun = process.argv.includes("--dry-run");

async function main() {
  const archivos = fs
    .readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith(".sql"))
    .sort();

  if (archivos.length === 0) {
    console.error(`✗ No hay .sql en ${MIGRATIONS_DIR}`);
    process.exit(1);
  }

  const client = new Client({
    ...pgPoolConfig(connectionString),
    connectionTimeoutMillis: 15000,
  });
  await client.connect();

  try {
    const version = await client.query("select version()");
    console.log(`→ ${String(version.rows[0].version).split(" on")[0]}`);

    await client.query(`
      create table if not exists public.schema_migrations (
        filename text primary key,
        applied_at timestamptz not null default now()
      )
    `);

    let { rows } = await client.query("select filename from public.schema_migrations");

    // Arranque contra una base ya inicializada (el esquema se creó a mano con
    // el SQL Editor de Supabase): se marcan los archivos existentes como
    // aplicados para no re-correr un CREATE TABLE que ya está.
    if (rows.length === 0) {
      const existe = await client.query("select to_regclass('public.users') as t");
      if (existe.rows[0].t) {
        if (dryRun) {
          console.log(`✓ Base ya inicializada: se marcarían ${archivos.length} migración(es) como aplicadas.`);
          rows = archivos.map((f) => ({ filename: f }));
        } else {
          for (const archivo of archivos) {
            await client.query(
              "insert into public.schema_migrations (filename) values ($1) on conflict do nothing",
              [archivo],
            );
          }
          ({ rows } = await client.query("select filename from public.schema_migrations"));
          console.log(`✓ Base ya inicializada: ${rows.length} migración(es) marcadas como aplicadas.`);
        }
      }
    }

    const aplicadas = new Set(rows.map((r) => r.filename));
    const pendientes = archivos.filter((f) => !aplicadas.has(f));

    if (pendientes.length === 0) {
      console.log(`✓ Migraciones al día (${archivos.length}/${archivos.length} aplicadas).`);
      return;
    }

    console.log(`→ Pendientes: ${pendientes.join(", ")}`);
    if (dryRun) {
      console.log("(dry-run: no se aplicó nada)");
      return;
    }

    for (const archivo of pendientes) {
      const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, archivo), "utf8");
      process.stdout.write(`→ Aplicando ${archivo} ... `);
      try {
        await client.query("begin");
        await client.query(sql);
        await client.query("insert into public.schema_migrations (filename) values ($1)", [archivo]);
        await client.query("commit");
        console.log("ok");
      } catch (err) {
        await client.query("rollback");
        console.log("FALLO");
        throw new Error(`${archivo}: ${(err as Error).message}`);
      }
    }

    console.log(`✓ ${pendientes.length} migración(es) aplicadas.`);
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error(`✗ ${err instanceof Error ? err.message : err}`);
  process.exit(1);
});
