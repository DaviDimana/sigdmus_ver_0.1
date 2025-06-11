
-- Adicionar os novos campos na tabela partituras
ALTER TABLE public.partituras 
ADD COLUMN instituicao text,
ADD COLUMN observacoes text;
