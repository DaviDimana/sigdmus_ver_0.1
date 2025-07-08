-- 20240708_create_user_profiles.sql
CREATE TABLE public.user_profiles (
  id uuid PRIMARY KEY,
  name text,
  email text,
  role_user_role text,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  role text DEFAULT 'MUSICO'::text,
  instituicao text,
  setor text,
  instrumento text,
  status text,
  telefone text
);