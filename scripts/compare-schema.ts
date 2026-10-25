/**
 * Contrasta drizzle/schema.ts con las tablas reales de Supabase.
 * Solo compara NOMBRES de columnas (lo que rompe en runtime con
 * `column "x" does not exist`), no los tipos.
 *
 * Uso: npx tsx scripts/compare-schema.ts
 */
import { Pool } from "pg";
import fs from "fs";
import * as schema from "../drizzle/schema";

const env: Record<string, string> = {};
for (const raw of fs.readFileSync(".env", "utf8").split("\n")) {
  const line = raw.trim();
  if (!line || line.startsWith("#") || !line.includes("=")) continue;
  const i = line.indexOf("=");
  env[line.slice(0, i).trim()] = line.slice(i + 1).trim();
}

const pool = new Pool({ connectionString: env.SUPABASE_DB_URL, connectionTimeoutMillis: 15000 });

const IS_TABLE = Symbol.for("drizzle:IsDrizzleTable");
const NAME = Symbol.for("drizzle:Name");
const COLUMNS = Symbol.for("drizzle:Columns");

const TABLAS: Array<[string, any]> = Object.entries(schema).filter(
  ([, v]) => v && typeof v === "object" && (v as any)[IS_TABLE],
) as Array<[string, any]>;

async function main() {
  console.log(`Tablas en el schema: ${TABLAS.length}\n`);
  let problemas = 0;

  for (const [key, table] of TABLAS) {
    const tableName: string = table[NAME];
    // `pgTable()` devuelve un proxy cuyas propiedades son las columnas; cada
    // columna expone `.name` con el nombre REAL de la BD (puede ser snake_case
    // aunque la propiedad sea camelCase).
    const schemaCols = Object.values(table as Record<string, any>)
      .map((c) => (c && typeof c === "object" && typeof c.name === "string" ? c.name : null))
      .filter((n): n is string => !!n);

    const res = await pool.query(
      `select column_name from information_schema.columns
       where table_schema = 'public' and table_name = $1`,
      [tableName],
    );

    if (res.rows.length === 0) {
      console.log(`❌ ${tableName} (export: ${key}) — NO EXISTE en Supabase`);
      problemas++;
      continue;
    }

    const dbCols = res.rows.map((r) => r.column_name);
    const faltanEnDb = schemaCols.filter((c) => !dbCols.includes(c));
    const sobranEnDb = dbCols.filter((c) => !schemaCols.includes(c));

    if (faltanEnDb.length || sobranEnDb.length) {
      problemas++;
      console.log(`⚠️  ${tableName} (export: ${key})`);
      if (faltanEnDb.length) console.log(`     en el schema y NO en la BD: ${faltanEnDb.join(", ")}`);
      if (sobranEnDb.length) console.log(`     en la BD y NO en el schema: ${sobranEnDb.join(", ")}`);
    } else {
      console.log(`✓  ${tableName} (${schemaCols.length} columnas)`);
    }
  }

  console.log(`\n${problemas === 0 ? "✅ Todas las tablas y columnas coinciden" : `${problemas} tablas con diferencias`}`);
  await pool.end();
  process.exit(problemas === 0 ? 0 : 1);
}

main().catch((e) => {
  console.error("Error:", e.message);
  process.exit(2);
});
