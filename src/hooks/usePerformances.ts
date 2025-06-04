
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

export type Performance = Tables<'performances'>;
export type PerformanceInsert = TablesInsert<'performances'>;
export type PerformanceUpdate = TablesUpdate<'performances'>;

export const usePerformances = () => {
  const queryClient = useQueryClient();

  const { data: performances = [], isLoading, error } = useQuery({
    queryKey: ['performances'],
    queryFn: async () => {
      console.log('Fetching performances...');
      const { data, error } = await supabase
        .from('performances')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching performances:', error);
        throw error;
      }
      
      console.log('Performances fetched:', data);
      return data as Performance[];
    },
  });

  const createPerformance = useMutation({
    mutationFn: async (performance: PerformanceInsert) => {
      console.log('Creating performance:', performance);
      const { data, error } = await supabase
        .from('performances')
        .insert(performance)
        .select()
        .single();
      
      if (error) {
        console.error('Error creating performance:', error);
        throw error;
      }
      
      console.log('Performance created:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['performances'] });
    },
  });

  const updatePerformance = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: PerformanceUpdate }) => {
      console.log('Updating performance:', id, updates);
      const { data, error } = await supabase
        .from('performances')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating performance:', error);
        throw error;
      }
      
      console.log('Performance updated:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['performances'] });
    },
  });

  const deletePerformance = useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting performance:', id);
      const { error } = await supabase
        .from('performances')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting performance:', error);
        throw error;
      }
      
      console.log('Performance deleted:', id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['performances'] });
    },
  });

  return {
    performances,
    isLoading,
    error,
    createPerformance,
    updatePerformance,
    deletePerformance,
  };
};

export const usePerformance = (id: string) => {
  const { data: performance, isLoading, error } = useQuery({
    queryKey: ['performance', id],
    queryFn: async () => {
      console.log('Fetching performance:', id);
      const { data, error } = await supabase
        .from('performances')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error('Error fetching performance:', error);
        throw error;
      }
      
      console.log('Performance fetched:', data);
      return data as Performance;
    },
    enabled: !!id,
  });

  return { performance, isLoading, error };
};
