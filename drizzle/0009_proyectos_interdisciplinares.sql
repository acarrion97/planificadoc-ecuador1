-- Migration: add proyectos_interdisciplinares table
-- Módulo independiente "Proyecto Interdisciplinar" (ver openspec/changes/proyecto-interdisciplinar).
-- Mismo patrón híbrido que curriculo_competencias_planificaciones:
-- columnas indexadas para listar/buscar + `form_data` (JSON) como fuente de verdad.

CREATE TABLE `proyectos_interdisciplinares` (
  `id`                    INT           NOT NULL AUTO_INCREMENT,
  `session_id`            VARCHAR(64)   NOT NULL,
  `base_curricular`       ENUM('destrezas','competencias') NOT NULL,
  `titulo`                VARCHAR(256)  NOT NULL,
  `nivel_principal`       VARCHAR(32),
  `subnivel_principal`    VARCHAR(32),
  `institucion`           VARCHAR(128),
  `estado`                ENUM('borrador','generado') NOT NULL DEFAULT 'borrador',
  `form_data`             TEXT          NOT NULL,
  `created_at`            TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`            TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_proyecto_interdisciplinar_session` (`session_id`),
  INDEX `idx_proyecto_interdisciplinar_estado` (`estado`),
  INDEX `idx_proyecto_interdisciplinar_updated` (`updated_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
