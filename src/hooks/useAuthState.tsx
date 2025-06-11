
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
    console.log('=== useAuthState: Initializing ===');
    
    let mounted = true;

    const initializeAuth = async () => {
      try {
        console.log('useAuthState: Getting initial session...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('useAuthState: Session error:', error);
        }

        if (!mounted) return;

        if (session?.user) {
          console.log('useAuthState: Found existing session for:', session.user.email);
          
          // Set user and session first
          setAuthState(prev => ({
            ...prev,
            session,
            user: session.user,
            loading: true // Keep loading while fetching profile
          }));

          // Fetch profile
          try {
            const { data: profile } = await supabase
              .from('user_profiles')
              .select('*')
              .eq('id', session.user.id)
              .maybeSingle();

            if (!mounted) return;

            console.log('useAuthState: Profile loaded:', !!profile);
            setAuthState(prev => ({
              ...prev,
              profile: profile || null,
              loading: false
            }));
          } catch (profileError) {
            console.error('useAuthState: Profile error:', profileError);
            if (!mounted) return;
            setAuthState(prev => ({ ...prev, loading: false }));
          }
        } else {
          console.log('useAuthState: No existing session found');
          setAuthState(prev => ({
            ...prev,
            session: null,
            user: null,
            profile: null,
            loading: false
          }));
        }
      } catch (error) {
        console.error('useAuthState: Initialization error:', error);
        if (!mounted) return;
        setAuthState(prev => ({ ...prev, loading: false }));
      }
    };

    // Set up auth listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('useAuthState: Auth event:', event, !!session);
        
        if (!mounted) return;

        if (event === 'SIGNED_OUT' || !session) {
          console.log('useAuthState: User signed out');
          setAuthState({
            user: null,
            session: null,
            profile: null,
            loading: false
          });
          return;
        }

        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          console.log('useAuthState: User signed in, updating state');
          
          setAuthState(prev => ({
            ...prev,
            session,
            user: session.user,
            loading: true
          }));

          // Fetch profile after a short delay to avoid conflicts
          setTimeout(async () => {
            if (!mounted) return;
            
            try {
              const { data: profile } = await supabase
                .from('user_profiles')
                .select('*')
                .eq('id', session.user.id)
                .maybeSingle();

              if (!mounted) return;

              setAuthState(prev => ({
                ...prev,
                profile: profile || null,
                loading: false
              }));
            } catch (error) {
              console.error('useAuthState: Profile fetch error:', error);
              if (!mounted) return;
              setAuthState(prev => ({ ...prev, loading: false }));
            }
          }, 100);
        }
      }
    );

    // Initialize
    initializeAuth();

    return () => {
      console.log('useAuthState: Cleanup');
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return { authState, setAuthState };
};
