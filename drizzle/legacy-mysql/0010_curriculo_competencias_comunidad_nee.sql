-- Migration: switches "¿Compartir con la comunidad?" y "¿Hay estudiantes con NEE?"
-- en curriculo_competencias_planificaciones.
--  - `compartida`: el plan se publica (anonimizado) en la biblioteca "Comunidad"
--    de Currículo por competencias, donde otros docentes pueden duplicarlo.
--  - `hay_nee`: el paralelo tiene estudiantes con NEE; se ofrece crear
--    adaptaciones curriculares a partir del plan.
-- El router también agrega estas columnas en tiempo de ejecución si faltan
-- (ensureCurriculoCompetenciasTable), así que esta migración es idempotente
-- en la práctica: si la columna ya existe, MySQL responde "Duplicate column".

ALTER TABLE `curriculo_competencias_planificaciones`
  ADD COLUMN `hay_nee`    BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN `compartida` BOOLEAN NOT NULL DEFAULT FALSE;

-- Listado "Comunidad": planes compartidos, más recientes primero.
CREATE INDEX `idx_ccp_compartida_created`
  ON `curriculo_competencias_planificaciones` (`compartida`, `created_at`);
