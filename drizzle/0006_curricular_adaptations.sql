-- Migration: add curricular_adaptations table
-- Privacy-first: stores anonymous student codes only, no real names required

CREATE TABLE `curricular_adaptations` (
  `id`                 INT          NOT NULL AUTO_INCREMENT,
  `sessionId`          VARCHAR(320) NOT NULL,
  `codigoEstudiante`   VARCHAR(64),
  `institucion`        VARCHAR(255),
  `docente`            VARCHAR(255),
  `anioLectivo`        VARCHAR(20),
  `area`               VARCHAR(20)  NOT NULL,
  `subnivel`           INT,
  `grado`              VARCHAR(64)  NOT NULL,
  `paralelo`           VARCHAR(20),
  `periodoPedagogico`  VARCHAR(64),
  `trimestre`          VARCHAR(20),
  `codigoDestreza`     VARCHAR(64),
  `descripcionDestreza` TEXT,
  `gradoAdaptacion`    ENUM('1','2','3') NOT NULL,
  `tipoNEE`            VARCHAR(64)  NOT NULL,
  `estiloAprendizaje`  VARCHAR(64),
  `fortalezas`         TEXT,
  `desafios`           TEXT,
  `apoyosDisponibles`  TEXT,
  `aiResult`           TEXT,
  `version`            INT          NOT NULL DEFAULT 1,
  `status`             ENUM('draft','generated') NOT NULL DEFAULT 'draft',
  `createdAt`          TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt`          TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_ca_session` (`sessionId`),
  INDEX `idx_ca_created` (`createdAt`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
