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

  const uploadArquivo = useMutation({
    mutationFn: async ({ file, metadata, bucket = 'arquivos' }: { file: File; metadata: any; bucket?: string }) => {
      console.log('Starting upload for file:', file.name, 'with metadata:', metadata, 'bucket:', bucket);
      
      // Obter usuário atual
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      // Gerar nome único para o arquivo
      const fileExtension = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExtension}`;
      const filePath = `${bucket}/${fileName}`;

      console.log('Uploading file to path:', filePath);

      // Upload direto para o Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
      });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw new Error(`Erro no upload: ${uploadError.message}`);
      }

      console.log('File uploaded successfully:', uploadData);

      // Obter URL pública do arquivo
      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      if (!urlData?.publicUrl) {
        throw new Error('Não foi possível obter a URL pública do arquivo');
      }

      console.log('Public URL obtained:', urlData.publicUrl);

      // Criar entrada no banco de dados
      const arquivoData = {
        nome: file.name,
        tipo: file.type,
        tamanho: String(file.size),
        categoria: metadata.categoria || null,
        obra: metadata.obra || null,
        partitura_id: metadata.partitura_id || null,
        performance_id: metadata.performance_id || null,
        usuario_id: user.id,
        url: urlData.publicUrl,
        // outros campos opcionais:
        // aquisicao_at: metadata.aquisicao_at || null,
        // download_url: null,
        // digitalizado: false,
        // instituicao: metadata.instituicao || null,
        // observacoes: metadata.observacoes || null,
      };

      console.log('Creating database entry with data:', arquivoData);

      const { data, error: dbError } = await supabase
        .from('arquivos')
        .insert(arquivoData)
        .select()
        .single();

      if (dbError) {
        console.error('Database error:', dbError);
        // Tentar remover o arquivo do storage se falhou no banco
        await supabase.storage.from(bucket).remove([filePath]);
        throw dbError;
      }

      console.log('Database entry created successfully:', data);
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
    mutationFn: async ({ id, arquivo_url, nome }: { id: string; arquivo_url: string; nome: string }) => {
      console.log('Deleting arquivo:', id, 'with URL:', arquivo_url);
      
      // Deletar arquivo do storage se existir
      if (arquivo_url) {
        try {
          // Extrair o caminho do arquivo da URL
          const urlParts = arquivo_url.split('/');
          const fileName = urlParts[urlParts.length - 1];
          const filePath = `arquivos/${fileName}`;
          
          console.log('Removing file from storage:', filePath);
          
          const { error: storageError } = await supabase.storage
            .from('arquivos')
            .remove([filePath]);
          
          if (storageError) {
            console.error('Error removing file from storage:', storageError);
            // Não falhar se o arquivo não existir no storage
          }
        } catch (error) {
          console.error('Error processing file removal:', error);
        }
      }
      
      // Deletar entrada do banco de dados
      const { error } = await supabase
        .from('arquivos')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting arquivo from database:', error);
        throw error;
      }
      
      console.log('Arquivo deleted successfully:', id);
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
