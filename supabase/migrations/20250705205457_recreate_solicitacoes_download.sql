-- Corrigir foreign keys para exclusão em cascata
-- Primeiro, remover as foreign keys existentes
ALTER TABLE public.performances DROP CONSTRAINT IF EXISTS performances_partitura_id_fkey;
ALTER TABLE public.arquivos DROP CONSTRAINT IF EXISTS arquivos_partitura_id_fkey;
ALTER TABLE public.arquivos DROP CONSTRAINT IF EXISTS arquivos_performance_id_fkey;

-- Recriar as foreign keys com CASCADE apropriado
ALTER TABLE public.performances 
ADD CONSTRAINT performances_partitura_id_fkey 
FOREIGN KEY (partitura_id) REFERENCES public.partituras(id) ON DELETE CASCADE;

ALTER TABLE public.arquivos 
ADD CONSTRAINT arquivos_partitura_id_fkey 
FOREIGN KEY (partitura_id) REFERENCES public.partituras(id) ON DELETE CASCADE;

ALTER TABLE public.arquivos 
ADD CONSTRAINT arquivos_performance_id_fkey 
FOREIGN KEY (performance_id) REFERENCES public.performances(id) ON DELETE CASCADE;

-- Adicionar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_performances_partitura_id ON public.performances(partitura_id);
CREATE INDEX IF NOT EXISTS idx_arquivos_partitura_id ON public.arquivos(partitura_id);
CREATE INDEX IF NOT EXISTS idx_arquivos_performance_id ON public.arquivos(performance_id);
