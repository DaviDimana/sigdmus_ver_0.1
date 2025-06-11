
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

export type UserProfile = Tables<'user_profiles'>;

interface AuthState {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    profile: null,
    loading: true
  });

  useEffect(() => {
    console.log('=== useAuth: Setting up auth listener ===');
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('useAuth: Auth event:', event, session?.user?.email);
        
        setAuthState(prev => ({
          ...prev,
          session,
          user: session?.user ?? null,
        }));

        // Defer profile fetching to prevent deadlocks
        if (session?.user) {
          console.log('useAuth: User found, fetching profile...');
          setTimeout(() => {
            fetchUserProfile(session.user.id);
          }, 0);
        } else {
          console.log('useAuth: No user, clearing profile');
          setAuthState(prev => ({
            ...prev,
            profile: null,
            loading: false
          }));
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('useAuth: Initial session check:', session?.user?.email);
      
      setAuthState(prev => ({
        ...prev,
        session,
        user: session?.user ?? null,
      }));

      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setAuthState(prev => ({ ...prev, loading: false }));
      }
    });

    return () => {
      console.log('useAuth: Cleaning up subscription');
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (userId: string) => {
    console.log('useAuth: Fetching profile for user:', userId);
    
    try {
      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('useAuth: Error fetching profile:', error);
        setAuthState(prev => ({
          ...prev,
          profile: null,
          loading: false
        }));
        return;
      }

      console.log('useAuth: Profile fetched:', profile);
      
      setAuthState(prev => ({
        ...prev,
        profile: profile || null,
        loading: false
      }));
    } catch (error) {
      console.error('useAuth: Error fetching profile:', error);
      setAuthState(prev => ({ ...prev, loading: false }));
    }
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  };

  const signUp = async (email: string, password: string, name: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });

    if (error) throw error;
    return data;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut({ scope: 'global' });
    if (error) throw error;
    
    // Force page reload for clean state
    window.location.href = '/auth';
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    console.log('=== UPDATEPROFILE: INÍCIO ===');
    console.log('Updates recebidos:', updates);
    
    if (!authState.user) {
      console.error('updateProfile: Usuário não logado');
      throw new Error('Usuário não está logado');
    }

    try {
      console.log('updateProfile: Atualizando perfil para usuário:', authState.user.id);
      
      // Check if profile exists first
      const { data: existingProfile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', authState.user.id)
        .maybeSingle();

      console.log('updateProfile: Perfil existente:', existingProfile);

      let result;

      if (!existingProfile) {
        // Create new profile
        console.log('updateProfile: Criando novo perfil');
        const newProfile = {
          id: authState.user.id,
          name: updates.name || 'Usuário',
          email: authState.user.email || '',
          role: 'MUSICO' as const,
          setor: updates.setor || null,
          instrumento: updates.instrumento || null,
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
        console.log('updateProfile: Atualizando perfil existente');
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

      console.log('updateProfile: Sucesso:', result);

      setAuthState(prev => ({
        ...prev,
        profile: result
      }));

      console.log('=== UPDATEPROFILE: SUCESSO ===');
      return result;
    } catch (error) {
      console.error('=== UPDATEPROFILE: ERRO ===');
      console.error('updateProfile: Erro capturado:', error);
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
    ...authState,
    signIn,
    signUp,
    signOut,
    updateProfile,
    hasRole,
    canAccessSector,
  };
};
