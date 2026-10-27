alter table public.evaluaciones_diagnosticas
  add column if not exists "localId" varchar(128);

create unique index if not exists uq_evaluaciones_diagnosticas_owner_local_id
  on public.evaluaciones_diagnosticas ("sessionId", "localId");
