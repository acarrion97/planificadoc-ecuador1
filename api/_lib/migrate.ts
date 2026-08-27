import mysql from "mysql2/promise";

/**
 * Migrador automático para Vercel (compatible con TiDB).
 * Ejecuta en el primer request. Cada SQL es un statement separado.
 */
const MIGRATIONS = [
  {
    tag: "0010_formato_plantillas",
    sql: [
      `CREATE TABLE IF NOT EXISTS \`formato_plantillas\` (
        \`id\`                 INT           NOT NULL AUTO_INCREMENT,
        \`sessionId\`          VARCHAR(320)  NOT NULL,
        \`nombre\`             VARCHAR(255)  NOT NULL,
        \`tipoPlanificacion\`  VARCHAR(32)   NOT NULL,
        \`formatoOrigen\`      VARCHAR(16)   NOT NULL,
        \`mimeType\`           VARCHAR(128)  NOT NULL,
        \`storageKey\`         VARCHAR(512)  NOT NULL,
        \`templateBufferBase64\` TEXT,
        \`version\`            INT           NOT NULL DEFAULT 1,
        \`estructura\`         TEXT          NOT NULL,
        \`bindings\`           TEXT          NOT NULL,
        \`configuracion\`      TEXT,
        \`activo\`             BOOLEAN       NOT NULL DEFAULT TRUE,
        \`createdAt\`          TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updatedAt\`          TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`),
        INDEX \`idx_plantilla_session\` (\`sessionId\`),
        INDEX \`idx_plantilla_tipo\` (\`tipoPlanificacion\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,
    ],
    // Columnas que agregar si no existen (cada una es un statement)
    columns: [
      {
        table: "pca_documents",
        column: "formatoPlantillaId",
        definition: "ADD COLUMN `formatoPlantillaId` INT AFTER `amountPaid`",
      },
    ],
  },
];

let _migrated = false;

async function columnExists(
  conn: mysql.Connection,
  table: string,
  column: string
): Promise<boolean> {
  const [rows] = await conn.query(
    `SELECT COUNT(*) AS cnt FROM information_schema.columns
     WHERE table_schema = DATABASE()
       AND table_name = ?
       AND column_name = ?`,
    [table, column]
  );
  return (rows as any[])[0].cnt > 0;
}

export async function ensureMigrations(): Promise<void> {
  if (_migrated) return;

  const url = process.env.DATABASE_URL;
  if (!url) return;

  const conn = await mysql.createConnection(url);

  try {
    // Crear tabla de tracking
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS __drizzle_migrations (
        id          INT           NOT NULL AUTO_INCREMENT,
        tag         VARCHAR(255)  NOT NULL,
        applied_at  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        UNIQUE INDEX idx_migration_tag (tag)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Obtener migraciones ya aplicadas
    const [applied] = await conn.execute(`SELECT tag FROM __drizzle_migrations`);
    const appliedTags = new Set((applied as any[]).map((r) => r.tag));

    // Aplicar pendientes
    for (const migration of MIGRATIONS) {
      if (appliedTags.has(migration.tag)) continue;

      console.log(`[migration] Applying: ${migration.tag}`);

      // Ejecutar CREATE TABLEs
      for (const sql of migration.sql) {
        await conn.execute(sql);
      }

      // Agregar columnas faltantes (una por una, compatible con TiDB)
      if (migration.columns) {
        for (const col of migration.columns) {
          const exists = await columnExists(conn, col.table, col.column);
          if (!exists) {
            console.log(`[migration] Adding column: ${col.table}.${col.column}`);
            await conn.execute(
              `ALTER TABLE \`${col.table}\` ${col.definition}`
            );
          }
        }
      }

      // Registrar migración aplicada
      await conn.execute(
        `INSERT INTO __drizzle_migrations (tag) VALUES (?)`,
        [migration.tag]
      );
      console.log(`[migration] Applied: ${migration.tag}`);
    }

    _migrated = true;
  } catch (err: any) {
    console.error("[migration] Error:", err.message);
  } finally {
    await conn.end();
  }
}
