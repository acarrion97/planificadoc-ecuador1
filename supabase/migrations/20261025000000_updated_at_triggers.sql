-- =============================================================================
-- Planificadoc — triggers `set_updated_at()` faltantes
--
-- Estas dos tablas declaran `updated_at` en `drizzle/schema.ts` pero la
-- migración inicial no les creó el trigger (replican el `ON UPDATE
-- CURRENT_TIMESTAMP` de MySQL). Sin él, `updated_at` se queda congelado en el
-- valor del INSERT aunque los routers escriban la columna a mano.
--
-- Aplicar con: pnpm db:push   (scripts/db-push.ts)
-- =============================================================================

create trigger trg_curriculo_competencias_planificaciones_updated_at
  before update on public.curriculo_competencias_planificaciones
  for each row execute function public.set_updated_at();

create trigger trg_proyectos_interdisciplinares_updated_at
  before update on public.proyectos_interdisciplinares
  for each row execute function public.set_updated_at();
