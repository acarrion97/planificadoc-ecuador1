import mysql from "mysql2/promise";

/**
 * Migrador automático para Vercel.
 * Ejecuta en el primer request si la BD no tiene las migraciones aplicadas.
 * Usa __drizzle_migrations para trackear estado.
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
      `SET @dbname = DATABASE();
       SELECT COUNT(*) INTO @col_exists
       FROM information_schema.columns
       WHERE table_schema = @dbname
         AND table_name = 'pca_documents'
         AND column_name = 'formatoPlantillaId';`,
      `SET @sql = IF(@col_exists = 0,
        'ALTER TABLE \`pca_documents\` ADD COLUMN \`formatoPlantillaId\` INT AFTER \`amountPaid\`',
        'SELECT "column already exists"');
       PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;`,
    ],
  },
];

let _migrated = false;

export async function ensureMigrations(): Promise<void> {
  if (_migrated) return;

  const url = process.env.DATABASE_URL;
  if (!url) return;

  const conn = await mysql.createConnection(url);

  try {
    // Crear tabla de tracking si no existe
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS \`__drizzle_migrations\` (
        \`id\`          INT           NOT NULL AUTO_INCREMENT,
        \`tag\`         VARCHAR(255)  NOT NULL,
        \`applied_at\`  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`),
        UNIQUE INDEX \`idx_migration_tag\` (\`tag\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Obtener migraciones ya aplicadas
    const [applied] = await conn.execute(`SELECT tag FROM __drizzle_migrations`);
    const appliedTags = new Set((applied as any[]).map((r) => r.tag));

    // Aplicar pendientes
    for (const migration of MIGRATIONS) {
      if (appliedTags.has(migration.tag)) continue;

      console.log(`[migration] Applying: ${migration.tag}`);
      for (const sql of migration.sql) {
        await conn.execute(sql);
      }

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
