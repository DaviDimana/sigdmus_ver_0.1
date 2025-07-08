-- 20240708_create_partituras.sql
CREATE TABLE public.partituras (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  setor text,
  titulo text,
  compositor text,
  instrumentos text,
  tonalidade text,
  genero text,
  edicao text,
  ano_edicao int4,
  ano_aquisicao int4,
  digitalizado bool DEFAULT false,
  numero_armario text,
  numero_prateleira text,
  numero_pasta text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  instituicao text,
  observacoes text,
  pdf_urls jsonb DEFAULT '[]'::jsonb
);