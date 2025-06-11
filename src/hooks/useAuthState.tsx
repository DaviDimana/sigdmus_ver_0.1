
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
        
        // Update session and user immediately
        setAuthState(prev => ({
          ...prev,
          session,
          user: session?.user ?? null,
        }));

        // If no session, clear everything and stop loading
        if (!session?.user) {
          console.log('useAuthState: No user, clearing profile and stopping loading');
          setAuthState(prev => ({
            ...prev,
            profile: null,
            loading: false
          }));
          return;
        }

        // Try to fetch profile for authenticated users
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

    // Check for existing session
    const checkInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('useAuthState: Error getting initial session:', error);
          setAuthState(prev => ({ ...prev, loading: false }));
          return;
        }

        console.log('useAuthState: Initial session check:', session?.user?.email);
        
        // If no session, stop loading immediately
        if (!session) {
          console.log('useAuthState: No initial session found');
          setAuthState(prev => ({
            ...prev,
            session: null,
            user: null,
            profile: null,
            loading: false
          }));
          return;
        }

        // Update with session data but don't set loading to false yet
        // Let the auth state change handler deal with profile fetching
        setAuthState(prev => ({
          ...prev,
          session,
          user: session.user,
        }));
        
      } catch (error) {
        console.error('useAuthState: Unexpected error during session check:', error);
        setAuthState(prev => ({ ...prev, loading: false }));
      }
    };

    // Run initial session check
    checkInitialSession();

    return () => {
      console.log('useAuthState: Cleaning up subscription');
      subscription.unsubscribe();
    };
  }, []);

  return { authState, setAuthState };
};
