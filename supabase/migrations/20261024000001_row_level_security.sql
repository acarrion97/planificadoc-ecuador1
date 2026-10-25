-- =============================================================================
-- Planificadoc — Row Level Security (Supabase / PostgreSQL)
-- Migración: 20261024000001_row_level_security.sql
-- Depende de: 20261024000000_init_schema.sql (crea las tablas y set_updated_at)
--
-- Modelo de acceso
-- ----------------
-- 1. BACKEND (API / tRPC / funciones): usa el connection string (rol `postgres`,
--    dueño de las tablas) o la `service_role` key. Ambos BYPASSAN el RLS, así
--    que todo el código actual (server/db.ts, api/_lib/db.ts, routers) sigue
--    funcionando sin cambios.
--
-- 2. CLIENTE (rol `authenticated`, vía PostgREST/supabase-js): solo puede
--    VER y modificar las FILAS PROPIAS, identificadas por el claim del JWT:
--      * `email` → tablas cuyo identificador es el email
--      * `sub`    → tablas cuyo identificador es el sessionId/session_id
--    Requiere autenticarse con Supabase Auth (GoTrue). Mientras la app use su
--    propio login (docente_accounts / OAuth propio), el rol `authenticated`
--    simplemente no tendrá claims y TODO le quedará denegado: es el
--    comportamiento deseado, no un fallo.
--
-- 3. `anon`: sin ningún privilegio sobre estas tablas (la app nunca habla con
--    Supabase desde el cliente sin autenticar).
--
-- Principio de mínimo privilegio aplicado:
--   * users, subscriptions, payment_transactions, docente_contacts,
--     planificacion_stats → SOLO LECTURA propia. Cualquier cambio de estado
--     (rol admin, status de suscripción, montos) pasa por el backend con
--     service_role.
--   * card_tokens, docente_accounts, password_reset_codes, code_activations,
--     payment_attribution → SIN acceso del cliente (credenciales de pago,
--     hash de contraseña, huella de dispositivo, telemetría Meta): solo backend.
--   * Documentos del docente → lectura/escritura propia, con privilegios por
--     COLUMNA para que el cliente no pueda autoconcederse contenido de pago
--     (nunca puede escribir `status`, `amountPaid`, ids de PayPhone...).
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Helper: claims del JWT actual.
-- Se leen las GUCs que PostgREST inyecta por petición, sin depender del esquema
-- `auth` (si no se le concede USAGE a `authenticated`, `auth.jwt()` falla con
-- "permission denied for schema auth" y TODAS las políticas dejan de evaluar).
-- Se cubren las dos variantes:
--   * request.jwt.claim.<nombre>  → PostgREST ≥ 12 (Supabase actual)
--   * request.jwt.claims          → claims completos en JSON (legacy)
-- -----------------------------------------------------------------------------
create or replace function public.jwt_claim(claim text)
returns text
language sql
stable
parallel safe
as $$
  select coalesce(
    nullif(current_setting('request.jwt.claim.' || claim, true), ''),
    nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> claim
  )
$$;

create or replace function public.jwt_email()
returns text
language sql
stable
parallel safe
as $$
  select public.jwt_claim('email')
$$;

create or replace function public.jwt_sub()
returns text
language sql
stable
parallel safe
as $$
  select public.jwt_claim('sub')
$$;

-- ¿Esta fila pertenece al usuario autenticado actual?
-- `record_owner` es el valor de la columna identificadora (email o sessionId).
create or replace function public.is_owner(record_owner text)
returns boolean
language sql
stable
parallel safe
as $$
  select coalesce(record_owner, '') <> ''
     and (
       record_owner = coalesce(public.jwt_email(), '')
        or record_owner = coalesce(public.jwt_sub(), '')
     )
$$;

revoke execute on function public.jwt_claim(text), public.jwt_email(), public.jwt_sub(), public.is_owner(text) from public, anon;
grant  execute on function public.jwt_claim(text), public.jwt_email(), public.jwt_sub(), public.is_owner(text) to authenticated, service_role;

