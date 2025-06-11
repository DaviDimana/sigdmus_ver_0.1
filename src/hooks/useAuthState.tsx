
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { AuthState } from '@/types/auth';

export const useAuthState = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    profile: null,
    loading: true
  });

  useEffect(() => {
    console.log('=== useAuthState: Setting up auth listener ===');
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('useAuthState: Auth event:', event, session?.user?.email);
        
        setAuthState(prev => ({
          ...prev,
          session,
          user: session?.user ?? null,
        }));

        // Clear profile if no session
        if (!session?.user) {
          console.log('useAuthState: No user, clearing profile');
          setAuthState(prev => ({
            ...prev,
            profile: null,
            loading: false
          }));
          return;
        }

        // Try to fetch profile, but don't fail if RLS blocks it
        try {
          console.log('useAuthState: User found, fetching profile...');
          const { data: profile, error } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle();

          if (error) {
            console.log('useAuthState: Profile fetch error (continuing anyway):', error.message);
          }

          console.log('useAuthState: Profile fetched:', profile);
          
          setAuthState(prev => ({
            ...prev,
            profile: profile || null,
            loading: false
          }));
        } catch (error) {
          console.log('useAuthState: Profile fetch failed (continuing anyway):', error);
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
      console.log('useAuthState: Initial session check:', session?.user?.email);
      
      setAuthState(prev => ({
        ...prev,
        session,
        user: session?.user ?? null,
      }));

      if (!session?.user) {
        setAuthState(prev => ({ ...prev, loading: false }));
      }
    });

    return () => {
      console.log('useAuthState: Cleaning up subscription');
      subscription.unsubscribe();
    };
  }, []);

  return { authState, setAuthState };
};
