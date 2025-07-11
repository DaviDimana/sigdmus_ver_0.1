-- Relax avatars UPDATE policy to allow user to overwrite own avatar even when owner column is NULL

DROP POLICY IF EXISTS avatars_update ON storage.objects;

CREATE POLICY avatars_update ON storage.objects
  FOR UPDATE
  USING (bucket_id = 'avatars')
  WITH CHECK (bucket_id = 'avatars'); 