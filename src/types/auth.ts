
import { User, Session } from '@supabase/supabase-js';
import type { Tables } from '@/integrations/supabase/types';

export type UserProfile = Tables<'user_profiles'>;

export interface AuthState {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
}
