-- Migration: add evaluaciones_diagnosticas table
-- Backup best-effort of diagnostic assessments (source of truth: AsyncStorage)
-- Same pattern as connecta_nivela_crea / curricular_adaptations: JSON blobs

CREATE TABLE `evaluaciones_diagnosticas` (
  `id`         INT          NOT NULL AUTO_INCREMENT,
  `sessionId`  VARCHAR(320) NOT NULL,
  `status`     ENUM('borrador','publicada','aplicada','analizada') NOT NULL DEFAULT 'borrador',
  `form`       TEXT,
  `aiResult`   TEXT,
  `createdAt`  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt`  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_ev_session` (`sessionId`),
  INDEX `idx_ev_created` (`createdAt`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;