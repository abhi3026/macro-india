
-- 1) Remove contributor fallback: only assign role if invitation exists
CREATE OR REPLACE FUNCTION public.assign_role_from_profile()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
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

  if _invite_role is not null then
    if not exists (select 1 from public.user_roles where user_id = new.id) then
      insert into public.user_roles (user_id, role)
      values (new.id, _invite_role);
    end if;

    update public.invitations
    set accepted_at = now()
    where lower(email) = lower(new.email)
      and accepted_at is null;
  end if;

  return new;
end;
$function$;

-- 2) Restrict INSERT status on content tables to draft/pending for non-managers
DROP POLICY IF EXISTS "auth insert edu" ON public.educational_posts;
CREATE POLICY "auth insert edu" ON public.educational_posts
FOR INSERT TO authenticated
WITH CHECK (
  auth.uid() IS NOT NULL
  AND (author_id = auth.uid() OR private.can_manage(auth.uid()))
  AND (
    private.can_manage(auth.uid())
    OR status IN ('draft'::content_status, 'pending'::content_status)
  )
);

DROP POLICY IF EXISTS "auth insert research" ON public.research_articles;
CREATE POLICY "auth insert research" ON public.research_articles
FOR INSERT TO authenticated
WITH CHECK (
  auth.uid() IS NOT NULL
  AND (author_id = auth.uid() OR private.can_manage(auth.uid()))
  AND (
    private.can_manage(auth.uid())
    OR status IN ('draft'::content_status, 'pending'::content_status)
  )
);

DROP POLICY IF EXISTS "auth insert weekly" ON public.weekly_reads;
CREATE POLICY "auth insert weekly" ON public.weekly_reads
FOR INSERT TO authenticated
WITH CHECK (
  auth.uid() IS NOT NULL
  AND (author_id = auth.uid() OR private.can_manage(auth.uid()))
  AND (
    private.can_manage(auth.uid())
    OR status IN ('draft'::content_status, 'pending'::content_status)
  )
);
