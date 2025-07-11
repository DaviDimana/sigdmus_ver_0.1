-- Fix avatars bucket insert policy to avoid owner mismatch issues

-- Drop old insert policy if exists
DROP POLICY IF EXISTS avatars_insert ON storage.objects;

-- Allow any authenticated user to insert files into avatars bucket; owner will be set automatically
CREATE POLICY avatars_insert ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars'
  ); 