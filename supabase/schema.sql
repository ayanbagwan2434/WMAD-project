create table if not exists public.levelup_progress (
  user_id uuid primary key references auth.users (id) on delete cascade,
  state jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.levelup_progress enable row level security;

grant select, insert, update on public.levelup_progress to authenticated;

drop policy if exists "read own levelup progress" on public.levelup_progress;
create policy "read own levelup progress"
  on public.levelup_progress
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "insert own levelup progress" on public.levelup_progress;
create policy "insert own levelup progress"
  on public.levelup_progress
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "update own levelup progress" on public.levelup_progress;
create policy "update own levelup progress"
  on public.levelup_progress
  for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
