import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useSolicitacoesDownload = () => {
  const queryClient = useQueryClient();

  const { data: solicitacoes = [], isLoading, error } = useQuery({
    queryKey: ['solicitacoes_download'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('solicitacoes_download')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
    keepPreviousData: true,
  });

  useEffect(() => {
    const channel = supabase
      .channel('public:solicitacoes_download')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'solicitacoes_download' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['solicitacoes_download'] });
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return { solicitacoes, isLoading, error };
}; 