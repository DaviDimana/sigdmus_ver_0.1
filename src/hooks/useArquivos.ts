import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

export type Arquivo = Tables<'arquivos'>;
export type ArquivoInsert = TablesInsert<'arquivos'>;
export type ArquivoUpdate = TablesUpdate<'arquivos'>;
export type SolicitacaoDownload = Tables<'solicitacoes_download'>;

export const useArquivos = () => {
  const queryClient = useQueryClient();

  const { data: arquivos = [], isLoading, error } = useQuery({
    queryKey: ['arquivos'],
    queryFn: async () => {
      console.log('Fetching arquivos...');
      const { data, error } = await supabase
        .from('arquivos')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching arquivos:', error);
        throw error;
      }
      
      console.log('Arquivos fetched:', data);
      return data as Arquivo[];
    },
    keepPreviousData: true,
  });

  useEffect(() => {
    const channel = supabase
      .channel('public:arquivos')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'arquivos' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['arquivos'] });
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const apiUrl = import.meta.env.VITE_API_URL;

  const uploadArquivo = useMutation({
    mutationFn: async ({ file, metadata }) => {
      // Upload do arquivo para a API local
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch(`${apiUrl}/api/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Erro no upload');
      }

      const { url } = await res.json();

      // Obter usuário atual (continua pelo Supabase Auth)
      const { data: { user } } = await supabase.auth.getUser();

      // Criar entrada no banco de dados (continua igual)
      const arquivoData = {
        ...metadata,
        nome: file.name,
        tipo: file.type,
        tamanho: file.size,
        arquivo_url: url, // agora é a URL da sua API local
        usuario_upload: user?.id,
        restricao_download: metadata.restricao_download || false,
      };

      const { data, error } = await supabase
        .from('arquivos')
        .insert(arquivoData)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['arquivos'] });
    },
  });

  const solicitarAutorizacao = useMutation({
    mutationFn: async ({ arquivo, mensagem }: { arquivo: Arquivo; mensagem?: string }) => {
      console.log('Solicitando autorização para arquivo:', arquivo.id);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { data, error } = await supabase
        .from('solicitacoes_download')
        .insert({
          arquivo_id: arquivo.id,
          usuario_solicitante: user.id,
          usuario_responsavel: arquivo.usuario_upload!,
          mensagem: mensagem || `Solicitação de download para: ${arquivo.nome}`,
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error creating download request:', error);
        throw error;
      }
      
      console.log('Download request created:', data);
      return data;
    },
  });

  const downloadArquivo = useMutation({
    mutationFn: async (arquivo: Arquivo) => {
      console.log('Downloading arquivo:', arquivo.nome);
      
      const { data: { user } } = await supabase.auth.getUser();
      
      // Verificar se o arquivo tem restrição de download
      if (arquivo.restricao_download && arquivo.usuario_upload !== user?.id) {
        // Verificar se existe autorização aprovada
        const { data: autorizacao } = await supabase
          .from('solicitacoes_download')
          .select('*')
          .eq('arquivo_id', arquivo.id)
          .eq('usuario_solicitante', user?.id)
          .eq('status', 'aprovada')
          .single();
        
        if (!autorizacao) {
          throw new Error('AUTHORIZATION_REQUIRED');
        }
      }
      
      // Incrementar contador de downloads
      await supabase
        .from('arquivos')
        .update({ downloads: (arquivo.downloads || 0) + 1 })
        .eq('id', arquivo.id);
      
      // Fazer download do arquivo
      if (arquivo.arquivo_url) {
        const link = document.createElement('a');
        link.href = arquivo.arquivo_url;
        link.download = arquivo.nome;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      
      console.log('Arquivo downloaded:', arquivo.nome);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['arquivos'] });
    },
  });

  const deleteArquivo = useMutation({
    mutationFn: async (arquivo: Arquivo) => {
      console.log('Deleting arquivo:', arquivo.id);
      
      // Deletar arquivo do storage se existir
      if (arquivo.arquivo_url) {
        const fileName = arquivo.arquivo_url.split('/').pop();
        if (fileName) {
          await supabase.storage
            .from('arquivos')
            .remove([fileName]);
        }
      }
      
      // Deletar entrada do banco de dados
      const { error } = await supabase
        .from('arquivos')
        .delete()
        .eq('id', arquivo.id);
      
      if (error) {
        console.error('Error deleting arquivo:', error);
        throw error;
      }
      
      console.log('Arquivo deleted:', arquivo.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['arquivos'] });
    },
  });

  return {
    arquivos,
    isLoading,
    error,
    uploadArquivo,
    downloadArquivo,
    deleteArquivo,
    solicitarAutorizacao,
  };
};
