-- 20240708_create_performances.sql
CREATE TABLE public.performances (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partitura_id uuid REFERENCES public.partituras(id) ON DELETE CASCADE,
  local text,
  data date,
  horario time,
  maestros text,
  interpretes text,
  release text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  programa_anotado text
);