CREATE POLICY "managers list cms-media"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'cms-media' AND public.can_manage(auth.uid()));