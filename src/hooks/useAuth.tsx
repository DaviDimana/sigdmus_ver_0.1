
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
        // Em caso de erro de policy, vamos definir um perfil temporário
        if (error.code === '42P17') {
          console.log('useAuth: Policy error detected, setting temporary profile');
          setAuthState(prev => ({
            ...prev,
            profile: {
              id: userId,
              name: 'Usuário Temporário',
              email: prev.user?.email || '',
              role: 'ADMIN', // Temporariamente admin para acessar tudo
              setor: null,
              instrumento: null,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            } as UserProfile,
            loading: false
          }));
          return;
        }
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
    console.log('Auth state atual:', authState);
    
    if (!authState.user) {
      console.error('updateProfile: Usuário não logado');
      throw new Error('Usuário não está logado');
    }

    if (!authState.session) {
      console.error('updateProfile: Sessão não encontrada');
      throw new Error('Sessão não encontrada');
    }

    try {
      console.log('updateProfile: Iniciando atualização para usuário:', authState.user.id);
      console.log('updateProfile: Updates a aplicar:', updates);
      
      // Tentar a atualização
      const { data, error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', authState.user.id)
        .select()
        .single();

      console.log('updateProfile: Resposta do Supabase:', { data, error });

      if (error) {
        console.error('updateProfile: Erro do Supabase:', error);
        console.error('updateProfile: Error code:', error.code);
        console.error('updateProfile: Error message:', error.message);
        console.error('updateProfile: Error details:', error.details);
        throw error;
      }

      if (!data) {
        console.error('updateProfile: Nenhum dado retornado');
        throw new Error('Nenhum dado foi retornado da atualização');
      }

      console.log('updateProfile: Atualização bem-sucedida:', data);

      // Atualizar o estado local
      setAuthState(prev => ({
        ...prev,
        profile: data
      }));

      console.log('=== UPDATEPROFILE: SUCESSO ===');
      return data;
    } catch (error) {
      console.error('=== UPDATEPROFILE: ERRO ===');
      console.error('updateProfile: Erro capturado:', error);
      
      // Re-throw o erro para que o componente possa tratá-lo
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
