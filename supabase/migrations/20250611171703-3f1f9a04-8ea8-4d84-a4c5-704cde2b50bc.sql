
-- Create storage bucket for concert programs
INSERT INTO storage.buckets (id, name, public)
VALUES ('programas-concerto', 'programas-concerto', true);

-- Create policy to allow users to upload their own programs
CREATE POLICY "Users can upload their own programs"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'programas-concerto' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create policy to allow users to view all programs
CREATE POLICY "Anyone can view programs"
ON storage.objects
FOR SELECT
USING (bucket_id = 'programas-concerto');

-- Create policy to allow users to update their own programs
CREATE POLICY "Users can update their own programs"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'programas-concerto' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create policy to allow users to delete their own programs
CREATE POLICY "Users can delete their own programs"
ON storage.objects
FOR DELETE
USING (bucket_id = 'programas-concerto' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Add column to store the program file path in performances table
ALTER TABLE performances ADD COLUMN programa_arquivo_url TEXT;
