import type { VercelRequest, VercelResponse } from "@vercel/node";
import mysql from "mysql2/promise";

const ADMIN_KEY = process.env.ADMIN_KEY || process.env.ADMIN_SECRET;

const MIGRATIONS = [
  {
    name: "0010_add_formato_plantillas",
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
      // Check if column exists before adding
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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const authHeader = req.headers.authorization;
  const adminKey = req.query.key || req.body?.key;
  if (adminKey !== ADMIN_KEY && authHeader !== `Bearer ${ADMIN_KEY}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const url = process.env.DATABASE_URL;
  if (!url) {
    return res.status(500).json({ error: "DATABASE_URL not set" });
  }

  const conn = await mysql.createConnection(url);
  const results: any[] = [];

  try {
    for (const migration of MIGRATIONS) {
      for (const sql of migration.sql) {
        const [row] = await conn.execute(sql);
        results.push({ migration: migration.name, result: row });
      }
    }

    return res.status(200).json({ success: true, results });
  } catch (err: any) {
    return res.status(500).json({ error: err.message, results });
  } finally {
    await conn.end();
  }
}
