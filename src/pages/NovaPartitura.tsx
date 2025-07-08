import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Hourglass } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { usePartituras, usePartitura } from '@/hooks/usePartituras';
import { toast } from 'sonner';
import PartituraForm from '@/components/PartituraForm';
import { supabase } from '@/integrations/supabase/client';
import { identifyInstrument } from '@/utils/instrumentIdentifier';
import { useArquivos } from '@/hooks/useArquivos';
import { useAuth } from '@/hooks/useAuth';
import { v4 as uuidv4 } from 'uuid';
import { useQuery } from '../hooks/useQuery';

const NovaPartitura = () => {
  const navigate = useNavigate();
  const query = useQuery();
  const id = query.get('id');
  console.log('ID da query string:', id); // <-- LOG NOVO
  const { createPartitura, updatePartitura } = usePartituras();
  const { partitura, isLoading } = usePartitura(id || '');
  const { deleteArquivo, uploadArquivo } = useArquivos();
  const { profile } = useAuth();
  const canEditOrDelete = true;

  const isEdit = Boolean(id);
  const [isSaving, setIsSaving] = React.useState(false);

  const handleSubmit = async (data: any) => {
    if (isEdit && !id) {
      console.error('Tentativa de edição sem id válido!');
      toast.error('Erro interno: ID da partitura não encontrado para edição.');
      return;
    }
    setIsSaving(true);
    try {
      console.log('=== INICIANDO PROCESSO DE SALVAMENTO ===');
      console.log('Dados recebidos do formulário:', data);
      
      const { pdfFiles, oldFiles, removedFiles, ...partituraData } = data;
      let partituraId = id || uuidv4();
      let finalPdfUrls = [];
      
      console.log('ID da partitura:', partituraId);
      console.log('Arquivos PDF novos:', pdfFiles);
      console.log('Arquivos antigos:', oldFiles);
      console.log('Arquivos marcados para remoção:', removedFiles);

      // 1. Remover arquivos antigos marcados para remoção
      let remainingOldFiles = oldFiles ? oldFiles.filter((f: any) => !removedFiles.includes(f.fileName)) : [];
      console.log('Arquivos antigos que permanecerão:', remainingOldFiles);
      
      if (isEdit && removedFiles && removedFiles.length > 0 && oldFiles) {
        console.log('Removendo arquivos antigos...');
        for (const file of oldFiles) {
          if (removedFiles.includes(file.fileName)) {
            try {
              console.log('Removendo arquivo:', file.fileName);
              await deleteArquivo.mutateAsync({ 
                id: file.id, 
                arquivo_url: file.url, 
                nome: file.fileName 
              });
              console.log('Arquivo removido com sucesso:', file.fileName);
            } catch (e) {
              console.error('Erro ao remover arquivo antigo:', e);
              toast.error(`Erro ao remover arquivo: ${file.fileName}`);
          }
        }
        }
      }

      // NOVO FLUXO: CRIAÇÃO PRIMEIRO DA PARTITURA, DEPOIS UPLOAD DOS ARQUIVOS
      if (!isEdit) {
        // 1. Criar partitura sem arquivos
        const objetoParaInsert = {
          setor: partituraData.setor || null,
          titulo: partituraData.titulo || null,
          compositor: partituraData.compositor || null,
          instrumentacao: partituraData.instrumentacao || null,
          tonalidade: partituraData.tonalidade || null,
          genero: partituraData.genero || null,
          edicao: partituraData.edicao || null,
          ano_edicao: partituraData.ano_edicao ? Number(partituraData.ano_edicao) : undefined,
          ano_aquisicao: partituraData.ano_aquisicao ? Number(partituraData.ano_aquisicao) : undefined,
          digitalizado: partituraData.digitalizado ?? false,
          numero_armario: partituraData.numero_armario || null,
          numero_prateleira: partituraData.numero_prateleira || null,
          numero_pasta: partituraData.numero_pasta || null,
          instituicao: partituraData.instituicao || null,
          observacoes: partituraData.observacoes || null,
          pdf_urls: [],
        };
        let created;
        try {
          created = await createPartitura.mutateAsync(objetoParaInsert);
          if (!created) {
            throw new Error('Falha ao criar partitura. Verifique as policies e o schema do banco.');
          }
          partituraId = created.id;
          console.log('Partitura criada com sucesso! ID:', partituraId);
        } catch (error: any) {
          console.error('Erro ao criar partitura:', error);
          toast.error('Erro ao criar partitura: ' + (error.message || 'Erro desconhecido'));
          setIsSaving(false);
          return;
      }
        // 2. Upload de novos arquivos usando o id retornado
      let newFileInfos = [];
      if (pdfFiles && pdfFiles.length > 0) {
        for (const file of pdfFiles) {
          try {
            const uploaded = await uploadArquivo.mutateAsync({
              file,
              metadata: {
                categoria: 'partitura',
                obra: partituraData.titulo,
                partitura_id: partituraId,
              },
            });
            newFileInfos.push({
                url: uploaded.url,
              fileName: uploaded.nome,
              instrument: identifyInstrument(uploaded.nome),
              id: uploaded.id,
            });
          } catch (e) {
              console.error('Erro ao enviar arquivo:', file.name, e);
              toast.error(`Erro ao enviar arquivo: ${file.name}`);
            }
          }
        }
      finalPdfUrls = [...remainingOldFiles, ...newFileInfos];
        // 3. Atualizar a partitura com os pdf_urls
        try {
          await updatePartitura.mutateAsync({ id: partituraId, updates: { pdf_urls: finalPdfUrls } });
        } catch (error: any) {
          console.error('Erro ao atualizar partitura com pdf_urls:', error);
          toast.error('Erro ao atualizar partitura: ' + (error.message || 'Erro desconhecido'));
          setIsSaving(false);
          return;
        }
        toast.success('Partitura cadastrada com sucesso!');
      } else {
        // FLUXO DE EDIÇÃO (mantém o fluxo antigo)
        // 2. Upload de novos arquivos
        let newFileInfos = [];
        if (pdfFiles && pdfFiles.length > 0) {
          for (const file of pdfFiles) {
            try {
              const uploaded = await uploadArquivo.mutateAsync({
                file,
                metadata: {
                  categoria: 'partitura',
                  obra: partituraData.titulo,
                  partitura_id: partituraId,
                },
              });
              newFileInfos.push({
                url: uploaded.url,
                fileName: uploaded.nome,
                instrument: identifyInstrument(uploaded.nome),
                id: uploaded.id,
              });
            } catch (e) {
              console.error('Erro ao enviar arquivo:', file.name, e);
              toast.error(`Erro ao enviar arquivo: ${file.name}`);
            }
          }
        }
        finalPdfUrls = [...remainingOldFiles, ...newFileInfos];
        // 4. Montar objeto para update
        const objetoParaInsert = {
          setor: partituraData.setor || null,
          titulo: partituraData.titulo || null,
          compositor: partituraData.compositor || null,
          instrumentacao: partituraData.instrumentacao || null,
          tonalidade: partituraData.tonalidade || null,
          genero: partituraData.genero || null,
          edicao: partituraData.edicao || null,
          ano_edicao: partituraData.ano_edicao ? Number(partituraData.ano_edicao) : undefined,
          ano_aquisicao: partituraData.ano_aquisicao ? Number(partituraData.ano_aquisicao) : undefined,
          digitalizado: partituraData.digitalizado ?? false,
          numero_armario: partituraData.numero_armario || null,
          numero_prateleira: partituraData.numero_prateleira || null,
          numero_pasta: partituraData.numero_pasta || null,
          instituicao: partituraData.instituicao || null,
          observacoes: partituraData.observacoes || null,
          pdf_urls: finalPdfUrls,
        };
        try {
          await updatePartitura.mutateAsync({ id, updates: { ...objetoParaInsert, id } });
          toast.success('Partitura atualizada com sucesso!');
        } catch (error: any) {
          console.error('Erro ao atualizar partitura:', error);
          toast.error('Erro ao atualizar partitura: ' + (error.message || 'Erro desconhecido'));
          setIsSaving(false);
          return;
        }
      }
      setIsSaving(false);
      console.log('=== PROCESSO DE SALVAMENTO CONCLUÍDO ===');
      navigate('/partituras');
    } catch (error) {
      setIsSaving(false);
      console.error('Erro geral ao salvar partitura:', error);
      toast.error('Erro ao salvar partitura. Tente novamente.');
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
          onClick={() => navigate('/partituras')}
          className="flex items-center space-x-2 w-fit"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Voltar</span>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEdit ? 'Editar Partitura' : 'Nova Partitura'}
          </h1>
          <p className="text-gray-600 mt-2">
            {isEdit ? 'Atualize as informações da partitura' : 'Cadastre uma nova partitura no sistema'}
          </p>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Informações da Partitura</CardTitle>
          <CardDescription>
            Preencha todos os campos obrigatórios para {isEdit ? 'atualizar' : 'cadastrar'} a partitura
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          {isEdit && isLoading ? (
            <div>Carregando...</div>
          ) : (
          <PartituraForm
              partitura={isEdit ? partitura : undefined}
            onSubmit={handleSubmit}
            onCancel={() => navigate('/partituras')}
              isSubmitting={isSaving || createPartitura.isPending || updatePartitura.isPending}
          />
          )}
        </CardContent>
      </Card>
      {/* Overlay de loading */}
      {isSaving && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm">
          <Hourglass className="animate-spin h-12 w-12 text-blue-500 mb-4" />
          <span className="text-white text-lg font-semibold drop-shadow-lg">Atualizando partitura e arquivos. Por favor, aguarde...</span>
        </div>
      )}
    </div>
  );
};

export default NovaPartitura;
