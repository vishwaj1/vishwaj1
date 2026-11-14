-- Editable content for the printed cards. question_id is permanent (answers.question_id).
-- question TEXT is printed on physical cards: do not edit after printing. chips / mine are safe to edit.
create table if not exists public.card_content (
  question_id  text primary key,
  sort_order   integer not null,
  question     text not null,
  chips        text[] not null,
  mine         text not null,
  needs_verify boolean not null default false,
  updated_at   timestamptz not null default now(),
  constraint card_content_three_chips check (array_length(chips, 1) = 3)
);

create or replace function public.touch_card_content() returns trigger
language plpgsql set search_path = public as $$
begin new.updated_at = now(); return new; end $$;

drop trigger if exists card_content_touch on public.card_content;
create trigger card_content_touch before update on public.card_content
  for each row execute function public.touch_card_content();

alter table public.card_content enable row level security;
drop policy if exists "card_content is publicly readable" on public.card_content;
create policy "card_content is publicly readable" on public.card_content
  for select to anon, authenticated using (true);

revoke all on public.card_content from anon, authenticated;
grant select on public.card_content to anon, authenticated;