-- =============================================================================
-- 0. anon: cero privilegios sobre el esquema público (defensa en profundidad;
--    aun sin esto, el RLS sin políticas ya lo denegaría todo).
-- =============================================================================
revoke all on all tables in schema public from anon;
revoke all on all sequences in schema public from anon;

-- =============================================================================
-- 1. TABLAS DE LECTURA PROPIA (el estado lo escribe el backend con service_role)
--    users → columna "email"
-- =============================================================================
alter table public.users enable row level security;
revoke all on public.users from authenticated;
grant select on public.users to authenticated;
create policy "users_select_own"
  on public.users for select to authenticated
  using (public.is_owner("email"));

-- subscriptions → columna "email"
alter table public.subscriptions enable row level security;
revoke all on public.subscriptions from authenticated;
grant select on public.subscriptions to authenticated;
create policy "subscriptions_select_own"
  on public.subscriptions for select to authenticated
  using (public.is_owner("email"));

-- payment_transactions → columna "email"
alter table public.payment_transactions enable row level security;
revoke all on public.payment_transactions from authenticated;
grant select on public.payment_transactions to authenticated;
create policy "payment_transactions_select_own"
  on public.payment_transactions for select to authenticated
  using (public.is_owner("email"));

-- docente_contacts → columna "email"
alter table public.docente_contacts enable row level security;
revoke all on public.docente_contacts from authenticated;
grant select on public.docente_contacts to authenticated;
create policy "docente_contacts_select_own"
  on public.docente_contacts for select to authenticated
  using (public.is_owner("email"));

-- planificacion_stats → columna "identifier" (email del suscriptor o código)
alter table public.planificacion_stats enable row level security;
revoke all on public.planificacion_stats from authenticated;
grant select on public.planificacion_stats to authenticated;
create policy "planificacion_stats_select_own"
  on public.planificacion_stats for select to authenticated
  using (public.is_owner("identifier"));
-- Las filas identificadas por un código de acceso no coinciden con ningún claim
-- y solo las verá el backend.

-- =============================================================================
-- 2. DOCUMENTOS DEL DOCENTE — lectura y escritura propia
-- =============================================================================

-- 2.1 pca_documents → sessionId (email o deviceId)
--     RESTRICCIÓN POR COLUMNA: el cliente nunca puede escribir `status`,
--     `clientTransactionId`, `payphoneTransactionId`, `authorizationCode`
--     ni `amountPaid` ⇒ no puede auto-desbloquear contenido de pago.
alter table public.pca_documents enable row level security;
revoke all on public.pca_documents from authenticated;
grant select, delete on public.pca_documents to authenticated;
grant insert ("sessionId", "formData", "aiResult", "createdAt", "updatedAt")
     on public.pca_documents to authenticated;
grant update ("formData", "aiResult", "updatedAt")
     on public.pca_documents to authenticated;

create policy "pca_documents_select_own"
  on public.pca_documents for select to authenticated
  using (public.is_owner("sessionId"));
create policy "pca_documents_insert_own"
  on public.pca_documents for insert to authenticated
  with check (public.is_owner("sessionId"));
create policy "pca_documents_update_own"
  on public.pca_documents for update to authenticated
  using (public.is_owner("sessionId"))
  with check (public.is_owner("sessionId"));
create policy "pca_documents_delete_own"
  on public.pca_documents for delete to authenticated
  using (public.is_owner("sessionId"));

-- 2.2 curriculo_competencias_planificaciones → session_id
--     Misma restricción: `status` (draft/generated/paid) queda fuera del alcance
--     del cliente. `created_at` tampoco es escribible.
alter table public.curriculo_competencias_planificaciones enable row level security;
revoke all on public.curriculo_competencias_planificaciones from authenticated;
grant select, delete on public.curriculo_competencias_planificaciones to authenticated;
grant insert (session_id, tipo, grado, institucion, docente, paralelo, asignatura,
              nivel, periodo_pedagogico, trimestre, dcd_codigo, competencias,
              hay_nee, compartida, form_data, ai_result, source_traceability,
              created_at, updated_at)
     on public.curriculo_competencias_planificaciones to authenticated;
