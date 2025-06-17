
-- Inserir ou atualizar o perfil do usuário atual como ADMIN
-- Usando o email que aparece nos logs: davidimana123@gmail.com
INSERT INTO public.user_profiles (id, name, email, role, created_at, updated_at)
SELECT 
  au.id,
  COALESCE(au.raw_user_meta_data->>'name', 'Administrador') as name,
  au.email,
  'ADMIN'::user_role,
  now(),
  now()
FROM auth.users au 
WHERE au.email = 'davidimana123@gmail.com'
ON CONFLICT (id) 
DO UPDATE SET 
  role = 'ADMIN'::user_role,
  updated_at = now();

-- Para garantir que seja o primeiro usuário a ser admin
-- também podemos definir o primeiro usuário cadastrado como admin
UPDATE public.user_profiles 
SET role = 'ADMIN'::user_role, updated_at = now()
WHERE id = (
  SELECT id 
  FROM public.user_profiles 
  ORDER BY created_at ASC 
  LIMIT 1
);
