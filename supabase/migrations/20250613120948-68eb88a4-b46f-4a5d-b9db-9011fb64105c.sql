
-- Permitir inserções públicas na tabela solicitacoes_cadastro
CREATE POLICY "Allow public inserts on solicitacoes_cadastro" 
ON public.solicitacoes_cadastro 
FOR INSERT 
TO anon
WITH CHECK (true);
