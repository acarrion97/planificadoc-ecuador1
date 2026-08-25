-- Migration: add imported_format_documents table
-- Importación de formatos: el docente sube un .doc/.docx/.pdf oficial MinEduc,
-- el sistema reconoce el tipo de planificación y completa sus campos con IA.
-- Backup best-effort en la nube, mismo patrón que curricular_adaptations.

CREATE TABLE `imported_format_documents` (
  `id`               INT           NOT NULL AUTO_INCREMENT,
  `sessionId`        VARCHAR(320)  NOT NULL,
  `fileName`         VARCHAR(255)  NOT NULL,
  `mimeType`         VARCHAR(128)  NOT NULL,
  `storageKey`       VARCHAR(512),
  `tipoDetectado`    VARCHAR(32),
  `camposExtraidos`  TEXT,
  `resultado`        TEXT,
  `planificacionId`  INT,
  `status`           ENUM('subido','analizando','completado','error') NOT NULL DEFAULT 'subido',
  `errorMensaje`     TEXT,
  `createdAt`        TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt`        TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_imported_session` (`sessionId`),
  INDEX `idx_imported_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
