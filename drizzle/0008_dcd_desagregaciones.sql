-- Migration: add dcd_desagregaciones table
-- Desagregación/gradación de DCD por grado (recurso curricular derivado).
-- Backup best-effort en la nube, mismo patrón que curricular_adaptations:
-- la fuente de verdad es la selección en la planificación.
-- Una fila por (sessionId, codigoDCD, grado): la UNIQUE habilita la reutilización.

CREATE TABLE `dcd_desagregaciones` (
  `id`                  INT           NOT NULL AUTO_INCREMENT,
  `sessionId`           VARCHAR(320)  NOT NULL,
  `codigoDCD`           VARCHAR(64)   NOT NULL,
  `subnivel`            INT           NOT NULL,
  `grado`               INT           NOT NULL,
  `gradoMaximo`         INT           NOT NULL,
  `descripcionDCD`      TEXT          NOT NULL,
  `indicadorOriginal`   TEXT          NOT NULL,
  `dcdGraduada`         TEXT          NOT NULL,
  `indicadorGraduado`   TEXT          NOT NULL,
  `procesoCognitivo`    VARCHAR(128),
  `estado`              ENUM('generado','editado','aprobado') NOT NULL DEFAULT 'generado',
  `version`             INT           NOT NULL DEFAULT 1,
  `aiResult`            TEXT,
  `createdAt`           TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt`           TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_dcd_session_grado` (`sessionId`, `codigoDCD`, `grado`),
  INDEX `idx_dcd_session` (`sessionId`),
  INDEX `idx_dcd_codigo` (`codigoDCD`),
  INDEX `idx_dcd_created` (`createdAt`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;