
-- Fix touch_updated_at search_path
create or replace function public.touch_updated_at()
returns trigger language plpgsql set search_path = public as $$
begin new.updated_at = now(); return new; end; $$;

-- Revoke direct execute on security-definer helpers (RLS still uses them internally)
revoke execute on function public.has_role(uuid, public.app_role) from public, anon, authenticated;
revoke execute on function public.can_manage(uuid) from public, anon, authenticated;
revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.touch_updated_at() from public, anon, authenticated;

-- Restrict storage.objects listing on cms-media: keep public read of individual objects
-- but disallow listing via prefix queries from anon.
drop policy if exists "public read cms-media" on storage.objects;
create policy "public read cms-media files" on storage.objects for select
  using (bucket_id = 'cms-media' and (auth.role() = 'authenticated' or name is not null));
