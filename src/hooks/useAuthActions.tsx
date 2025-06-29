import { supabase } from '@/integrations/supabase/client';
import type { UserProfile, AuthState } from '@/types/auth';

export const useAuthActions = (
  authState: AuthState, 
  setAuthState: React.Dispatch<React.SetStateAction<AuthState>>
) => {
  const signIn = async (email: string, password: string) => {
    try {
      // Clear any existing session first
      await supabase.auth.signOut({ scope: 'global' });
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('useAuthActions: Sign in error:', error);
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error('useAuthActions: Sign in failed:', error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });

      if (error) {
        console.error('useAuthActions: Sign up error:', error);
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error('useAuthActions: Sign up failed:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut({ scope: 'global' });
      if (error) {
        console.error('useAuthActions: Sign out error:', error);
        throw error;
      }
      
      // Clear local state immediately
      setAuthState({
        user: null,
        session: null,
        profile: null,
        loading: false
      });
    } catch (error) {
      console.error('useAuthActions: Sign out failed:', error);
      // Clear state even if signOut fails
      setAuthState({
        user: null,
        session: null,
        profile: null,
        loading: false
      });
      throw error;
    }
  };

  const updateProfile = async (updates: any) => {
    if (!authState.user) {
      console.error('useAuthActions: No user to update profile for');
      throw new Error('Usuário não está logado');
    }

    try {
      // Try to get existing profile first
      const { data: existingProfile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', authState.user.id)
        .maybeSingle();

      let result;

      if (!existingProfile) {
        // Create new profile
        const newProfile = {
          id: authState.user.id,
          name: updates.name || authState.user.user_metadata?.name || 'Usuário',
          email: authState.user.email || '',
          role: 'MUSICO' as const,
          setor: updates.setor || null,
          instrumento: updates.instrumento || null,
          telefone: updates.telefone || null,
          instituicao: updates.instituicao || null,
          avatar_url: updates.avatar_url || null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        const { data, error } = await supabase
          .from('user_profiles')
          .insert(newProfile)
          .select()
          .single();

        if (error) throw error;
        result = data;
      } else {
        // Update existing profile
        const finalUpdates = {
          ...updates,
          updated_at: new Date().toISOString()
        };

        const { data, error } = await supabase
          .from('user_profiles')
          .update(finalUpdates)
          .eq('id', authState.user.id)
          .select()
          .single();

        if (error) throw error;
        result = data;
      }

      setAuthState(prev => ({
        ...prev,
        profile: result
      }));

      return result;
    } catch (error) {
      console.error('useAuthActions: Profile update error:', error);
      throw error;
    }
  };

  const hasRole = (role: UserProfile['role']) => {
    return authState.profile?.role === role;
  };

  const canAccessSector = (sector: UserProfile['setor']) => {
    // Removendo verificação de role - qualquer usuário pode acessar qualquer setor
    return true;
  };

  return {
    signIn,
    signUp,
    signOut,
    updateProfile,
    hasRole,
    canAccessSector,
  };
};
