CREATE SCHEMA IF NOT EXISTS private;

CREATE OR REPLACE FUNCTION private.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

CREATE OR REPLACE FUNCTION private.can_manage(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role IN ('admin','editor')
  )
$$;

GRANT USAGE ON SCHEMA private TO authenticated;
GRANT EXECUTE ON FUNCTION private.has_role(uuid, public.app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION private.can_manage(uuid) TO authenticated;

DROP POLICY IF EXISTS "manage write countries" ON public.countries;
CREATE POLICY "manage write countries"
ON public.countries
FOR ALL
TO authenticated
USING (private.can_manage(auth.uid()))
WITH CHECK (private.can_manage(auth.uid()));

DROP POLICY IF EXISTS "auth read all country indicators" ON public.country_indicators;
CREATE POLICY "auth read all country indicators"
ON public.country_indicators
FOR SELECT
TO authenticated
USING (private.can_manage(auth.uid()));

DROP POLICY IF EXISTS "manage write country indicators" ON public.country_indicators;
CREATE POLICY "manage write country indicators"
ON public.country_indicators
FOR ALL
TO authenticated
USING (private.can_manage(auth.uid()))
WITH CHECK (private.can_manage(auth.uid()));

DROP POLICY IF EXISTS "auth read all indicators" ON public.economic_indicators;
CREATE POLICY "auth read all indicators"
ON public.economic_indicators
FOR SELECT
TO authenticated
USING (private.can_manage(auth.uid()));

DROP POLICY IF EXISTS "manage write indicators" ON public.economic_indicators;
CREATE POLICY "manage write indicators"
ON public.economic_indicators
FOR ALL
TO authenticated
USING (private.can_manage(auth.uid()))
WITH CHECK (private.can_manage(auth.uid()));

DROP POLICY IF EXISTS "auth read all edu" ON public.educational_posts;
CREATE POLICY "auth read all edu"
ON public.educational_posts
FOR SELECT
TO authenticated
USING (private.can_manage(auth.uid()) OR (author_id = auth.uid()));

DROP POLICY IF EXISTS "auth insert edu" ON public.educational_posts;
CREATE POLICY "auth insert edu"
ON public.educational_posts
FOR INSERT
TO authenticated
WITH CHECK ((auth.uid() IS NOT NULL) AND ((author_id = auth.uid()) OR private.can_manage(auth.uid())));

DROP POLICY IF EXISTS "manage update edu" ON public.educational_posts;
CREATE POLICY "manage update edu"
ON public.educational_posts
FOR UPDATE
TO authenticated
USING (private.can_manage(auth.uid()) OR ((author_id = auth.uid()) AND (status = ANY (ARRAY['draft'::public.content_status, 'pending'::public.content_status, 'declined'::public.content_status]))))
WITH CHECK (private.can_manage(auth.uid()) OR ((author_id = auth.uid()) AND (status = ANY (ARRAY['draft'::public.content_status, 'pending'::public.content_status, 'declined'::public.content_status]))));

DROP POLICY IF EXISTS "manage delete edu" ON public.educational_posts;
CREATE POLICY "manage delete edu"
ON public.educational_posts
FOR DELETE
TO authenticated
USING (private.can_manage(auth.uid()));

DROP POLICY IF EXISTS "manage write indicator defs" ON public.indicator_definitions;
CREATE POLICY "manage write indicator defs"
ON public.indicator_definitions
FOR ALL
TO authenticated
USING (private.can_manage(auth.uid()))
WITH CHECK (private.can_manage(auth.uid()));

DROP POLICY IF EXISTS "admins manage invitations" ON public.invitations;
CREATE POLICY "admins manage invitations"
ON public.invitations
FOR ALL
TO authenticated
USING (private.has_role(auth.uid(), 'admin'::public.app_role))
WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "admins read all profiles" ON public.profiles;
CREATE POLICY "admins read all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "auth read all research" ON public.research_articles;
CREATE POLICY "auth read all research"
ON public.research_articles
FOR SELECT
TO authenticated
USING (private.can_manage(auth.uid()) OR (author_id = auth.uid()));

DROP POLICY IF EXISTS "auth insert research" ON public.research_articles;
CREATE POLICY "auth insert research"
ON public.research_articles
FOR INSERT
TO authenticated
WITH CHECK ((auth.uid() IS NOT NULL) AND ((author_id = auth.uid()) OR private.can_manage(auth.uid())));

DROP POLICY IF EXISTS "manage update research" ON public.research_articles;
CREATE POLICY "manage update research"
ON public.research_articles
FOR UPDATE
TO authenticated
USING (private.can_manage(auth.uid()) OR ((author_id = auth.uid()) AND (status = ANY (ARRAY['draft'::public.content_status, 'pending'::public.content_status, 'declined'::public.content_status]))))
WITH CHECK (private.can_manage(auth.uid()) OR ((author_id = auth.uid()) AND (status = ANY (ARRAY['draft'::public.content_status, 'pending'::public.content_status, 'declined'::public.content_status]))));

DROP POLICY IF EXISTS "manage delete research" ON public.research_articles;
CREATE POLICY "manage delete research"
ON public.research_articles
FOR DELETE
TO authenticated
USING (private.can_manage(auth.uid()));

DROP POLICY IF EXISTS "admins manage roles" ON public.user_roles;
CREATE POLICY "admins manage roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (private.has_role(auth.uid(), 'admin'::public.app_role))
WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "admins read all roles" ON public.user_roles;
CREATE POLICY "admins read all roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "auth read all weekly" ON public.weekly_reads;
CREATE POLICY "auth read all weekly"
ON public.weekly_reads
FOR SELECT
TO authenticated
USING (private.can_manage(auth.uid()) OR (author_id = auth.uid()));

DROP POLICY IF EXISTS "auth insert weekly" ON public.weekly_reads;
CREATE POLICY "auth insert weekly"
ON public.weekly_reads
FOR INSERT
TO authenticated
WITH CHECK ((auth.uid() IS NOT NULL) AND ((author_id = auth.uid()) OR private.can_manage(auth.uid())));

DROP POLICY IF EXISTS "manage update weekly" ON public.weekly_reads;
CREATE POLICY "manage update weekly"
ON public.weekly_reads
FOR UPDATE
TO authenticated
USING (private.can_manage(auth.uid()) OR ((author_id = auth.uid()) AND (status = ANY (ARRAY['draft'::public.content_status, 'pending'::public.content_status, 'declined'::public.content_status]))))
WITH CHECK (private.can_manage(auth.uid()) OR ((author_id = auth.uid()) AND (status = ANY (ARRAY['draft'::public.content_status, 'pending'::public.content_status, 'declined'::public.content_status]))));

DROP POLICY IF EXISTS "manage delete weekly" ON public.weekly_reads;
CREATE POLICY "manage delete weekly"
ON public.weekly_reads
FOR DELETE
TO authenticated
USING (private.can_manage(auth.uid()));

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path TO public
AS $$
  SELECT private.has_role(_user_id, _role)
$$;

CREATE OR REPLACE FUNCTION public.can_manage(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path TO public
AS $$
  SELECT private.can_manage(_user_id)
$$;

REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.can_manage(uuid) FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.assign_role_from_profile() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated, public;