
-- Tighten INSERT policies on CMS content tables to require at least one assigned role
DROP POLICY IF EXISTS "auth insert edu" ON public.educational_posts;
CREATE POLICY "auth insert edu" ON public.educational_posts
FOR INSERT TO authenticated
WITH CHECK (
  auth.uid() IS NOT NULL
  AND ((author_id = auth.uid()) OR private.can_manage(auth.uid()))
  AND (private.can_manage(auth.uid()) OR (status = ANY (ARRAY['draft'::content_status,'pending'::content_status])))
  AND (private.can_manage(auth.uid()) OR EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid()))
);

DROP POLICY IF EXISTS "auth insert research" ON public.research_articles;
CREATE POLICY "auth insert research" ON public.research_articles
FOR INSERT TO authenticated
WITH CHECK (
  auth.uid() IS NOT NULL
  AND ((author_id = auth.uid()) OR private.can_manage(auth.uid()))
  AND (private.can_manage(auth.uid()) OR (status = ANY (ARRAY['draft'::content_status,'pending'::content_status])))
  AND (private.can_manage(auth.uid()) OR EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid()))
);

DROP POLICY IF EXISTS "auth insert weekly" ON public.weekly_reads;
CREATE POLICY "auth insert weekly" ON public.weekly_reads
FOR INSERT TO authenticated
WITH CHECK (
  auth.uid() IS NOT NULL
  AND ((author_id = auth.uid()) OR private.can_manage(auth.uid()))
  AND (private.can_manage(auth.uid()) OR (status = ANY (ARRAY['draft'::content_status,'pending'::content_status])))
  AND (private.can_manage(auth.uid()) OR EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid()))
);

-- Explicit service_role write policies for agent run log tables
CREATE POLICY "service role writes ai runs" ON public.ai_agent_runs
FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "service role writes macro runs" ON public.macro_agent_runs
FOR ALL TO service_role USING (true) WITH CHECK (true);
