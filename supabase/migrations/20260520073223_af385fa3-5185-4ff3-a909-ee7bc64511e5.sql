GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO anon;
GRANT EXECUTE ON FUNCTION public.can_manage(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.can_manage(uuid) TO anon;
GRANT EXECUTE ON FUNCTION public.touch_updated_at() TO authenticated;
GRANT EXECUTE ON FUNCTION public.assign_role_from_profile() TO authenticated;