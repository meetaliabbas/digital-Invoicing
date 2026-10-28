-- Review before applying to a production database. This schema is additive but replaces
-- policies with the names below. Run first in a staging Supabase project.
create extension if not exists pgcrypto;

create table if not exists public.tenants (
  id uuid primary key default gen_random_uuid(),
  legal_name text not null check (char_length(trim(legal_name)) between 1 and 250),
  ntn text,
  sales_tax_registration_number text,
  address text,
  created_at timestamptz not null default now()
);

create table if not exists public.tenant_members (
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'owner' check (role in ('owner','admin','accountant','viewer')),
  created_at timestamptz not null default now(),
  primary key (tenant_id, user_id)
);
create index if not exists tenant_members_user_tenant_idx
  on public.tenant_members (user_id, tenant_id);

create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete restrict,
  invoice_number text not null check (char_length(trim(invoice_number)) between 1 and 80),
  invoice_date date not null,
  buyer_name text not null check (char_length(trim(buyer_name)) between 1 and 250),
  buyer_tax_id text,
  currency char(3) not null default 'PKR' check (currency ~ '^[A-Z]{3}$'),
  items jsonb not null check (jsonb_typeof(items) = 'array' and jsonb_array_length(items) between 1 and 200),
  subtotal numeric(18,2) not null check (subtotal >= 0),
  tax_total numeric(18,2) not null check (tax_total >= 0),
  total numeric(18,2) not null check (total >= 0),
  status text not null default 'draft' check (status in ('draft','queued','submitted','accepted','rejected','cancelled')),
  fbr_reference text,
  fbr_response jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, invoice_number),
  unique (tenant_id, id)
);

create table if not exists public.invoice_events (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid not null,
  tenant_id uuid not null references public.tenants(id) on delete restrict,
  event_type text not null,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  foreign key (tenant_id, invoice_id) references public.invoices(tenant_id, id) on delete restrict
);
create index if not exists invoices_tenant_created_idx
  on public.invoices (tenant_id, created_at desc);
create index if not exists invoice_events_tenant_created_idx
  on public.invoice_events (tenant_id, created_at desc);
create index if not exists invoice_events_invoice_created_idx
  on public.invoice_events (invoice_id, created_at desc);
create index if not exists invoice_events_tenant_invoice_idx
  on public.invoice_events (tenant_id, invoice_id);

alter table public.tenants enable row level security;
alter table public.tenant_members enable row level security;
alter table public.invoices enable row level security;
alter table public.invoice_events enable row level security;

-- Invoker functions live outside the exposed public schema and rely on the caller's
-- own membership visibility; no SECURITY DEFINER is needed for membership checks.
create schema if not exists private;
revoke all on schema private from public, anon;
grant usage on schema private to authenticated;

create or replace function private.is_tenant_member(check_tenant uuid)
returns boolean
language sql stable
set search_path = ''
as $$
  select exists (
    select 1 from public.tenant_members tm
    where tm.tenant_id = check_tenant and tm.user_id = (select auth.uid())
  );
$$;

create or replace function private.has_tenant_role(check_tenant uuid, allowed_roles text[])
returns boolean
language sql stable
set search_path = ''
as $$
  select exists (
    select 1 from public.tenant_members tm
    where tm.tenant_id = check_tenant
      and tm.user_id = (select auth.uid())
      and tm.role = any(allowed_roles)
  );
$$;
revoke all on function private.is_tenant_member(uuid) from public, anon;
revoke all on function private.has_tenant_role(uuid, text[]) from public, anon;
grant execute on function private.is_tenant_member(uuid) to authenticated;
grant execute on function private.has_tenant_role(uuid, text[]) to authenticated;

drop policy if exists "members can read their tenants" on public.tenants;
create policy "members can read their tenants" on public.tenants
  for select to authenticated using (private.is_tenant_member(id));

drop policy if exists "users can read own memberships" on public.tenant_members;
create policy "users can read own memberships" on public.tenant_members
  for select to authenticated using (user_id = (select auth.uid()));

drop policy if exists "members can read invoices" on public.invoices;
create policy "members can read invoices" on public.invoices
  for select to authenticated using (private.is_tenant_member(tenant_id));

drop policy if exists "accounting roles can create invoices" on public.invoices;
create policy "accounting roles can create invoices" on public.invoices
  for insert to authenticated
  with check (private.has_tenant_role(tenant_id, array['owner','admin','accountant']));

drop policy if exists "accounting roles can update invoices" on public.invoices;
-- No client UPDATE policy or UPDATE grant: clients must not forge FBR submission status.
-- Future edits/status transitions should go through narrowly-scoped server handlers/RPCs.

drop policy if exists "members can read invoice events" on public.invoice_events;
create policy "members can read invoice events" on public.invoice_events
  for select to authenticated using (private.is_tenant_member(tenant_id));

-- Intentionally no authenticated INSERT/UPDATE/DELETE policy for invoice_events:
-- audit records are append-only and written by this narrowly-scoped trigger.
create or replace function private.record_invoice_event()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if TG_OP = 'INSERT' then
    insert into public.invoice_events (invoice_id, tenant_id, event_type, details)
    values (NEW.id, NEW.tenant_id, 'draft_created', jsonb_build_object('source', 'database_trigger'));
    return NEW;
  elsif TG_OP = 'UPDATE' and OLD.status is distinct from NEW.status then
    insert into public.invoice_events (invoice_id, tenant_id, event_type, details)
    values (NEW.id, NEW.tenant_id, 'status_changed',
      jsonb_build_object('from', OLD.status, 'to', NEW.status));
    return NEW;
  end if;
  return NEW;
end;
$$;
revoke all on function private.record_invoice_event() from public, anon, authenticated;
drop trigger if exists invoices_audit_event on public.invoices;
create trigger invoices_audit_event
  after insert or update of status on public.invoices
  for each row execute function private.record_invoice_event();

-- Grant only the table operations used by the app; RLS still governs every row.
-- No client UPDATE/DELETE grants on invoices and no direct writes to invoice_events.
grant select on public.tenants, public.tenant_members, public.invoices, public.invoice_events to authenticated;
grant insert on public.invoices to authenticated;

create or replace function private.touch_invoice_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  NEW.updated_at = now();
  return NEW;
end;
$$;
revoke all on function private.touch_invoice_updated_at() from public, anon, authenticated;
drop trigger if exists invoices_touch_updated_at on public.invoices;
create trigger invoices_touch_updated_at
  before update on public.invoices
  for each row execute function private.touch_invoice_updated_at();

-- Tenant and membership bootstrap is deliberately an administrative operation.
-- Do not add self-service membership INSERT policies. Create the tenant and owner
-- membership via a trusted admin workflow or SQL editor, then remove temporary access.
