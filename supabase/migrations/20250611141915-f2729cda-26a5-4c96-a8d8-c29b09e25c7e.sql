
-- Criar tabela para instituições
CREATE TABLE public.instituicoes (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome text NOT NULL UNIQUE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Criar tabela para setores  
CREATE TABLE public.setores (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome text NOT NULL UNIQUE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Inserir setores padrão
INSERT INTO public.setores (nome) VALUES 
('ACERVO_OSUFBA'),
('ACERVO_SCHWEBEL'), 
('ACERVO_PIERO'),
('ACERVO_PINO'),
('ACERVO_WIDMER'),
('MEMORIAL_LINDENBERG_CARDOSO'),
('COMPOSITORES_DA_BAHIA'),
('ACERVO_OSBA');

-- Criar enum para funções
CREATE TYPE public.funcao_usuario AS ENUM (
  'MUSICO',
  'ESTUDANTE', 
  'PROFESSOR',
  'MAESTRO',
  'ARQUIVISTA',
  'GERENTE'
);

-- Criar enum para instrumentos
CREATE TYPE public.instrumento_tipo AS ENUM (
  'FLAUTA',
  'OBOÉ', 
  'CLARINETE',
  'FAGOTE',
  'TROMPA',
  'TROMPETE',
  'TROMBONE',
  'TUBA',
  'VIOLINO_I',
  'VIOLINO_II',
  'VIOLA',
  'VIOLONCELO',
  'CONTRABAIXO',
  'HARPA',
  'PIANO',
  'PERCUSSAO',
  'SOPRANO',
  'CONTRALTO',
  'TENOR',
  'BAIXO'
);

-- Criar tabela para solicitações de cadastro
CREATE TABLE public.solicitacoes_cadastro (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome text NOT NULL,
  email text NOT NULL,
  instituicao text NOT NULL,
  setor text NOT NULL,
  funcao funcao_usuario NOT NULL,
  instrumento instrumento_tipo,
  telefone text NOT NULL,
  status text NOT NULL DEFAULT 'pendente',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Atualizar tabela user_profiles para incluir novos campos
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS instituicao text,
ADD COLUMN IF NOT EXISTS telefone text,
ADD COLUMN IF NOT EXISTS status text DEFAULT 'ativo',
ADD COLUMN IF NOT EXISTS funcao funcao_usuario;

-- Atualizar enum de role para incluir novas funções
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'ESTUDANTE';
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'PROFESSOR';
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'MAESTRO';

-- RLS para solicitações de cadastro (apenas admins podem ver)
ALTER TABLE public.solicitacoes_cadastro ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage signup requests" 
ON public.solicitacoes_cadastro 
FOR ALL 
USING (get_user_role() = 'ADMIN');

-- RLS para instituições e setores
ALTER TABLE public.instituicoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.setores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view instituicoes" 
ON public.instituicoes 
FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Admins can manage instituicoes" 
ON public.instituicoes 
FOR ALL 
USING (get_user_role() = 'ADMIN');

CREATE POLICY "Anyone can view setores" 
ON public.setores 
FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Admins can manage setores" 
ON public.setores 
FOR ALL 
USING (get_user_role() = 'ADMIN');
