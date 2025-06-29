-- Migração para remover todas as restrições baseadas em roles
-- Permitindo que qualquer usuário autenticado tenha acesso total

-- 1. Remover políticas RLS baseadas em roles para solicitacoes_cadastro
DROP POLICY IF EXISTS "Admins can manage signup requests" ON public.solicitacoes_cadastro;

-- Criar nova política que permite qualquer usuário autenticado gerenciar solicitações
CREATE POLICY "Authenticated users can manage signup requests" 
ON public.solicitacoes_cadastro 
FOR ALL 
USING (auth.role() = 'authenticated');

-- 2. Remover políticas RLS baseadas em roles para instituicoes
DROP POLICY IF EXISTS "Admins can manage instituicoes" ON public.instituicoes;

-- Criar nova política que permite qualquer usuário autenticado gerenciar instituições
CREATE POLICY "Authenticated users can manage instituicoes" 
ON public.instituicoes 
FOR ALL 
USING (auth.role() = 'authenticated');

-- 3. Remover políticas RLS baseadas em roles para setores
DROP POLICY IF EXISTS "Admins can manage setores" ON public.setores;

-- Criar nova política que permite qualquer usuário autenticado gerenciar setores
CREATE POLICY "Authenticated users can manage setores" 
ON public.setores 
FOR ALL 
USING (auth.role() = 'authenticated');

-- 4. Remover políticas RLS baseadas em roles para user_profiles
-- Permitir que qualquer usuário autenticado veja todos os perfis
DROP POLICY IF EXISTS "Users can view their own profile" ON public.user_profiles;
CREATE POLICY "Authenticated users can view all profiles" 
ON public.user_profiles 
FOR SELECT 
USING (auth.role() = 'authenticated');

-- Permitir que qualquer usuário autenticado atualize qualquer perfil
DROP POLICY IF EXISTS "Users can update their own profile" ON public.user_profiles;
CREATE POLICY "Authenticated users can update any profile" 
ON public.user_profiles 
FOR UPDATE 
USING (auth.role() = 'authenticated');

-- Permitir que qualquer usuário autenticado insira perfis
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.user_profiles;
CREATE POLICY "Authenticated users can insert profiles" 
ON public.user_profiles 
FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

-- 5. Remover políticas RLS baseadas em roles para partituras (se existir)
-- Permitir que qualquer usuário autenticado gerencie partituras
DROP POLICY IF EXISTS "Users can manage their own partituras" ON public.partituras;
DROP POLICY IF EXISTS "Admins can manage all partituras" ON public.partituras;

CREATE POLICY "Authenticated users can manage partituras" 
ON public.partituras 
FOR ALL 
USING (auth.role() = 'authenticated');

-- 6. Remover políticas RLS baseadas em roles para performances (se existir)
-- Permitir que qualquer usuário autenticado gerencie performances
DROP POLICY IF EXISTS "Users can manage their own performances" ON public.performances;
DROP POLICY IF EXISTS "Admins can manage all performances" ON public.performances;

CREATE POLICY "Authenticated users can manage performances" 
ON public.performances 
FOR ALL 
USING (auth.role() = 'authenticated');

-- 7. Remover políticas RLS baseadas em roles para arquivos (se existir)
-- Permitir que qualquer usuário autenticado gerencie arquivos
DROP POLICY IF EXISTS "Users can manage their own arquivos" ON public.arquivos;
DROP POLICY IF EXISTS "Admins can manage all arquivos" ON public.arquivos;

CREATE POLICY "Authenticated users can manage arquivos" 
ON public.arquivos 
FOR ALL 
USING (auth.role() = 'authenticated');

-- 8. Remover políticas RLS baseadas em roles para programas (se existir)
-- Permitir que qualquer usuário autenticado gerencie programas
DROP POLICY IF EXISTS "Users can manage their own programs" ON public.programas;
DROP POLICY IF EXISTS "Admins can manage all programs" ON public.programas;

CREATE POLICY "Authenticated users can manage programs" 
ON public.programas 
FOR ALL 
USING (auth.role() = 'authenticated');

-- 9. Atualizar políticas de storage para permitir acesso total
-- Permitir que qualquer usuário autenticado acesse todos os buckets
DROP POLICY IF EXISTS "Users can upload their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own avatar" ON storage.objects;

-- Criar políticas que permitem qualquer usuário autenticado gerenciar storage
CREATE POLICY "Authenticated users can manage storage" 
ON storage.objects 
FOR ALL 
USING (auth.role() = 'authenticated');

-- 10. Permitir acesso público para leitura de avatars (mantendo compatibilidade)
CREATE POLICY "Public avatar access" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'avatars');

-- Comentário: Todas as restrições baseadas em roles foram removidas.
-- Agora qualquer usuário autenticado tem acesso total a todas as funcionalidades. 