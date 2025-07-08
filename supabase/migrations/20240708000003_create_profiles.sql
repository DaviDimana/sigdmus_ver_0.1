-- 20240708_create_profiles.sql
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  name text,
  email text,
  role text DEFAULT 'MUSICO'::text,
  avatar_url text,
  created_at timestamptz DEFAULT timezone('utc', now()),
  updated_at timestamptz DEFAULT timezone('utc', now()),
  funcao text
);