grant update (grado, institucion, docente, paralelo, asignatura, nivel,
              periodo_pedagogico, trimestre, dcd_codigo, competencias,
              hay_nee, compartida, form_data, ai_result, source_traceability,
              updated_at)
     on public.curriculo_competencias_planificaciones to authenticated;

create policy "cc_plan_select_own"
  on public.curriculo_competencias_planificaciones for select to authenticated
  using (public.is_owner(session_id));
create policy "cc_plan_insert_own"
  on public.curriculo_competencias_planificaciones for insert to authenticated
  with check (public.is_owner(session_id));
create policy "cc_plan_update_own"
  on public.curriculo_competencias_planificaciones for update to authenticated
  using (public.is_owner(session_id))
  with check (public.is_owner(session_id));
create policy "cc_plan_delete_own"
  on public.curriculo_competencias_planificaciones for delete to authenticated
  using (public.is_owner(session_id));

-- 2.3 curricular_adaptations → sessionId
alter table public.curricular_adaptations enable row level security;
revoke all on public.curricular_adaptations from authenticated;
grant select, insert, update, delete on public.curricular_adaptations to authenticated;
create policy "curricular_adaptations_select_own"
  on public.curricular_adaptations for select to authenticated
  using (public.is_owner("sessionId"));
create policy "curricular_adaptations_insert_own"
  on public.curricular_adaptations for insert to authenticated
  with check (public.is_owner("sessionId"));
create policy "curricular_adaptations_update_own"
  on public.curricular_adaptations for update to authenticated
  using (public.is_owner("sessionId"))
  with check (public.is_owner("sessionId"));
create policy "curricular_adaptations_delete_own"
  on public.curricular_adaptations for delete to authenticated
  using (public.is_owner("sessionId"));

-- 2.4 dcd_desagregaciones → sessionId (UNIQUE sessionId+codigoDCD+grado ⇒ upsert)
alter table public.dcd_desagregaciones enable row level security;
revoke all on public.dcd_desagregaciones from authenticated;
grant select, insert, update, delete on public.dcd_desagregaciones to authenticated;
create policy "dcd_desagregaciones_select_own"
  on public.dcd_desagregaciones for select to authenticated
  using (public.is_owner("sessionId"));
create policy "dcd_desagregaciones_insert_own"
  on public.dcd_desagregaciones for insert to authenticated
  with check (public.is_owner("sessionId"));
create policy "dcd_desagregaciones_update_own"
  on public.dcd_desagregaciones for update to authenticated
  using (public.is_owner("sessionId"))
  with check (public.is_owner("sessionId"));
create policy "dcd_desagregaciones_delete_own"
  on public.dcd_desagregaciones for delete to authenticated
  using (public.is_owner("sessionId"));

-- 2.5 connecta_nivela_crea → sessionId
alter table public.connecta_nivela_crea enable row level security;
revoke all on public.connecta_nivela_crea from authenticated;
grant select, insert, update, delete on public.connecta_nivela_crea to authenticated;
create policy "connecta_nivela_crea_select_own"
  on public.connecta_nivela_crea for select to authenticated
  using (public.is_owner("sessionId"));
create policy "connecta_nivela_crea_insert_own"
  on public.connecta_nivela_crea for insert to authenticated
  with check (public.is_owner("sessionId"));
create policy "connecta_nivela_crea_update_own"
  on public.connecta_nivela_crea for update to authenticated
  using (public.is_owner("sessionId"))
  with check (public.is_owner("sessionId"));
create policy "connecta_nivela_crea_delete_own"
  on public.connecta_nivela_crea for delete to authenticated
  using (public.is_owner("sessionId"));

-- 2.6 evaluaciones_diagnosticas → sessionId
alter table public.evaluaciones_diagnosticas enable row level security;
revoke all on public.evaluaciones_diagnosticas from authenticated;
grant select, insert, update, delete on public.evaluaciones_diagnosticas to authenticated;
create policy "evaluaciones_diagnosticas_select_own"
  on public.evaluaciones_diagnosticas for select to authenticated
  using (public.is_owner("sessionId"));
create policy "evaluaciones_diagnosticas_insert_own"
  on public.evaluaciones_diagnosticas for insert to authenticated
  with check (public.is_owner("sessionId"));
