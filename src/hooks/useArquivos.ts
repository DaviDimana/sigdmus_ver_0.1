
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
  });

  const uploadArquivo = useMutation({
    mutationFn: async ({ file, metadata }: { 
      file: File; 
      metadata: { 
        categoria: string; 
        obra: string; 
        partitura_id?: string; 
        performance_id?: string;
        restricao_download?: boolean;
      } 
    }) => {
      console.log('Uploading arquivo:', file.name);
      
      // Upload do arquivo para o storage
      const fileName = `${Date.now()}_${file.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('arquivos')
        .upload(fileName, file);
      
      if (uploadError) {
        console.error('Error uploading file:', uploadError);
        throw uploadError;
      }
      
      // Obter URL pública do arquivo
      const { data: urlData } = supabase.storage
        .from('arquivos')
        .getPublicUrl(fileName);
      
      // Obter usuário atual
      const { data: { user } } = await supabase.auth.getUser();
      
      // Criar entrada no banco de dados
      const arquivoData: ArquivoInsert = {
        ...metadata,
        nome: file.name,
        tipo: file.type,
        tamanho: file.size,
        arquivo_url: urlData.publicUrl,
        usuario_upload: user?.id,
        restricao_download: metadata.restricao_download || false,
      };
      
      const { data, error } = await supabase
        .from('arquivos')
        .insert(arquivoData)
        .select()
        .single();
      
      if (error) {
        console.error('Error creating arquivo record:', error);
        throw error;
      }
      
      console.log('Arquivo uploaded and recorded:', data);
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
