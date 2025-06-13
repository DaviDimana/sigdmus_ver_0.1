
-- Permitir inserções públicas na tabela instituicoes
CREATE POLICY "Allow public inserts on instituicoes" 
ON public.instituicoes 
FOR INSERT 
TO anon
WITH CHECK (true);

-- Permitir inserções públicas na tabela setores
CREATE POLICY "Allow public inserts on setores" 
ON public.setores 
FOR INSERT 
TO anon
WITH CHECK (true);

-- Permitir leitura pública das tabelas para usuários não autenticados
CREATE POLICY "Allow public select on instituicoes" 
ON public.instituicoes 
FOR SELECT 
TO anon
USING (true);

CREATE POLICY "Allow public select on setores" 
ON public.setores 
FOR SELECT 
TO anon
USING (true);
