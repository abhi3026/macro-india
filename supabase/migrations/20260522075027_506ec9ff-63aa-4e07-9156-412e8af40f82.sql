
-- 1) Replace handle_new_user: no hardcoded admin, no auto role grant
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
begin
  insert into public.profiles (id, email, display_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email,'@',1)))
  on conflict (id) do nothing;
  return new;
end;
$function$;

-- Also remove invitation-based auto role assignment trigger function behavior:
-- keep assign_role_from_profile available but it only runs if a trigger exists; we leave it as-is (invite-only grants).

-- 2) Storage policies for cms-media
DROP POLICY IF EXISTS "auth upload cms-media" ON storage.objects;
CREATE POLICY "managers upload cms-media"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'cms-media' AND public.can_manage(auth.uid()));

DROP POLICY IF EXISTS "public read cms-media files" ON storage.objects;
CREATE POLICY "public read cms-media files"
  ON storage.objects FOR SELECT TO public
  USING (bucket_id = 'cms-media');
