import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { usePerformances, usePerformance } from '@/hooks/usePerformances';
import { toast } from 'sonner';
import PerformanceForm from '@/components/PerformanceForm';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useArquivos } from '@/hooks/useArquivos';
import { usePartituras } from '@/hooks/usePartituras';
import { useQuery } from '../hooks/useQuery';

const NovaPerformance = () => {
  const navigate = useNavigate();
  const query = useQuery();
  const id = query.get('id');
  const { createPerformance, updatePerformance } = usePerformances();
  const { performance, isLoading } = usePerformance(id || '');
  const { profile } = useAuth();
  const canEditOrDelete = true;
  const { uploadArquivo } = useArquivos();
  const { partituras, createPartitura } = usePartituras();
  const [partitura, setPartitura] = useState<any>(null);

  const isEdit = Boolean(id);
  const [sharedProgramUrl, setSharedProgramUrl] = useState<string | undefined>(undefined);
  const [sharedProgramFileName, setSharedProgramFileName] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (isEdit && performance && !performance?.programa_arquivo_url) {
      // Buscar outra performance do mesmo grupo que tenha programa
      (async () => {
        const { data: groupPerformances, error } = await supabase
          .from('performances')
          .select('programa_arquivo_url')
          .eq('local', performance.local)
          .eq('data', performance.data)
          .eq('horario', performance.horario);
        if (!error && groupPerformances) {
          const found = groupPerformances.find((p: any) => p.programa_arquivo_url && p.programa_arquivo_url.trim() !== '');
          if (found && found.programa_arquivo_url) {
            setSharedProgramUrl(found.programa_arquivo_url);
            // Extrair nome do arquivo
            const fileName = found.programa_arquivo_url.split('/').pop();
            setSharedProgramFileName(fileName || 'programa.pdf');
          }
        }
      })();
    } else if (isEdit && performance?.programa_arquivo_url) {
      setSharedProgramUrl(performance.programa_arquivo_url);
      const fileName = performance.programa_arquivo_url.split('/').pop();
      setSharedProgramFileName(fileName || 'programa.pdf');
    }
  }, [isEdit, performance]);

  useEffect(() => {
    if (performance?.partitura_id) {
      supabase
        .from('partituras')
        .select('titulo, compositor')
        .eq('id', performance.partitura_id)
        .single()
        .then(({ data }) => setPartitura(data));
    }
  }, [performance?.partitura_id]);

  const uploadProgramFile = async (file: File, performanceId: string) => {
    console.log('Iniciando upload do arquivo de programa:', file.name, 'para performance:', performanceId);
    
    // Obter usuário atual
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    // Gerar nome único para o arquivo
    const fileExtension = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExtension}`;
    const filePath = `programas-concerto/${performanceId}/${fileName}`;

    console.log('Uploading file to path:', filePath);

    // Upload direto para o Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('programas-concerto')
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
      .from('programas-concerto')
      .getPublicUrl(filePath);

    if (!urlData?.publicUrl) {
      throw new Error('Não foi possível obter a URL pública do arquivo');
    }

    console.log('Public URL obtained:', urlData.publicUrl);
    return urlData.publicUrl;
  };

  const deleteProgramFile = async (performanceId: string, local: string, dataStr: string, horario: string): Promise<boolean> => {
    try {
      console.log('Deletando arquivo do programa para performance:', performanceId);
      // Listar arquivos na pasta da performance
      const { data: files, error: listError } = await supabase.storage
        .from('programas-concerto')
        .list(performanceId);
      if (listError) {
        console.error('Erro ao listar arquivos:', listError);
        return false;
      }
      if (files && files.length > 0) {
        // Deletar todos os arquivos na pasta
        const filePaths = files.map(file => `${performanceId}/${file.name}`);
        const { error: deleteError } = await supabase.storage
          .from('programas-concerto')
          .remove(filePaths);
        if (deleteError) {
          console.error('Erro ao deletar arquivos:', deleteError);
          return false;
        }
        console.log('Arquivos deletados com sucesso:', filePaths);
      }
      // Limpar o campo programa_arquivo_url de todas as performances com mesmo local, data e horário
      const { error: updateError } = await supabase
        .from('performances')
        .update({ programa_arquivo_url: null })
        .eq('local', local)
        .eq('data', dataStr)
        .eq('horario', horario);
      if (updateError) {
        console.error('Erro ao limpar programa_arquivo_url das performances relacionadas:', updateError);
        return false;
      }
      console.log('Campo programa_arquivo_url limpo para todas as performances relacionadas');
      return true;
    } catch (error) {
      console.error('Erro ao deletar arquivo do programa:', error);
      return false;
    }
  };

  const updateRelatedPerformances = async (data: any, programUrl: string, isReusing: boolean = false) => {
    try {
      console.log('Atualizando performances relacionadas com programa:', programUrl);
      console.log('Dados para busca:', data);
      
      // Validar dados obrigatórios
      if (!data.data || !data.local || !data.horario) {
        console.error('Dados obrigatórios não fornecidos para busca de performances relacionadas');
        return;
      }
      
      // Buscar todas as performances com mesmo local, data e horário
      const { data: relatedPerformances, error: relatedError } = await supabase
        .from('performances')
        .select('id')
        .eq('data', data.data)
        .eq('local', data.local)
        .eq('horario', data.horario);
      
      if (relatedError) {
        console.error('Erro ao buscar performances relacionadas:', relatedError);
        throw new Error('Erro ao buscar performances relacionadas');
      }
      
      if (!relatedPerformances || relatedPerformances.length === 0) {
        console.log('Nenhuma performance relacionada encontrada');
        return;
      }
      
      console.log('Performances relacionadas encontradas:', relatedPerformances);
      console.log('Total de performances relacionadas:', relatedPerformances.length);
      
      // Atualizar todas as performances relacionadas com o programa
      const performanceIds = relatedPerformances.map((p: any) => p.id);
      console.log('IDs das performances para atualizar:', performanceIds);
      
      const { error: updateError } = await supabase
        .from('performances')
        .update({ programa_arquivo_url: programUrl })
        .in('id', performanceIds);
      
      if (updateError) {
        console.error('Erro ao atualizar performances relacionadas:', updateError);
        throw new Error('Erro ao atualizar performances relacionadas');
      }
      
      console.log('Performances relacionadas atualizadas com sucesso');
      console.log('Programa vinculado a', relatedPerformances.length, 'performance(s)');
      
      // Mostrar mensagem de sucesso
      if (isReusing) {
        toast.success('Programa do concerto reutilizado com sucesso!');
        toast.info(`O programa foi vinculado a ${relatedPerformances.length} performance(s) com mesmo local, data e horário.`);
      } else {
        toast.success('Programa do concerto salvo com sucesso!');
        if (relatedPerformances.length > 1) {
          toast.info(`O programa foi vinculado a ${relatedPerformances.length} performance(s) com mesmo local, data e horário.`);
        }
      }
      
    } catch (error) {
      console.error('Erro ao atualizar performances relacionadas:', error);
      if (isReusing) {
        toast.error('Performance salva, mas erro ao vincular programa existente');
      } else {
        toast.error('Performance salva, mas erro ao vincular programa');
      }
    }
  };

  const handleSubmit = async (data: any) => {
    try {
      const { programFile, removeExistingFile, ...performanceData } = data;
      let perfId = id;
      let programaUrl: string | null = null;
      
      console.log('Dados da performance:', performanceData);
      console.log('Arquivo de programa:', programFile);
      console.log('Remover arquivo existente:', removeExistingFile);
      console.log('Modo de edição:', isEdit);
      
      // Validar dados obrigatórios
      if (!performanceData.data || !performanceData.local || !performanceData.horario || !performanceData.titulo || !performanceData.compositor) {
        toast.error('Data, local, horário, título e compositor são obrigatórios');
        return;
      }
      
      // Se está editando e o usuário quer remover o arquivo existente
      if (isEdit && removeExistingFile && id) {
        console.log('Removendo arquivo existente da performance:', id);
        const deleted = await deleteProgramFile(id, performanceData.local, performanceData.data, performanceData.horario);
        if (deleted) {
          console.log('Arquivo existente removido com sucesso');
          performanceData.programa_arquivo_url = null;
        } else {
          console.log('Erro ao remover arquivo existente, mas continuando...');
        }
      }
      
      // 1. Verificar se já existe partitura com o título e compositor
      let partitura = partituras.find(p => p.titulo === performanceData.titulo && p.compositor === performanceData.compositor);
      if (!partitura) {
        // Criar nova partitura mínima
        const novaPartitura = await createPartitura.mutateAsync({
          titulo: performanceData.titulo,
          compositor: performanceData.compositor
        });
        partitura = novaPartitura;
      }
      
      // 2. Montar objeto de performance apenas com campos válidos
      const performanceInsert = {
        partitura_id: partitura.id,
        local: performanceData.local,
        data: performanceData.data,
        horario: performanceData.horario,
        maestros: performanceData.maestros,
        interpretes: performanceData.interpretes,
        release: performanceData.release
      };
      
      // 3. Criar ou atualizar performance SEM arquivo
      if (isEdit && id) {
        await updatePerformance.mutateAsync({ id, updates: performanceInsert });
        perfId = id;
        toast.success('Performance atualizada com sucesso!');
      } else {
        const created = await createPerformance.mutateAsync(performanceInsert);
        perfId = created.id;
        toast.success('Performance cadastrada com sucesso!');
      }
      
      // 4. Upload do arquivo de programa, se houver
      if (programFile && perfId) {
        const uploaded = await uploadArquivo.mutateAsync({
          file: programFile,
          metadata: {
            categoria: 'programa',
            performance_id: perfId,
          },
          bucket: 'programas-concerto',
        });
        programaUrl = uploaded.url;
        await updatePerformance.mutateAsync({ id: perfId, updates: { programa_arquivo_url: programaUrl } });
      }
      
      navigate('/performances');
    } catch (error) {
      console.error('Erro ao salvar performance:', error);
      toast.error('Erro ao salvar performance. Tente novamente.');
    }
  };

  if (!profile) {
    return <div className="flex items-center justify-center h-64">Carregando perfil do usuário...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4">
        <Button
          variant="ghost"
          onClick={() => navigate('/performances')}
          className="flex items-center space-x-2 w-fit"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Voltar</span>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{isEdit ? 'Editar Performance' : 'Nova Performance'}</h1>
          <p className="text-gray-600 mt-2">
            {isEdit ? 'Atualize as informações da performance' : 'Cadastre uma nova performance no sistema'}
          </p>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Informações da Performance</CardTitle>
          <CardDescription>
            Preencha todos os campos obrigatórios para {isEdit ? 'atualizar' : 'cadastrar'} a performance. Você também pode fazer upload do programa do concerto.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          {isEdit && isLoading ? (
            <div>Carregando...</div>
          ) : (
          <PerformanceForm
            onSubmit={handleSubmit}
            onCancel={() => navigate('/performances')}
            isSubmitting={createPerformance.isPending || updatePerformance.isPending}
            initialData={{
              ...performance,
              titulo: partitura?.titulo || '',
              compositor: partitura?.compositor || '',
              programa_arquivo_url: sharedProgramUrl || performance?.programa_arquivo_url,
              programa_arquivo_nome: sharedProgramFileName,
            }}
            isEdit={isEdit}
          />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NovaPerformance;
