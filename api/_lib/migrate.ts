import mysql from "mysql2/promise";
import { seedBtCatalogo, seedBtCurriculum } from "./seed-bt";

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
        \`templateBufferBase64\` LONGTEXT,
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
  {
    tag: "0011_bt_curriculum",
    sql: [
      `CREATE TABLE IF NOT EXISTS \`bt_areas_tecnicas\` (
        \`id\`          INT           NOT NULL AUTO_INCREMENT,
        \`nombre\`      VARCHAR(128)  NOT NULL,
        \`descripcion\` TEXT,
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,
      `CREATE TABLE IF NOT EXISTS \`bt_familias_profesionales\` (
        \`id\`          INT           NOT NULL AUTO_INCREMENT,
        \`areaId\`      INT           NOT NULL,
        \`nombre\`      VARCHAR(128)  NOT NULL,
        \`codigo\`      VARCHAR(64)   NOT NULL,
        \`descripcion\` TEXT,
        PRIMARY KEY (\`id\`),
        UNIQUE INDEX \`idx_familia_codigo\` (\`codigo\`),
        INDEX \`idx_familia_area\` (\`areaId\`),
        FOREIGN KEY (\`areaId\`) REFERENCES \`bt_areas_tecnicas\`(\`id\`) ON DELETE RESTRICT ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,
      `CREATE TABLE IF NOT EXISTS \`bt_figuras_profesionales\` (
        \`id\`                    INT           NOT NULL AUTO_INCREMENT,
        \`familiaId\`             INT           NOT NULL,
        \`nombre\`                VARCHAR(200)  NOT NULL,
        \`codigo\`                VARCHAR(64)   NOT NULL,
        \`perfilProfesional\`     TEXT,
        \`activa\`                BOOLEAN       NOT NULL DEFAULT TRUE,
        \`figuraReemplazoId\`     INT,
        PRIMARY KEY (\`id\`),
        UNIQUE INDEX \`idx_figura_codigo\` (\`codigo\`),
        INDEX \`idx_figura_familia\` (\`familiaId\`),
        FOREIGN KEY (\`familiaId\`) REFERENCES \`bt_familias_profesionales\`(\`id\`) ON DELETE RESTRICT ON UPDATE CASCADE,
        FOREIGN KEY (\`figuraReemplazoId\`) REFERENCES \`bt_figuras_profesionales\`(\`id\`) ON DELETE SET NULL ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,
      `CREATE TABLE IF NOT EXISTS \`bt_modulos_formativos\` (
        \`id\`        INT           NOT NULL AUTO_INCREMENT,
        \`figuraId\`  INT           NOT NULL,
        \`nombre\`    VARCHAR(200)  NOT NULL,
        \`codigo\`    VARCHAR(64),
        \`tipo\`      ENUM('generico', 'especializacion') NOT NULL DEFAULT 'especializacion',
        PRIMARY KEY (\`id\`),
        INDEX \`idx_modulo_figura\` (\`figuraId\`),
        FOREIGN KEY (\`figuraId\`) REFERENCES \`bt_figuras_profesionales\`(\`id\`) ON DELETE RESTRICT ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,
      `CREATE TABLE IF NOT EXISTS \`bt_contenidos\` (
        \`id\`          INT           NOT NULL AUTO_INCREMENT,
        \`moduloId\`    INT           NOT NULL,
        \`tipo\`        ENUM('conceptual', 'procedimental', 'actitudinal') NOT NULL,
        \`descripcion\` TEXT          NOT NULL,
        \`orden\`       INT           NOT NULL DEFAULT 0,
        PRIMARY KEY (\`id\`),
        INDEX \`idx_contenido_modulo\` (\`moduloId\`),
        FOREIGN KEY (\`moduloId\`) REFERENCES \`bt_modulos_formativos\`(\`id\`) ON DELETE RESTRICT ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,
      `CREATE TABLE IF NOT EXISTS \`bt_resultados_aprendizaje\` (
        \`id\`          INT           NOT NULL AUTO_INCREMENT,
        \`moduloId\`    INT           NOT NULL,
        \`codigo\`      VARCHAR(32)   NOT NULL,
        \`descripcion\` TEXT          NOT NULL,
        PRIMARY KEY (\`id\`),
        INDEX \`idx_ra_modulo\` (\`moduloId\`),
        FOREIGN KEY (\`moduloId\`) REFERENCES \`bt_modulos_formativos\`(\`id\`) ON DELETE RESTRICT ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,
      `CREATE TABLE IF NOT EXISTS \`bt_criterios_evaluacion\` (
        \`id\`          INT           NOT NULL AUTO_INCREMENT,
        \`raId\`        INT           NOT NULL,
        \`codigo\`      VARCHAR(32)   NOT NULL,
        \`descripcion\` TEXT          NOT NULL,
        PRIMARY KEY (\`id\`),
        INDEX \`idx_ce_ra\` (\`raId\`),
        FOREIGN KEY (\`raId\`) REFERENCES \`bt_resultados_aprendizaje\`(\`id\`) ON DELETE RESTRICT ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,
      `CREATE TABLE IF NOT EXISTS \`bt_modulo_por_anio\` (
        \`id\`                     INT           NOT NULL AUTO_INCREMENT,
        \`moduloId\`               INT           NOT NULL,
        \`anioBGU\`                INT           NOT NULL,
        \`cargaHorariaSemanal\`    INT           NOT NULL,
        PRIMARY KEY (\`id\`),
        INDEX \`idx_moduloanio_modulo\` (\`moduloId\`),
        INDEX \`idx_moduloanio_anio\` (\`anioBGU\`),
        FOREIGN KEY (\`moduloId\`) REFERENCES \`bt_modulos_formativos\`(\`id\`) ON DELETE RESTRICT ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,
      `CREATE TABLE IF NOT EXISTS \`bt_planificaciones\` (
        \`id\`          INT           NOT NULL AUTO_INCREMENT,
        \`sessionId\`   VARCHAR(128)  NOT NULL,
        \`figuraId\`    INT           NOT NULL,
        \`anioBGU\`     INT           NOT NULL,
        \`anioLectivo\` VARCHAR(16)   NOT NULL,
        \`nombre\`      VARCHAR(200)  NOT NULL,
        \`createdAt\`   TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updatedAt\`   TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`),
        INDEX \`idx_planificacion_session\` (\`sessionId\`),
        INDEX \`idx_planificacion_figura\` (\`figuraId\`),
        FOREIGN KEY (\`figuraId\`) REFERENCES \`bt_figuras_profesionales\`(\`id\`) ON DELETE RESTRICT ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,
      `CREATE TABLE IF NOT EXISTS \`bt_distribucion_trimestre\` (
        \`id\`               INT           NOT NULL AUTO_INCREMENT,
        \`planificacionId\`  INT           NOT NULL,
        \`trimestre\`        INT           NOT NULL,
        \`contenidoId\`      INT,
        \`raId\`             INT,
        PRIMARY KEY (\`id\`),
        INDEX \`idx_distribucion_planificacion\` (\`planificacionId\`),
        INDEX \`idx_distribucion_contenido\` (\`contenidoId\`),
        INDEX \`idx_distribucion_ra\` (\`raId\`),
        FOREIGN KEY (\`planificacionId\`) REFERENCES \`bt_planificaciones\`(\`id\`) ON DELETE RESTRICT ON UPDATE CASCADE,
        FOREIGN KEY (\`contenidoId\`) REFERENCES \`bt_contenidos\`(\`id\`) ON DELETE SET NULL ON UPDATE CASCADE,
        FOREIGN KEY (\`raId\`) REFERENCES \`bt_resultados_aprendizaje\`(\`id\`) ON DELETE SET NULL ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,
    ],
    columns: [],
  },
  {
    tag: "0011_fix_template_buffer_longtext",
    sql: [
      `ALTER TABLE \`formato_plantillas\` MODIFY COLUMN \`templateBufferBase64\` LONGTEXT`,
    ],
    columns: [],
  },
  {
    tag: "0012_bt_curriculum_extensions",
    sql: [],
    columns: [
      {
        table: "bt_modulos_formativos",
        column: "nivel",
        definition: "ADD COLUMN \`nivel\` VARCHAR(64) AFTER \`tipo\`",
      },
      {
        table: "bt_modulos_formativos",
        column: "duracionTotalPeriodos",
        definition: "ADD COLUMN \`duracionTotalPeriodos\` INT AFTER \`nivel\`",
      },
      {
        table: "bt_modulos_formativos",
        column: "unidadCompetencia",
        definition: "ADD COLUMN \`unidadCompetencia\` TEXT AFTER \`duracionTotalPeriodos\`",
      },
      {
        table: "bt_modulos_formativos",
        column: "objetivoModulo",
        definition: "ADD COLUMN \`objetivoModulo\` TEXT AFTER \`unidadCompetencia\`",
      },
      {
        table: "bt_modulos_formativos",
        column: "perfilDocente",
        definition: "ADD COLUMN \`perfilDocente\` TEXT AFTER \`objetivoModulo\`",
      },
      {
        table: "bt_modulos_formativos",
        column: "orientacionesMetodologicas",
        definition: "ADD COLUMN \`orientacionesMetodologicas\` TEXT AFTER \`perfilDocente\`",
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

    // Seed del catálogo BT después de la migración estructural
    if (appliedTags.has("0011_bt_curriculum")) {
      // Migración ya aplicada, verificar si el seed ya corrió
      const [seedCheck] = await conn.query(
        `SELECT COUNT(*) AS cnt FROM bt_areas_tecnicas`
      );
      if ((seedCheck as any[])[0].cnt === 0) {
        console.log("[migration] Running BT catalog seed...");
        const result = await seedBtCatalogo(conn);
        console.log(`[migration] BT seed complete:`, result);
      }

      // Seed del currículo BT
      const [curriculumCheck] = await conn.query(
        `SELECT COUNT(*) AS cnt FROM bt_modulos_formativos`
      );
      if ((curriculumCheck as any[])[0].cnt === 0) {
        console.log("[migration] Running BT curriculum seed...");
        const curriculumResult = await seedBtCurriculum(conn);
        console.log(`[migration] BT curriculum seed complete:`, curriculumResult);
      }
    }

    _migrated = true;
  } catch (err: any) {
    console.error("[migration] Error:", err.message);
  } finally {
    await conn.end();
  }
}
