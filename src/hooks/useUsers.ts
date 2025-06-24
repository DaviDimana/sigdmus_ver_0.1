import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables, TablesUpdate } from '@/integrations/supabase/types';
import { useEffect } from 'react';

export type UserProfile = Tables<'user_profiles'>;
export type UserProfileUpdate = TablesUpdate<'user_profiles'>;

export const useUsers = () => {
  const queryClient = useQueryClient();

  const { data: users = [], isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as UserProfile[];
    },
    keepPreviousData: true,
  });

  // Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel('public:user_profiles')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'user_profiles' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['users'] });
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const updateUserProfile = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: UserProfileUpdate }) => {
      const { data, error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const deleteUserProfile = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('user_profiles')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });


  return { users, isLoading, error, updateUserProfile, deleteUserProfile };
}; 