create policy "evaluaciones_diagnosticas_update_own"
  on public.evaluaciones_diagnosticas for update to authenticated
  using (public.is_owner("sessionId"))
  with check (public.is_owner("sessionId"));
create policy "evaluaciones_diagnosticas_delete_own"
  on public.evaluaciones_diagnosticas for delete to authenticated
  using (public.is_owner("sessionId"));

-- 2.7 proyectos_interdisciplinares → session_id
alter table public.proyectos_interdisciplinares enable row level security;
revoke all on public.proyectos_interdisciplinares from authenticated;
grant select, insert, update, delete on public.proyectos_interdisciplinares to authenticated;
create policy "proyectos_interdisciplinares_select_own"
  on public.proyectos_interdisciplinares for select to authenticated
  using (public.is_owner(session_id));
create policy "proyectos_interdisciplinares_insert_own"
  on public.proyectos_interdisciplinares for insert to authenticated
  with check (public.is_owner(session_id));
create policy "proyectos_interdisciplinares_update_own"
  on public.proyectos_interdisciplinares for update to authenticated
  using (public.is_owner(session_id))
  with check (public.is_owner(session_id));
create policy "proyectos_interdisciplinares_delete_own"
  on public.proyectos_interdisciplinares for delete to authenticated
  using (public.is_owner(session_id));

-- =============================================================================
-- 3. TABLAS SOLO BACKEND — RLS activo y SIN ninguna política para el cliente:
--    cualquier rol distinto de `postgres`/`service_role` queda denegado.
--    * card_tokens:          token de tarjeta para cobros recurrentes (PayPhone).
--    * docente_accounts:     passwordHash (scrypt) de los docentes.
--    * password_reset_codes: contiene codeHash (códigos de 6 dígitos).
--    * code_activations:     huella de dispositivo + IP.
--    * payment_attribution:  fbp/fbc, IP, email y teléfono para Meta CAPI.
-- =============================================================================
alter table public.card_tokens          enable row level security;
alter table public.docente_accounts     enable row level security;
alter table public.password_reset_codes enable row level security;
alter table public.code_activations     enable row level security;
alter table public.payment_attribution  enable row level security;

revoke all on public.card_tokens          from authenticated, anon;
revoke all on public.docente_accounts     from authenticated, anon;
revoke all on public.password_reset_codes from authenticated, anon;
revoke all on public.code_activations     from authenticated, anon;
revoke all on public.payment_attribution  from authenticated, anon;

-- =============================================================================
-- 4. service_role (backend vía la service_role key): acceso completo explícito.
--    En Supabase este rol ya trae BYPASSRLS, pero se declara por política para
--    que el backend no dependa de ese atributo de la cuenta.
-- =============================================================================
do $$
declare
  tablas text[] := array[
    'users', 'subscriptions', 'card_tokens', 'payment_transactions',
    'code_activations', 'docente_accounts', 'password_reset_codes',
    'docente_contacts', 'pca_documents', 'planificacion_stats',
    'curricular_adaptations', 'dcd_desagregaciones', 'connecta_nivela_crea',
    'evaluaciones_diagnosticas', 'payment_attribution',
    'curriculo_competencias_planificaciones', 'proyectos_interdisciplinares'
  ];
  t text;
begin
  foreach t in array tablas loop
    execute format(
      'create policy %I on public.%I for all to service_role using (true) with check (true)',
      'service_role_all_' || t, t
    );
  end loop;
end;
$$;

-- =============================================================================
-- 5. Verificación rápida (aparece en los logs de `supabase db push`)
-- =============================================================================
do $$
declare
  pendientes text;
begin
  select string_agg(format('%I', c.relname), ', ')
    into pendientes
    from pg_class c
    join pg_namespace n on n.oid = c.relnamespace
   where n.nspname = 'public'
     and c.relkind = 'r'
     and not c.relrowsecurity;

  if pendientes is not null then
    raise notice 'RLS sin activar en: %', pendientes;
  else
    raise notice 'RLS activo en todas las tablas de public.';
  end if;
end;
$$;
