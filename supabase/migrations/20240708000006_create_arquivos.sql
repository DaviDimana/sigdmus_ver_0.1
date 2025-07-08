-- 20240707_create_arquivos.sql
CREATE TABLE public.arquivos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text,
  tipo text,
  tamanho text,
  categoria text,
  obra text,
  partitura_id uuid REFERENCES public.partituras(id) ON DELETE SET NULL,
  performance_id uuid REFERENCES public.performances(id) ON DELETE SET NULL,
  aquisicao_at date,
  download_url text,
  digitalizado bool DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  usuario_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  instituicao text,
  observacoes text,
  url text
);