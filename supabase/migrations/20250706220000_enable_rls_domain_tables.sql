-- Enable RLS and policies for domain tables

-- 1) Activate RLS
ALTER TABLE public.partituras  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.performances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.arquivos ENABLE ROW LEVEL SECURITY;

-- 2) Admin helper function
CREATE OR REPLACE FUNCTION public.is_admin(uid uuid)
RETURNS boolean
LANGUAGE sql STABLE AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_profiles WHERE id = uid AND role = 'ADMIN'
  );
$$;

-- 3) Clean previous policies if any
DROP POLICY IF EXISTS select_partituras   ON public.partituras;
DROP POLICY IF EXISTS insert_partituras   ON public.partituras;
DROP POLICY IF EXISTS update_partituras   ON public.partituras;
DROP POLICY IF EXISTS delete_partituras   ON public.partituras;

DROP POLICY IF EXISTS select_performances ON public.performances;
DROP POLICY IF EXISTS insert_performances ON public.performances;
DROP POLICY IF EXISTS update_performances ON public.performances;
DROP POLICY IF EXISTS delete_performances ON public.performances;

DROP POLICY IF EXISTS select_arquivos     ON public.arquivos;
DROP POLICY IF EXISTS insert_arquivos     ON public.arquivos;
DROP POLICY IF EXISTS update_arquivos     ON public.arquivos;
DROP POLICY IF EXISTS delete_arquivos     ON public.arquivos;

------------------------------------------------------------
-- PARTITURAS
------------------------------------------------------------
-- SELECT
CREATE POLICY select_partituras ON public.partituras
  FOR SELECT USING (
    public.is_admin(auth.uid()) OR
    EXISTS (
      SELECT 1 FROM public.user_profiles p
      WHERE p.id = auth.uid() AND (
            p.setor = partituras.setor OR
            p.instituicao = partituras.instituicao)
    )
  );

-- INSERT
CREATE POLICY insert_partituras ON public.partituras
  FOR INSERT WITH CHECK (
    public.is_admin(auth.uid()) OR
    EXISTS (
      SELECT 1 FROM public.user_profiles p
      WHERE p.id = auth.uid() AND (
            p.setor = partituras.setor OR
            p.instituicao = partituras.instituicao)
    )
  );

-- UPDATE
CREATE POLICY update_partituras ON public.partituras
  FOR UPDATE USING (
    public.is_admin(auth.uid()) OR
    EXISTS (
      SELECT 1 FROM public.user_profiles p
      WHERE p.id = auth.uid() AND (
            p.setor = partituras.setor OR
            p.instituicao = partituras.instituicao)
    )
  )
  WITH CHECK (
    public.is_admin(auth.uid()) OR
    EXISTS (
      SELECT 1 FROM public.user_profiles p
      WHERE p.id = auth.uid() AND (
            p.setor = partituras.setor OR
            p.instituicao = partituras.instituicao)
    )
  );

-- DELETE
CREATE POLICY delete_partituras ON public.partituras
  FOR DELETE USING (
    public.is_admin(auth.uid()) OR
    EXISTS (
      SELECT 1 FROM public.user_profiles p
      WHERE p.id = auth.uid() AND (
            p.setor = partituras.setor OR
            p.instituicao = partituras.instituicao)
    )
  );

------------------------------------------------------------
-- PERFORMANCES (deriva setor/instituicao da partitura)
------------------------------------------------------------
-- SELECT
CREATE POLICY select_performances ON public.performances
  FOR SELECT USING (
    public.is_admin(auth.uid()) OR
    EXISTS (
      SELECT 1
      FROM public.user_profiles p
      JOIN public.partituras pt ON pt.id = performances.partitura_id
      WHERE p.id = auth.uid() AND (
            p.setor = pt.setor OR
            p.instituicao = pt.instituicao)
    )
  );

-- INSERT
CREATE POLICY insert_performances ON public.performances
  FOR INSERT WITH CHECK (
    public.is_admin(auth.uid()) OR
    EXISTS (
      SELECT 1
      FROM public.user_profiles p
      JOIN public.partituras pt ON pt.id = performances.partitura_id
      WHERE p.id = auth.uid() AND (
            p.setor = pt.setor OR
            p.instituicao = pt.instituicao)
    )
  );

-- UPDATE
CREATE POLICY update_performances ON public.performances
  FOR UPDATE USING (
    public.is_admin(auth.uid()) OR
    EXISTS (
      SELECT 1
      FROM public.user_profiles p
      JOIN public.partituras pt ON pt.id = performances.partitura_id
      WHERE p.id = auth.uid() AND (
            p.setor = pt.setor OR
            p.instituicao = pt.instituicao)
    )
  )
  WITH CHECK (
    public.is_admin(auth.uid()) OR
    EXISTS (
      SELECT 1
      FROM public.user_profiles p
      JOIN public.partituras pt ON pt.id = performances.partitura_id
      WHERE p.id = auth.uid() AND (
            p.setor = pt.setor OR
            p.instituicao = pt.instituicao)
    )
  );

-- DELETE
CREATE POLICY delete_performances ON public.performances
  FOR DELETE USING (
    public.is_admin(auth.uid()) OR
    EXISTS (
      SELECT 1
      FROM public.user_profiles p
      JOIN public.partituras pt ON pt.id = performances.partitura_id
      WHERE p.id = auth.uid() AND (
            p.setor = pt.setor OR
            p.instituicao = pt.instituicao)
    )
  );

------------------------------------------------------------
-- ARQUIVOS (checa apenas instituicao)
------------------------------------------------------------
-- SELECT
CREATE POLICY select_arquivos ON public.arquivos
  FOR SELECT USING (
    public.is_admin(auth.uid()) OR
    EXISTS (
      SELECT 1 FROM public.user_profiles p
      WHERE p.id = auth.uid() AND p.instituicao = arquivos.instituicao
    )
  );

-- INSERT
CREATE POLICY insert_arquivos ON public.arquivos
  FOR INSERT WITH CHECK (
    public.is_admin(auth.uid()) OR
    EXISTS (
      SELECT 1 FROM public.user_profiles p
      WHERE p.id = auth.uid() AND p.instituicao = arquivos.instituicao
    )
  );

-- UPDATE
CREATE POLICY update_arquivos ON public.arquivos
  FOR UPDATE USING (
    public.is_admin(auth.uid()) OR
    EXISTS (
      SELECT 1 FROM public.user_profiles p
      WHERE p.id = auth.uid() AND p.instituicao = arquivos.instituicao
    )
  )
  WITH CHECK (
    public.is_admin(auth.uid()) OR
    EXISTS (
      SELECT 1 FROM public.user_profiles p
      WHERE p.id = auth.uid() AND p.instituicao = arquivos.instituicao
    )
  );

-- DELETE
CREATE POLICY delete_arquivos ON public.arquivos
  FOR DELETE USING (
    public.is_admin(auth.uid()) OR
    EXISTS (
      SELECT 1 FROM public.user_profiles p
      WHERE p.id = auth.uid() AND p.instituicao = arquivos.instituicao
    )
  ); 