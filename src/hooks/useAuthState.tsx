
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
    console.log('=== useAuthState: Initializing auth listener ===');
    
    let mounted = true;

    const initializeAuth = async () => {
      try {
        // Get initial session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('useAuthState: Error getting initial session:', error);
        }

        console.log('useAuthState: Initial session:', session?.user?.email || 'No session');

        if (!mounted) return;

        // Update state with initial session
        if (session?.user) {
          setAuthState(prev => ({
            ...prev,
            session,
            user: session.user,
            loading: false // Will be set to true again if we need to fetch profile
          }));

          // Try to fetch profile
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
          } catch (profileError) {
            console.log('useAuthState: Profile fetch failed:', profileError);
            if (!mounted) return;
            setAuthState(prev => ({ ...prev, loading: false }));
          }
        } else {
          // No session - stop loading
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

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('useAuthState: Auth event:', event, session?.user?.email || 'No session');
        
        if (!mounted) return;

        // Update session and user immediately
        setAuthState(prev => ({
          ...prev,
          session,
          user: session?.user ?? null,
        }));

        // Handle different auth events
        if (event === 'SIGNED_OUT' || !session?.user) {
          console.log('useAuthState: User signed out or no session');
          setAuthState(prev => ({
            ...prev,
            profile: null,
            loading: false
          }));
          return;
        }

        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          // Defer profile fetching to avoid deadlocks
          setTimeout(async () => {
            if (!mounted) return;
            
            try {
              console.log('useAuthState: Fetching profile for user...');
              const { data: profile } = await supabase
                .from('user_profiles')
                .select('*')
                .eq('id', session.user.id)
                .maybeSingle();

              if (!mounted) return;

              console.log('useAuthState: Profile fetched:', profile);
              setAuthState(prev => ({
                ...prev,
                profile: profile || null,
                loading: false
              }));
            } catch (error) {
              console.log('useAuthState: Profile fetch failed:', error);
              if (!mounted) return;
              setAuthState(prev => ({ ...prev, loading: false }));
            }
          }, 0);
        }
      }
    );

    // Initialize auth state
    initializeAuth();

    return () => {
      console.log('useAuthState: Cleaning up subscription');
      mounted = false;
      subscription.unsubscribe();
    };
  }, []); // Empty dependency array - only run once

  return { authState, setAuthState };
};
