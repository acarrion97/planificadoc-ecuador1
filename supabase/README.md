# Supabase — base de datos de Planificadoc

Rama: `feature/supabase-db`

Este directorio contiene el esquema inicial (PostgreSQL) para levantar la base
de datos en [Supabase](https://supabase.com), traducido desde el esquema actual
de Drizzle/MySQL (`drizzle/schema.ts`).

## Archivos

| Archivo | Contenido |
| --- | --- |
| `migrations/20261024000000_init_schema.sql` | Esquema completo: 17 tablas, índices, constraints `CHECK` y triggers `set_updated_at()` |
| `migrations/20261024000001_row_level_security.sql` | Row Level Security: helpers de claims JWT, políticas por usuario, privilegios por columna y acceso `service_role` |
| `migrations/20261025000000_updated_at_triggers.sql` | Triggers `set_updated_at()` que faltaban en `curriculo_competencias_planificaciones` y `proyectos_interdisciplinares` |

El esquema vivo se contrasta con `drizzle/schema.ts` vía
`npx tsx scripts/compare-schema.ts`. Las migraciones MySQL/TiDB antiguas
quedaron archivadas en `drizzle/legacy-mysql/` (el journal está en dialecto
`mysql` y `drizzle.config.ts` ya es `postgresql`, así que no se leen).

## Row Level Security

Modelo de acceso definido en `20261024000001_row_level_security.sql`:

| Rol | Acceso |
| --- | --- |
| `postgres` (connection string del backend) | Total — es el dueño de las tablas, bypasea el RLS. Todo el código actual sigue funcionando sin cambios. |
| `service_role` | Total — por política explícita (`service_role_all_*`), sin depender del atributo `BYPASSRLS`. |
| `authenticated` (cliente vía PostgREST/supabase-js) | Solo **filas propias**, identificadas por los claims `email` / `sub` del JWT. |
| `anon` | Sin ningún privilegio sobre las tablas. |

Detalle del rol `authenticated`:

- **Lectura propia**: `users`, `subscriptions`, `payment_transactions`, `docente_contacts`, `planificacion_stats`, y sus 7 tablas de documentos.
- **Lectura + escritura propia**: `pca_documents`, `curriculo_competencias_planificaciones`, `curricular_adaptations`, `dcd_desagregaciones`, `connecta_nivela_crea`, `evaluaciones_diagnosticas`, `proyectos_interdisciplinares`.
- **Escritura restringida por COLUMNA**: en `pca_documents` y `curriculo_competencias_planificaciones` el cliente **no puede** escribir `status`, `amountPaid` ni los IDs de PayPhone ⇒ no puede auto-desbloquear contenido de pago.
- **Sin acceso**: `card_tokens`, `docente_accounts`, `password_reset_codes`, `code_activations`, `payment_attribution` (credenciales, hashes y telemetría: solo backend).

> Los helpers leen `request.jwt.claim.*` / `request.jwt.claims` directamente (el mismo mecanismo de `auth.jwt()`), para no depender de que `authenticated` tenga `USAGE` sobre el esquema `auth`.

**Requisito**: las políticas solo filtran algo cuando hay un JWT; eso exige autenticar con **Supabase Auth**. Mientras la app use su propio login (`docente_accounts` / OAuth propio), el rol `authenticated` no tendrá claims y todo le quedará denegado — es lo esperado, no un fallo.

## Cómo aplicarla

### Opción A — `pnpm db:push` (recomendada)

```bash
pnpm db:push             # aplica supabase/migrations/*.sql pendientes
npx tsx scripts/db-push.ts --dry-run   # solo lista qué aplicaría
```

`scripts/db-push.ts` aplica los `.sql` en orden y lleva la cuenta en la tabla
`public.schema_migrations`, así que es idempotente (contra una base ya
inicializada solo marca lo existente y aplica lo nuevo).

### Opción B — Supabase CLI

```bash
# 1. Instalar la CLI
npm i -g supabase

# 2. Inicializar (solo la primera vez; no sobreescribe este directorio)
supabase init

# 3. Crear el proyecto y vincularlo
supabase login
supabase link --project-ref <PROJECT_REF>

# 4. Empujar las migraciones
supabase db push
```

### Opción C — SQL directo en el editor de Supabase

Copiar el contenido de `migrations/20261024000000_init_schema.sql` y pegarlo en
**SQL Editor → Run**.

### Opción D — psql

```bash
for f in supabase/migrations/*.sql; do
  psql "$SUPABASE_DB_URL" -v ON_ERROR_STOP=1 -f "$f"
done
```

## Variables de entorno

```dotenv
# Cadena de conexión Postgres de Supabase (Settings → Database → Connection string → URI)
SUPABASE_DB_URL=postgresql://postgres.<PROJECT>:<PASSWORD>@aws-0.<REGION>.pooler.supabase.com:5432/postgres
```

> `SUPABASE_DB_URL` tiene **prioridad** sobre `DATABASE_URL` en
> `api/_lib/db.ts`, `server/db.ts`, `server/_core/env.ts` y `drizzle.config.ts`:
> `DATABASE_URL` queda como respaldo y puede seguir apuntando a la base
> antigua sin que eso afecte. El SSL se normaliza en `shared/pg-ssl.ts`
> (`sslmode` quitado + `rejectUnauthorized: false`), porque Supabase firma con
> una CA propia que Node no trae.

## Estado de la migración de runtime

Hecho en esta rama:

- `drizzle/schema.ts` con `drizzle-orm/pg-core`, driver `drizzle-orm/node-postgres`
  + `pg` (paquete `mysql2` fuera de dependencias).
- `drizzle.config.ts` en `dialect: "postgresql"`.
- `db:push` aplica este directorio (`scripts/db-push.ts`, idempotente).
- Migraciones MySQL archivadas en `drizzle/legacy-mysql/`.
- Triggers `set_updated_at()` de las 17 tablas completos
  (`20261025000000_updated_at_triggers.sql`).

## Pendiente

- Migrar el login a **Supabase Auth**: hasta entonces las políticas RLS no
  filtran nada por claim y todo lo que no sea el backend queda denegado.
- Revisar que el backend use el connection string (`postgres`) o la
  `service_role` key, nunca la `anon` key.

## Decisiones de traducción MySQL → PostgreSQL

- `INT AUTO_INCREMENT` → `integer GENERATED BY DEFAULT AS IDENTITY`.
- `ENUM(...)` → `text` + `CONSTRAINT ... CHECK`, para mantener compatibilidad
  con columnas `text` de Drizzle y evitar tipos enum nativos.
- `TIMESTAMP ... ON UPDATE CURRENT_TIMESTAMP` → `timestamptz` + trigger
  `set_updated_at()` (creado en `public`).
- Las columnas en camelCase van **entre comillas** (`"openId"`, `"createdAt"`):
  en PostgreSQL los identificadores sin comillas se pliegan a minúsculas y el
  mapeo de Drizzle dejaría de encontrarlas.
- Los payloads que en MySQL son `TEXT` con JSON se mantienen como `text`
  (no `jsonb`), porque el código hace `JSON.stringify`/`JSON.parse` a mano.

## Verificación

Las migraciones se ejecutaron de principio a fin en un PostgreSQL 16 limpio
(contenedor, con los roles `anon`/`authenticated`/`service_role` y las
privilegios por defecto de Supabase emulados). Comprobaciones pasadas:

- RLS activo en las 17 tablas (aviso de la propia migración).
- `authenticated` con claims ve solo sus filas; sin claims ve 0; con claims de
  otro usuario no ve ni edita filas ajenas (`UPDATE 0`).
- Escritura denegada en `status`, `amountPaid`, `role`, `password_reset_codes`
  y `card_tokens`; permitida en el contenido propio (`form_data`, `aiResult`).
- `service_role` opera con total acceso incluso sin `BYPASSRLS`; `anon` recibe
  `permission denied`.
