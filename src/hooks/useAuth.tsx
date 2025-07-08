import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

interface Profile {
  id: string;
  name: string;
  role_user_role: string;
  email: string;
  avatar_url?: string;
  instituicao?: string | null;
  setor?: string | null;
  // adicione outros campos se necessário
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const lastFetchedUserId = useRef<string | null>(null);
  const isInitialized = useRef(false);

  useEffect(() => {
    let isMounted = true;
    
    const initializeAuth = async () => {
      try {
        console.log('Initializing auth...');
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          if (isMounted) {
            setError(sessionError.message);
            setLoading(false);
          }
          return;
        }

        if (isMounted) {
          setUser(session?.user ?? null);
          
          if (session?.user) {
            if (lastFetchedUserId.current !== session.user.id) {
              lastFetchedUserId.current = session.user.id;
              await fetchProfile(session.user.id);
            } else {
              setLoading(false);
            }
          } else {
            setProfile(null);
            setLoading(false);
          }
        }
      } catch (error: any) {
        console.error('Error initializing auth:', error);
        if (isMounted) {
          setError(error.message || 'Erro ao inicializar autenticação');
          setLoading(false);
        }
      }
    };

    if (!isInitialized.current) {
      isInitialized.current = true;
      initializeAuth();
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.id);
      
      if (!isMounted) return;
      
      setUser(session?.user ?? null);
      
      if (session?.user) {
        if (lastFetchedUserId.current !== session.user.id) {
          lastFetchedUserId.current = session.user.id;
          await fetchProfile(session.user.id);
        } else {
          setLoading(false);
        }
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (userId: string) => {
    if (!userId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      console.log('Fetching profile for user:', userId);
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (error) {
        if (error.code === 'PGRST116') {
          console.log('Profile not found for user:', userId);
          setProfile(null);
          setError('Perfil não encontrado.');
        } else {
          console.error('Error fetching profile:', error);
          setProfile(null);
          setError(error.message || 'Erro ao buscar perfil.');
        }
      } else {
        console.log('Profile fetched successfully:', data);
        setProfile(data);
        setError(null);
      }
    } catch (error: any) {
      console.error('Error in fetchProfile:', error);
      setError(error.message || 'Erro inesperado ao buscar perfil.');
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, metadata: object) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata
        }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      setProfile(null);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  return {
    user,
    profile,
    loading,
    error,
    setProfile,
    fetchProfile,
    signIn,
    signUp,
    signOut,
  };
};
