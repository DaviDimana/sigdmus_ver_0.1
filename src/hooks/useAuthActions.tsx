
import { supabase } from '@/integrations/supabase/client';
import type { UserProfile, AuthState } from '@/types/auth';

export const useAuthActions = (
  authState: AuthState, 
  setAuthState: React.Dispatch<React.SetStateAction<AuthState>>
) => {
  const signIn = async (email: string, password: string) => {
    console.log('useAuthActions: Starting sign in for:', email);
    
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
      
      console.log('useAuthActions: Sign in successful');
      return data;
    } catch (error) {
      console.error('useAuthActions: Sign in failed:', error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    console.log('useAuthActions: Starting sign up for:', email);
    
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
      
      console.log('useAuthActions: Sign up successful');
      return data;
    } catch (error) {
      console.error('useAuthActions: Sign up failed:', error);
      throw error;
    }
  };

  const signOut = async () => {
    console.log('useAuthActions: Starting sign out');
    
    try {
      const { error } = await supabase.auth.signOut({ scope: 'global' });
      if (error) {
        console.error('useAuthActions: Sign out error:', error);
        throw error;
      }
      
      console.log('useAuthActions: Sign out successful');
      
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
    console.log('useAuthActions: Updating profile:', updates);
    
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

      console.log('useAuthActions: Existing profile:', !!existingProfile);

      let result;

      if (!existingProfile) {
        // Create new profile
        console.log('useAuthActions: Creating new profile');
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
        console.log('useAuthActions: Updating existing profile');
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

      console.log('useAuthActions: Profile update successful');

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
    if (!authState.profile) return false;
    if (authState.profile.role === 'ADMIN') return true;
    if (authState.profile.role === 'GERENTE') return authState.profile.setor === sector;
    return true; // ARQUIVISTA e MUSICO podem ver todos os setores
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
