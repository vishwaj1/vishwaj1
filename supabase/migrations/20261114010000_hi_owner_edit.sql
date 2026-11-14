-- Let a visitor change or remove THEIR OWN answer, without accounts.
-- The browser generates a random owner_token (uuid) and keeps it in localStorage.
-- It is write-only for anon (never selectable, never in answers_public), so it acts
-- as a private bearer secret. Safe to re-run.

alter table public.answers add column if not exists owner_token uuid;
create unique index if not exists answers_owner_token_idx
  on public.answers (owner_token) where owner_token is not null;

-- anon may supply the token on insert (still cannot read it back).
grant insert (owner_token) on public.answers to anon;

-- Update: only answer text and first name; is_public / hidden / email stay untouched,
-- so a moderated (hidden) row stays hidden even if its owner edits it.
create or replace function public.update_my_answer(
  token uuid, new_answer text, new_first_name text default null
) returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  changed int;
begin
  if token is null or char_length(coalesce(new_answer, '')) not between 1 and 140
     or char_length(coalesce(new_first_name, '')) > 40 then
    raise exception 'invalid input';
  end if;
  update public.answers
     set answer = new_answer,
         first_name = nullif(btrim(coalesce(new_first_name, '')), '')
   where owner_token = token;
  get diagnostics changed = row_count;
  return changed > 0;
end;
$$;

create or replace function public.delete_my_answer(token uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  removed int;
begin
  if token is null then
    raise exception 'invalid input';
  end if;
  delete from public.answers where owner_token = token;
  get diagnostics removed = row_count;
  return removed > 0;
end;
$$;

revoke all on function public.update_my_answer(uuid, text, text) from public, anon, authenticated;
revoke all on function public.delete_my_answer(uuid) from public, anon, authenticated;
grant execute on function public.update_my_answer(uuid, text, text) to anon;
grant execute on function public.delete_my_answer(uuid) to anon;
