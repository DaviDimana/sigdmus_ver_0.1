-- Adicionar coluna avatar_url na tabela user_profiles
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Criar bucket para avatars se não existir
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Remover políticas existentes se existirem e recriar
DROP POLICY IF EXISTS "Users can upload their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Public avatar access" ON storage.objects;

-- Criar política para permitir que usuários façam upload de seus próprios avatars
-- A política agora verifica se o primeiro segmento do caminho é o ID do usuário
CREATE POLICY "Users can upload their own avatar" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (string_to_array(name, '/'))[1]
);

-- Política para permitir que usuários vejam seus próprios avatars
CREATE POLICY "Users can view their own avatar" 
ON storage.objects 
FOR SELECT 
USING (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (string_to_array(name, '/'))[1]
);

-- Política para permitir que usuários atualizem seus próprios avatars
CREATE POLICY "Users can update their own avatar" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (string_to_array(name, '/'))[1]
);

-- Política para permitir acesso público de leitura aos avatars
CREATE POLICY "Public avatar access" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'avatars');
