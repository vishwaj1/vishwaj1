-- /hi card pages: scan counting + answers wall.
-- Run once in the Supabase SQL editor (or via the Supabase MCP / CLI).
-- Safe to re-run: everything is guarded with IF NOT EXISTS / OR REPLACE.

-- ---------------------------------------------------------------- tables
create table if not exists public.scans (
  id          bigint generated always as identity primary key,
  card_number int not null check (card_number between 1 and 100),
  created_at  timestamptz not null default now()
);
create index if not exists scans_card_idx on public.scans (card_number);

create table if not exists public.answers (
  id          uuid primary key default gen_random_uuid(),
  card_number int  not null check (card_number between 1 and 100),
  question_id text not null check (char_length(question_id) between 1 and 60),
  answer      text not null check (char_length(answer) between 1 and 140),
  first_name  text check (char_length(first_name) <= 40),
  email       text check (char_length(email) <= 120),
  city        text check (char_length(city) <= 60),
  is_public   boolean not null default false,
  hidden      boolean not null default false,  -- flip to true in the dashboard to moderate
  created_at  timestamptz not null default now()
);
create index if not exists answers_wall_idx
  on public.answers (question_id, created_at desc)
  where is_public and not hidden;

-- ---------------------------------------------------------------- RLS
alter table public.scans   enable row level security;
alter table public.answers enable row level security;

-- Start from zero privileges for the public roles, then grant back the minimum.
revoke all on public.scans   from anon, authenticated;
revoke all on public.answers from anon, authenticated;

-- anon may INSERT answers (specific columns only) and can never SELECT them.
grant insert (card_number, question_id, answer, first_name, email, city, is_public)
  on public.answers to anon;

drop policy if exists answers_anon_insert on public.answers;
create policy answers_anon_insert on public.answers
  for insert to anon
  with check (hidden = false);

-- scans: RLS on, no policies, no grants -> only register_scan() can touch it.

-- ---------------------------------------------------------------- public view
-- Owner-run view (bypasses RLS on purpose): the ONLY way anon can read answers,
-- and it never exposes email, card_number or the hidden/is_public flags.
create or replace view public.answers_public
  with (security_invoker = false) as
  select question_id, first_name, answer, city, created_at
  from public.answers
  where is_public and not hidden;

revoke all on public.answers_public from anon, authenticated;
grant select on public.answers_public to anon;

-- ---------------------------------------------------------------- scan counting
-- register_scan(card)                -> records a scan, returns the new count
-- register_scan(card, record=false)  -> read-only, returns the live count
create or replace function public.register_scan(card int, record boolean default true)
returns int
language plpgsql
security definer
set search_path = public
as $$
declare
  total int;
begin
  if card is null or card < 1 or card > 100 then
    raise exception 'invalid card number';
  end if;
  if record then
    insert into public.scans (card_number) values (card);
  end if;
  select count(*)::int into total from public.scans where card_number = card;
  return total;
end;
$$;

revoke all on function public.register_scan(int, boolean) from public;
grant execute on function public.register_scan(int, boolean) to anon;
