DROP POLICY IF EXISTS "owners update cms-media" ON storage.objects;
CREATE POLICY "managers update cms-media"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'cms-media' AND public.can_manage(auth.uid()))
WITH CHECK (bucket_id = 'cms-media' AND public.can_manage(auth.uid()));