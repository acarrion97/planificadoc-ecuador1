-- Migration: add formato_plantillas table + formatoPlantillaId to pca_documents
-- Plantillas de exportación derivadas de formatos importados.
-- El archivo original se conserva como fuente de fidelidad y la información
-- extraída sirve para saber dónde y cómo rellenarlo al exportar.

CREATE TABLE `formato_plantillas` (
  `id`                 INT           NOT NULL AUTO_INCREMENT,
  `sessionId`          VARCHAR(320)  NOT NULL,
  `nombre`             VARCHAR(255)  NOT NULL,
  `tipoPlanificacion`  VARCHAR(32)   NOT NULL,
  `formatoOrigen`      VARCHAR(16)   NOT NULL,
  `mimeType`           VARCHAR(128)  NOT NULL,
  `storageKey`         VARCHAR(512)  NOT NULL,
  `templateBufferBase64` TEXT,
  `version`            INT           NOT NULL DEFAULT 1,
  `estructura`         TEXT          NOT NULL,
  `bindings`           TEXT          NOT NULL,
  `configuracion`      TEXT,
  `activo`             BOOLEAN       NOT NULL DEFAULT TRUE,
  `createdAt`          TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt`          TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_plantilla_session` (`sessionId`),
  INDEX `idx_plantilla_tipo` (`tipoPlanificacion`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

ALTER TABLE `pca_documents`
  ADD COLUMN `formatoPlantillaId` INT AFTER `amountPaid`;
