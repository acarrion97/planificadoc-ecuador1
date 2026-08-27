-- Migration: 0011_bt_curriculum
-- Bachillerato Técnico — Catálogo Curricular (Acuerdo 00065-A)
-- 10 tablas: áreas, familias, figuras, módulos, contenidos, RA, CE, distribución por año, planificaciones, distribución trimestral

CREATE TABLE `bt_areas_tecnicas` (
  `id`          INT           NOT NULL AUTO_INCREMENT,
  `nombre`      VARCHAR(128)  NOT NULL,
  `descripcion` TEXT,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `bt_familias_profesionales` (
  `id`          INT           NOT NULL AUTO_INCREMENT,
  `areaId`      INT           NOT NULL,
  `nombre`      VARCHAR(128)  NOT NULL,
  `codigo`      VARCHAR(64)   NOT NULL,
  `descripcion` TEXT,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `idx_familia_codigo` (`codigo`),
  INDEX `idx_familia_area` (`areaId`),
  FOREIGN KEY (`areaId`) REFERENCES `bt_areas_tecnicas`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `bt_figuras_profesionales` (
  `id`                    INT           NOT NULL AUTO_INCREMENT,
  `familiaId`             INT           NOT NULL,
  `nombre`                VARCHAR(200)  NOT NULL,
  `codigo`                VARCHAR(64)   NOT NULL,
  `perfilProfesional`     TEXT,
  `activa`                BOOLEAN       NOT NULL DEFAULT TRUE,
  `figuraReemplazoId`     INT,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `idx_figura_codigo` (`codigo`),
  INDEX `idx_figura_familia` (`familiaId`),
  FOREIGN KEY (`familiaId`) REFERENCES `bt_familias_profesionales`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  FOREIGN KEY (`figuraReemplazoId`) REFERENCES `bt_figuras_profesionales`(`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `bt_modulos_formativos` (
  `id`        INT           NOT NULL AUTO_INCREMENT,
  `figuraId`  INT           NOT NULL,
  `nombre`    VARCHAR(200)  NOT NULL,
  `codigo`    VARCHAR(64),
  `tipo`      ENUM('generico', 'especializacion') NOT NULL DEFAULT 'especializacion',
  PRIMARY KEY (`id`),
  INDEX `idx_modulo_figura` (`figuraId`),
  FOREIGN KEY (`figuraId`) REFERENCES `bt_figuras_profesionales`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `bt_contenidos` (
  `id`          INT           NOT NULL AUTO_INCREMENT,
  `moduloId`    INT           NOT NULL,
  `tipo`        ENUM('conceptual', 'procedimental', 'actitudinal') NOT NULL,
  `descripcion` TEXT          NOT NULL,
  `orden`       INT           NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  INDEX `idx_contenido_modulo` (`moduloId`),
  FOREIGN KEY (`moduloId`) REFERENCES `bt_modulos_formativos`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `bt_resultados_aprendizaje` (
  `id`          INT           NOT NULL AUTO_INCREMENT,
  `moduloId`    INT           NOT NULL,
  `codigo`      VARCHAR(32)   NOT NULL,
  `descripcion` TEXT          NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `idx_ra_modulo` (`moduloId`),
  FOREIGN KEY (`moduloId`) REFERENCES `bt_modulos_formativos`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `bt_criterios_evaluacion` (
  `id`          INT           NOT NULL AUTO_INCREMENT,
  `raId`        INT           NOT NULL,
  `codigo`      VARCHAR(32)   NOT NULL,
  `descripcion` TEXT          NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `idx_ce_ra` (`raId`),
  FOREIGN KEY (`raId`) REFERENCES `bt_resultados_aprendizaje`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `bt_modulo_por_anio` (
  `id`                     INT           NOT NULL AUTO_INCREMENT,
  `moduloId`               INT           NOT NULL,
  `anioBGU`                INT           NOT NULL,
  `cargaHorariaSemanal`    INT           NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `idx_moduloanio_modulo` (`moduloId`),
  INDEX `idx_moduloanio_anio` (`anioBGU`),
  FOREIGN KEY (`moduloId`) REFERENCES `bt_modulos_formativos`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `bt_planificaciones` (
  `id`          INT           NOT NULL AUTO_INCREMENT,
  `sessionId`   VARCHAR(128)  NOT NULL,
  `figuraId`    INT           NOT NULL,
  `anioBGU`     INT           NOT NULL,
  `anioLectivo` VARCHAR(16)   NOT NULL,
  `nombre`      VARCHAR(200)  NOT NULL,
  `createdAt`   TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt`   TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_planificacion_session` (`sessionId`),
  INDEX `idx_planificacion_figura` (`figuraId`),
  FOREIGN KEY (`figuraId`) REFERENCES `bt_figuras_profesionales`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `bt_distribucion_trimestre` (
  `id`               INT           NOT NULL AUTO_INCREMENT,
  `planificacionId`  INT           NOT NULL,
  `trimestre`        INT           NOT NULL,
  `contenidoId`      INT,
  `raId`             INT,
  PRIMARY KEY (`id`),
  INDEX `idx_distribucion_planificacion` (`planificacionId`),
  INDEX `idx_distribucion_contenido` (`contenidoId`),
  INDEX `idx_distribucion_ra` (`raId`),
  FOREIGN KEY (`planificacionId`) REFERENCES `bt_planificaciones`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  FOREIGN KEY (`contenidoId`) REFERENCES `bt_contenidos`(`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  FOREIGN KEY (`raId`) REFERENCES `bt_resultados_aprendizaje`(`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
