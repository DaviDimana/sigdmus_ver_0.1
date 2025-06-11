
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
    console.log('=== useAuthState: Starting initialization ===');
    
    let mounted = true;

    // Initialize auth state
    const initializeAuth = async () => {
      try {
        console.log('useAuthState: Checking for existing session...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (!mounted) return;

        if (error) {
          console.error('useAuthState: Session error:', error);
          setAuthState({
            user: null,
            session: null,
            profile: null,
            loading: false
          });
          return;
        }

        if (session?.user) {
          console.log('useAuthState: Found existing session for:', session.user.email);
          
          // Set initial auth state with session
          setAuthState(prev => ({
            ...prev,
            session,
            user: session.user,
            loading: true // Keep loading while fetching profile
          }));

          // Fetch user profile
          try {
            const { data: profile } = await supabase
              .from('user_profiles')
              .select('*')
              .eq('id', session.user.id)
              .maybeSingle();

            if (!mounted) return;

            console.log('useAuthState: Profile fetched:', !!profile);
            setAuthState(prev => ({
              ...prev,
              profile: profile || null,
              loading: false
            }));
          } catch (profileError) {
            console.error('useAuthState: Profile fetch error:', profileError);
            if (!mounted) return;
            setAuthState(prev => ({ 
              ...prev, 
              profile: null,
              loading: false 
            }));
          }
        } else {
          console.log('useAuthState: No existing session found');
          setAuthState({
            user: null,
            session: null,
            profile: null,
            loading: false
          });
        }
      } catch (error) {
        console.error('useAuthState: Initialization error:', error);
        if (!mounted) return;
        setAuthState({
          user: null,
          session: null,
          profile: null,
          loading: false
        });
      }
    };

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('useAuthState: Auth state change:', event, !!session);
        
        if (!mounted) return;

        if (event === 'SIGNED_OUT' || !session) {
          console.log('useAuthState: User signed out or no session');
          setAuthState({
            user: null,
            session: null,
            profile: null,
            loading: false
          });
          return;
        }

        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          console.log('useAuthState: User signed in or token refreshed');
          
          setAuthState(prev => ({
            ...prev,
            session,
            user: session.user,
            loading: true
          }));

          // Fetch profile in a timeout to avoid deadlocks
          setTimeout(async () => {
            if (!mounted) return;
            
            try {
              const { data: profile } = await supabase
                .from('user_profiles')
                .select('*')
                .eq('id', session.user.id)
                .maybeSingle();

              if (!mounted) return;

              console.log('useAuthState: Profile fetched in auth change:', !!profile);
              setAuthState(prev => ({
                ...prev,
                profile: profile || null,
                loading: false
              }));
            } catch (error) {
              console.error('useAuthState: Profile fetch error in auth change:', error);
              if (!mounted) return;
              setAuthState(prev => ({ ...prev, loading: false }));
            }
          }, 100);
        }
      }
    );

    // Start initialization
    initializeAuth();

    return () => {
      console.log('useAuthState: Cleanup');
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return { authState, setAuthState };
};
