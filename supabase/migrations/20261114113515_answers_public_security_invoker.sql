-- Public wall view runs with the caller's rights, so RLS on answers applies.
alter view public.answers_public set (security_invoker = on);

drop policy if exists answers_anon_read_public on public.answers;
create policy answers_anon_read_public on public.answers
  for select to anon using (is_public and not hidden);

grant select on public.answers_public to anon;
