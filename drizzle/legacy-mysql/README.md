# Migraciones MySQL/TiDB (legado)

Estos archivos eran las migraciones de `drizzle-kit` contra la base **MySQL/TiDB**
que el proyecto usaba antes de la migración a **PostgreSQL/Supabase**
(rama `feature/supabase-db`).

Quedan aquí solo como referencia histórica:

- El journal (`meta/_journal.json`) está en dialecto `mysql` y solo cubre hasta
  `0003`; los `0004`–`0010` eran archivos sueltos escritos a mano.
- `drizzle.config.ts` ya está en `dialect: "postgresql"`, así que
  `drizzle-kit generate`/`migrate` **no** deben leer esta carpeta (por eso no
  está en la raíz de `drizzle/`).

**La fuente de verdad del esquema hoy es `supabase/migrations/*.sql`** y se
aplica con `pnpm db:push` (`scripts/db-push.ts`).

Para contrastar `drizzle/schema.ts` con la base real:
`npx tsx scripts/compare-schema.ts`.
