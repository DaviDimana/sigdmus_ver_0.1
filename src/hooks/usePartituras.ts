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
      // Atualiza o campo instrument na tabela arquivos
      const { data, error } = await supabase
        .from('arquivos')
        .update({ instrument })
        .eq('partitura_id', partituraId)
        .eq('nome', fileName)
        .select();
      if (error) {
        throw error;
      }
      if (!data || data.length !== 1) {
        throw new Error('Erro ao atualizar: nenhum ou múltiplos registros retornados.');
      }
      return data[0];
    },
    onSuccess: (data, variables) => {
      // Invalida a query dos arquivos da partitura e a lista geral
      queryClient.invalidateQueries({ queryKey: ['arquivos-partitura', variables.partituraId] });
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
        .select();
      
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
      // 1. Buscar todos os arquivos relacionados à partitura
      const { data: arquivos, error: fetchError } = await supabase
        .from('arquivos')
        .select('nome, partitura_id')
        .eq('partitura_id', id);

      if (fetchError) {
        console.error('Erro ao buscar arquivos para deleção do storage:', fetchError);
        // Continue mesmo assim, se quiser garantir deleção do banco
      }

      // 2. Montar os caminhos dos arquivos no bucket
      const filePaths = arquivos ? arquivos.map(a => `${id}/${a.nome}`) : [];

      // 3. Remover do bucket
      if (filePaths.length > 0) {
        const { error: storageError } = await supabase.storage.from('arquivos').remove(filePaths);
        if (storageError) {
          console.error('Erro ao remover arquivos do bucket:', storageError);
          // Continue mesmo assim, se quiser garantir deleção do banco
        }
      }

      // 4. Agora delete a partitura (já faz o cascade nas tabelas)
      const { data, error } = await supabase
        .from('partituras')
        .delete()
        .eq('id', id);
      console.log('Delete result:', { data, error });
      if (error) {
        console.error('Error deleting partitura:', error);
        throw error;
      }
      if (!data || data.length === 0) {
        console.warn('Nenhuma partitura foi deletada!');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partituras'] });
      queryClient.invalidateQueries({ queryKey: ['performances'] });
      queryClient.invalidateQueries({ queryKey: ['arquivos'] });
      toast.success('Partitura deletada com sucesso!');
    },
    onError: (error: any) => {
      console.error('Error in deletePartitura mutation:', error);
      toast.error(error.message || 'Erro ao deletar partitura');
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
