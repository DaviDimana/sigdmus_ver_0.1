-- Migração para corrigir políticas RLS e permitir acesso total
-- Removendo todas as restrições baseadas em roles

-- 1. Desabilitar RLS temporariamente para debug
ALTER TABLE public.user_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.partituras DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.performances DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.arquivos DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.programas DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.instituicoes DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.setores DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.solicitacoes_cadastro DISABLE ROW LEVEL SECURITY;

-- 2. Reabilitar RLS com políticas simples
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partituras ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.performances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.arquivos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.programas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.instituicoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.setores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.solicitacoes_cadastro ENABLE ROW LEVEL SECURITY;

-- 3. Criar políticas que permitem qualquer usuário autenticado
-- user_profiles
CREATE POLICY "Allow all authenticated users" ON public.user_profiles
FOR ALL USING (auth.role() = 'authenticated');

-- partituras
CREATE POLICY "Allow all authenticated users" ON public.partituras
FOR ALL USING (auth.role() = 'authenticated');

-- performances
CREATE POLICY "Allow all authenticated users" ON public.performances
FOR ALL USING (auth.role() = 'authenticated');

-- arquivos
CREATE POLICY "Allow all authenticated users" ON public.arquivos
FOR ALL USING (auth.role() = 'authenticated');

-- programas
CREATE POLICY "Allow all authenticated users" ON public.programas
FOR ALL USING (auth.role() = 'authenticated');

-- instituicoes
CREATE POLICY "Allow all authenticated users" ON public.instituicoes
FOR ALL USING (auth.role() = 'authenticated');

-- setores
CREATE POLICY "Allow all authenticated users" ON public.setores
FOR ALL USING (auth.role() = 'authenticated');

-- solicitacoes_cadastro
CREATE POLICY "Allow all authenticated users" ON public.solicitacoes_cadastro
FOR ALL USING (auth.role() = 'authenticated');

-- 4. Políticas de storage
CREATE POLICY "Allow all authenticated users" ON storage.objects
FOR ALL USING (auth.role() = 'authenticated');

-- 5. Permitir acesso público para leitura de avatars
CREATE POLICY "Public avatar access" ON storage.objects
FOR SELECT USING (bucket_id = 'avatars'); 