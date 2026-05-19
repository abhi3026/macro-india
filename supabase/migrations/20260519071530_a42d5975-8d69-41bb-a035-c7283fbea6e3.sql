drop function if exists public.ensure_current_user_access();

create or replace function public.assign_role_from_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  _invite_role public.app_role;
begin
  select role
  into _invite_role
  from public.invitations
  where lower(email) = lower(new.email)
    and accepted_at is null
  order by created_at desc
  limit 1;

  if not exists (select 1 from public.user_roles where user_id = new.id) then
    insert into public.user_roles (user_id, role)
    values (new.id, coalesce(_invite_role, 'contributor'::public.app_role));
  end if;

  if _invite_role is not null then
    update public.invitations
    set accepted_at = now()
    where lower(email) = lower(new.email)
      and accepted_at is null;
  end if;

  return new;
end;
$$;

revoke all on function public.assign_role_from_profile() from public;
revoke all on function public.assign_role_from_profile() from anon;
revoke all on function public.assign_role_from_profile() from authenticated;

drop trigger if exists assign_role_from_profile_trigger on public.profiles;
create trigger assign_role_from_profile_trigger
after insert or update of email on public.profiles
for each row
execute function public.assign_role_from_profile();

drop policy if exists "users insert own profile" on public.profiles;
create policy "users insert own profile"
on public.profiles
for insert
to authenticated
with check (id = auth.uid());

insert into public.profiles (id, email, display_name)
select u.id, u.email, split_part(u.email, '@', 1)
from auth.users u
where u.email is not null
on conflict (id) do update
set email = excluded.email,
    display_name = coalesce(public.profiles.display_name, excluded.display_name);

insert into public.user_roles (user_id, role)
select u.id,
       coalesce((
         select i.role
         from public.invitations i
         where lower(i.email) = lower(u.email)
         order by i.created_at desc
         limit 1
       ), 'contributor'::public.app_role)
from auth.users u
where not exists (
  select 1 from public.user_roles ur where ur.user_id = u.id
);