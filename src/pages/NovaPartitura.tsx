import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { usePartituras, usePartitura } from '@/hooks/usePartituras';
import { toast } from 'sonner';
import PartituraForm from '@/components/PartituraForm';
import { supabase } from '@/integrations/supabase/client';
import { identifyInstrument } from '@/utils/instrumentIdentifier';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const NovaPartitura = () => {
  const navigate = useNavigate();
  const query = useQuery();
  const id = query.get('id');
  const { createPartitura, updatePartitura } = usePartituras();
  const { partitura, isLoading } = usePartitura(id || '');

  const isEdit = Boolean(id);

  async function uploadPdfFiles(pdfFiles: File[], partituraId: string) {
    const fileInfos: { url: string; fileName: string; instrument: string | null }[] = [];
    for (const file of pdfFiles) {
      const fileName = `${partituraId}/${file.name}`;
      const { error } = await supabase.storage
        .from('arquivos')
        .upload(fileName, file, { upsert: true });

      if (error) {
        toast.error(`Erro ao enviar ${file.name}: ${error.message}`);
        continue;
      }
      
      const { data } = supabase.storage.from('arquivos').getPublicUrl(fileName);

      if (data?.publicUrl) {
        const instrument = identifyInstrument(file.name);
        fileInfos.push({
          url: data.publicUrl,
          fileName: file.name,
          instrument: instrument,
        });
      }
    }
    return fileInfos;
  }

  const handleSubmit = async (data: any) => {
    try {
      const { pdfFiles, ...partituraData } = data;
      let partituraId = id;
      if (isEdit && id) {
        await updatePartitura.mutateAsync({ id, updates: partituraData });
        partituraId = id;
        toast.success('Partitura atualizada com sucesso!');
      } else {
        const created = await createPartitura.mutateAsync(partituraData);
        partituraId = created.id;
      toast.success('Partitura cadastrada com sucesso!');
      }
      // Upload dos PDFs se houver
      if (pdfFiles && pdfFiles.length > 0 && partituraId) {
        const fileInfos = await uploadPdfFiles(pdfFiles, partituraId);
        if (fileInfos.length > 0) {
          // Salvar as informações dos arquivos no campo 'pdf_urls'
          const { error: updateError } = await supabase
            .from('partituras')
            .update({ pdf_urls: fileInfos })
            .eq('id', partituraId);

          if (updateError) {
            console.error("Erro ao atualizar pdf_urls:", updateError);
            toast.error('Partitura salva, mas erro ao salvar informações dos PDFs');
          } else {
            toast.success('PDFs enviados e informações salvas com sucesso!');
          }
        }
      }
      navigate('/partituras');
    } catch (error) {
      console.error('Erro ao salvar partitura:', error);
      toast.error('Erro ao salvar partitura. Tente novamente.');
    }
  };

  return (
    <div className="space-y-3 sm:space-y-6 p-1 sm:p-0">
      <div className="flex flex-col space-y-3 sm:space-y-4">
        <Button
          variant="ghost"
          onClick={() => navigate('/partituras')}
          className="flex items-center space-x-2 w-fit p-2 sm:p-3"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm sm:text-base">Voltar</span>
        </Button>
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
            {isEdit ? 'Editar Partitura' : 'Nova Partitura'}
          </h1>
          <p className="text-gray-600 mt-1 sm:mt-2 text-xs sm:text-sm md:text-base">
            {isEdit ? 'Atualize as informações da partitura' : 'Cadastre uma nova partitura no sistema'}
          </p>
        </div>
      </div>

      <Card className="w-full">
        <CardHeader className="p-3 sm:p-4 md:p-6">
          <CardTitle className="text-base sm:text-lg md:text-xl">
            Informações da Partitura
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm md:text-base">
            Preencha todos os campos obrigatórios para {isEdit ? 'atualizar' : 'cadastrar'} a partitura
          </CardDescription>
        </CardHeader>
        <CardContent className="p-3 sm:p-4 md:p-6 pt-0">
          {isEdit && isLoading ? (
            <div>Carregando...</div>
          ) : (
          <PartituraForm
              partitura={isEdit ? partitura : undefined}
            onSubmit={handleSubmit}
            onCancel={() => navigate('/partituras')}
              isSubmitting={createPartitura.isPending || updatePartitura.isPending}
          />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NovaPartitura;
