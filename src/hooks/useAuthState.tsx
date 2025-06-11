
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

    // Clear any existing auth state first
    const clearAuthState = () => {
      if (!mounted) return;
      setAuthState({
        user: null,
        session: null,
        profile: null,
        loading: false
      });
    };

    // Function to handle successful authentication
    const handleAuthSuccess = async (session: any) => {
      if (!mounted) return;
      
      console.log('useAuthState: Processing auth success for:', session.user.email);
      
      setAuthState(prev => ({
        ...prev,
        session,
        user: session.user,
        loading: true
      }));

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
      } catch (error) {
        console.error('useAuthState: Profile fetch error:', error);
        if (!mounted) return;
        setAuthState(prev => ({ ...prev, loading: false }));
      }
    };

    // Initialize auth state
    const initializeAuth = async () => {
      try {
        console.log('useAuthState: Checking for existing session...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('useAuthState: Session error:', error);
          clearAuthState();
          return;
        }

        if (session?.user) {
          console.log('useAuthState: Found existing session');
          await handleAuthSuccess(session);
        } else {
          console.log('useAuthState: No existing session found');
          clearAuthState();
        }
      } catch (error) {
        console.error('useAuthState: Initialization error:', error);
        clearAuthState();
      }
    };

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('useAuthState: Auth state change:', event, !!session);
        
        if (!mounted) return;

        if (event === 'SIGNED_OUT' || !session) {
          console.log('useAuthState: User signed out or no session');
          clearAuthState();
          return;
        }

        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          console.log('useAuthState: User signed in or token refreshed');
          await handleAuthSuccess(session);
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
