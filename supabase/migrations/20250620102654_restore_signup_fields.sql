-- Add new fields to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS instituicao TEXT,
ADD COLUMN IF NOT EXISTS setor TEXT,
ADD COLUMN IF NOT EXISTS instrumento TEXT;

-- Update function to handle new user signup with additional metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, name, email, role, instituicao, setor, instrumento)
    VALUES (
        NEW.id,
        NEW.raw_user_meta_data->>'name',
        NEW.email,
        NEW.raw_user_meta_data->>'funcao', -- Use 'funcao' from metadata as the role
        NEW.raw_user_meta_data->>'instituicao',
        NEW.raw_user_meta_data->>'setor',
        NEW.raw_user_meta_data->>'instrumento'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Re-apply the trigger to ensure it uses the updated function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();




