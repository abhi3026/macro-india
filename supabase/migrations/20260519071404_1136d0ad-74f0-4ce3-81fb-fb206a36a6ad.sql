create or replace function public.ensure_current_user_access()
returns public.app_role[]
language plpgsql
security definer
set search_path = public
as $$
declare
  _uid uuid := auth.uid();
  _email text := lower(coalesce(auth.jwt() ->> 'email', ''));
  _display_name text;
  _invite_role public.app_role;
  _roles public.app_role[];
begin
  if _uid is null then
    return '{}'::public.app_role[];
  end if;

  if _email = '' then
    _email := _uid::text || '@unknown.local';
  end if;

  _display_name := split_part(_email, '@', 1);

  insert into public.profiles (id, email, display_name)
  values (_uid, _email, _display_name)
  on conflict (id) do update
  set email = excluded.email,
      display_name = coalesce(public.profiles.display_name, excluded.display_name);

  select role
  into _invite_role
  from public.invitations
  where lower(email) = _email
    and accepted_at is null
  order by created_at desc
  limit 1;

  if not exists (select 1 from public.user_roles where user_id = _uid) then
    insert into public.user_roles (user_id, role)
    values (_uid, coalesce(_invite_role, 'contributor'::public.app_role));
  end if;

  if _invite_role is not null then
    update public.invitations
    set accepted_at = now()
    where lower(email) = _email
      and accepted_at is null;
  end if;

  select coalesce(array_agg(role), '{}'::public.app_role[])
  into _roles
  from public.user_roles
  where user_id = _uid;

  return coalesce(_roles, '{}'::public.app_role[]);
end;
$$;

grant execute on function public.ensure_current_user_access() to authenticated;