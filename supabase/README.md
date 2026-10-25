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

**Requisito**: las políticas solo filtran algo cuando hay un JWT. El login con
email y contraseña ya emite tokens de **Supabase Auth** (`auth.users`), pero el
cliente todavía no habla con PostgREST/supabase-js: las llamadas al backend
siguen siendo con la cadena `postgres` (bypasea el RLS). El rol `authenticated`
solo tendrá claims cuando se empiece a consumir la API de Supabase desde el
cliente — hasta entonces, sin claims, todo le queda denegado: es lo esperado,
no un fallo.

## Autenticación — Supabase Auth

El login con email y contraseña lo valida **Supabase Auth** desde el backend
(`api/_lib/supabase-auth.ts`): registro, login, recuperación de contraseña,
renovación de sesión y verificación del JWT pasan por `auth.users`.

| Credencial | Dónde se guarda | Quién la valida |
| --- | --- | --- |
| Contraseña (email + contraseña) | `auth.users` de Supabase (bcrypt) | Supabase Auth vía GoTrue |
| Marcador local | `public.docente_accounts."passwordHash"` = `supabase:<user_id>` | Indica que la clave ya NO está en esta tabla |
| Hash scrypt heredado | misma columna, formato `salt:hash` | Respaldo legacy: se migra a Supabase en el primer login |
| Código de recuperación de 6 dígitos | `public.password_reset_codes.codeHash` (HMAC-SHA256) | Backend; al aplicarlo también actualiza `auth.users` |
| Códigos de acceso institucionales | `public.code_activations` | Backend (no crea usuario en Supabase) |

Flujos: `POST /api/auth/register`, `login`, `register-maintenance`,
`forgot-password`, `reset-password`, `refresh` y `GET /api/auth/me`
(verifica el access token con el JWKS de `${SUPABASE_URL}/auth/v1`).

- Los usuarios existentes se migran **solos en su próximo login**: si el hash
  scrypt local coincide con la contraseña escrita, la cuenta se crea en
  `auth.users` con esa contraseña y en `docente_accounts` queda el marcador.
- El panel de admin (`create-docente`, `reset-password`, `grant-access`,
  `reactivate-access`) sincroniza la contraseña con Supabase; si la
  sincronización falla, conserva el hash local como respaldo.
- Los usuarios creados por admin quedan **confirmados** (`email_confirm: true`),
  igual que el registro normal: se entra a la app sin verificar el correo.


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

# Supabase Auth (Settings → API). El backend usa la anon para login/refresh y
# la service_role para crear usuarios y cambiar contraseñas.
SUPABASE_URL=https://<PROJECT>.supabase.co
SUPABASE_ANON_KEY=<anon key>
SUPABASE_SERVICE_ROLE_KEY=<service_role key>
```

> Las tres variables de Auth son **obligatorias en Vercel** para que el login
> funcione. Si faltan, el backend cae al modo legacy y solo puede validar a los
> usuarios **aún no migrados** (hash scrypt local): las cuentas con marcador
> `supabase:<id>` quedan fuera, así que conviene tratarlas como un fallo de
> despliegue y restaurarlas en cuanto se note.

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
- Login con email y contraseña sobre **Supabase Auth**
  (`api/_lib/supabase-auth.ts`): registro, login, recuperación de contraseña,
  `refresh` y `me`; migración perezosa de las cuentas con hash scrypt heredado.

## Pendiente

- Que el cliente envíe el access token de Supabase a los endpoints de datos y
  pasar los procedimientos tRPC a `protectedProcedure` (hoy el token solo se
  guarda y se renueva en `lib/access-control.tsx`, y `/api/auth/me` es el único
  endpoint que lo verifica).
- Decidir si se activa la **confirmación de correo** en Supabase: hoy registro
  y admin crean usuarios ya confirmados para conservar el acceso inmediato.
- Códigos de acceso institucionales y OAuth propio siguen **fuera** de
  Supabase Auth.
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
