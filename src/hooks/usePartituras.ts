import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';
import { toast } from 'sonner';

export type Partitura = Tables<'partituras'>;
export type PartituraInsert = TablesInsert<'partituras'>;
export type PartituraUpdate = TablesUpdate<'partituras'>;

export const usePartituras = () => {
  const queryClient = useQueryClient();

  const { data: partituras = [], isLoading, error } = useQuery({
    queryKey: ['partituras'],
    queryFn: async () => {
      console.log('Fetching partituras...');
      const { data, error } = await supabase
        .from('partituras')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching partituras:', error);
        throw error;
      }
      
      console.log('Partituras fetched:', data);
      return data as Partitura[];
    },
    keepPreviousData: true,
  });

  // Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel('public:partituras')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'partituras' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['partituras'] });
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const createPartitura = useMutation({
    mutationFn: async (partitura: PartituraInsert) => {
      console.log('Creating partitura:', partitura);
      const { data, error } = await supabase
        .from('partituras')
        .insert(partitura)
        .select()
        .single();
      
      if (error) {
        console.error('Error creating partitura:', error);
        throw error;
      }
      
      console.log('Partitura created:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partituras'] });
    },
  });

  const updateFileInstrument = useMutation({
    mutationFn: async ({ partituraId, fileName, instrument }: { partituraId: string; fileName: string; instrument: string }) => {
      // 1. Fetch a partitura específica
      const { data: partitura, error: fetchError } = await supabase
        .from('partituras')
        .select('pdf_urls')
        .eq('id', partituraId)
        .single();

      if (fetchError || !partitura) {
        throw new Error(fetchError?.message || "Partitura não encontrada");
      }

      // 2. Modifica o array pdf_urls
      const updatedPdfUrls = (partitura.pdf_urls as any[]).map(fileInfo => {
        if (fileInfo.fileName === fileName) {
          return { ...fileInfo, instrument };
        }
        return fileInfo;
      });

      // 3. Atualiza a partitura com o novo array
      const { data, error } = await supabase
        .from('partituras')
        .update({ pdf_urls: updatedPdfUrls })
        .eq('id', partituraId)
        .select()
        .single();

      if (error) {
        throw error;
      }
      return data;
    },
    onSuccess: (data, variables) => {
      // Invalida a query da partitura específica e a lista geral
      queryClient.invalidateQueries({ queryKey: ['partitura', variables.partituraId] });
      queryClient.invalidateQueries({ queryKey: ['partituras'] });
    },
     onError: (error) => {
      toast.error(`Erro ao atualizar instrumento: ${error.message}`);
    }
  });

  const updatePartitura = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: PartituraUpdate }) => {
      console.log('Updating partitura:', id, updates);
      const { data, error } = await supabase
        .from('partituras')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating partitura:', error);
        throw error;
      }
      
      console.log('Partitura updated:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partituras'] });
    },
  });

  const deletePartitura = useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting partitura:', id);
      const { error } = await supabase
        .from('partituras')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting partitura:', error);
        throw error;
      }
      
      console.log('Partitura deleted:', id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partituras'] });
    },
  });

  return {
    partituras,
    isLoading,
    error,
    createPartitura,
    updatePartitura,
    deletePartitura,
    updateFileInstrument,
  };
};

export const usePartitura = (id: string) => {
  const { data: partitura, isLoading, error } = useQuery({
    queryKey: ['partitura', id],
    queryFn: async () => {
      console.log('Fetching partitura:', id);
      const { data, error } = await supabase
        .from('partituras')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error('Error fetching partitura:', error);
        throw error;
      }
      
      console.log('Partitura fetched:', data);
      return data as Partitura;
    },
    enabled: !!id,
  });

  return { partitura, isLoading, error };
};
