import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { usePerformances, usePerformance } from '@/hooks/usePerformances';
import { toast } from 'sonner';
import PerformanceForm from '@/components/PerformanceForm';
import { supabase } from '@/integrations/supabase/client';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const NovaPerformance = () => {
  const navigate = useNavigate();
  const query = useQuery();
  const id = query.get('id');
  const { createPerformance, updatePerformance } = usePerformances();
  const { performance, isLoading } = usePerformance(id || '');

  const isEdit = Boolean(id);

  const uploadProgramFile = async (file: File, performanceId: string): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${performanceId}/programa.${fileExt}`;
      const { data, error } = await supabase.storage
        .from('programas-concerto')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });
      if (error) {
        console.error('Erro no upload:', error);
        return null;
      }
      const { data: publicUrlData } = supabase.storage
        .from('programas-concerto')
        .getPublicUrl(fileName);
      return publicUrlData.publicUrl;
    } catch (error) {
      console.error('Erro no upload do arquivo:', error);
      return null;
    }
  };

  const handleSubmit = async (data: any) => {
    try {
      const { programFile, ...performanceData } = data;
      let perfId = id;
      let programaUrl: string | null = null;
      // 1. Buscar se já existe performance com mesma data, local e horário
      const { data: existingPerformances, error: searchError } = await supabase
        .from('performances')
        .select('id, programa_arquivo_url')
        .eq('data', performanceData.data)
        .eq('local', performanceData.local)
        .eq('horario', performanceData.horario);
      if (searchError) {
        console.error('Erro ao buscar performances duplicadas:', searchError);
      }
      // Se já existe e tem programa, reutilizar
      if (existingPerformances && existingPerformances.length > 0) {
        const found = existingPerformances.find((p: any) => p.programa_arquivo_url);
        if (found && found.programa_arquivo_url) {
          programaUrl = found.programa_arquivo_url;
        }
      }
      if (isEdit && id) {
        await updatePerformance.mutateAsync({ id, updates: performanceData });
        perfId = id;
        toast.success('Performance atualizada com sucesso!');
      } else {
        const created = await createPerformance.mutateAsync(performanceData);
        perfId = created.id;
        toast.success('Performance cadastrada com sucesso!');
      }
      // 2. Se já existe programa, só atualizar a performance com a URL
      if (programaUrl && perfId) {
        const { error: updateError } = await supabase
          .from('performances')
          .update({ programa_arquivo_url: programaUrl })
          .eq('id', perfId);
        if (updateError) {
          console.error('Erro ao atualizar URL do programa:', updateError);
          toast.error('Performance salva, mas erro ao vincular programa existente');
        } else {
          toast.success('Programa do concerto reutilizado com sucesso!');
          toast.info('O programa já estava disponível para esta data, local e horário. Não foi necessário fazer upload novamente.');
        }
      } else if (programFile && perfId) {
        // 3. Se não existe, fazer upload normalmente
        const programUrl = await uploadProgramFile(programFile, perfId);
        if (programUrl) {
          // Atualizar a performance com a URL do arquivo
          const { error: updateError } = await supabase
            .from('performances')
            .update({ programa_arquivo_url: programUrl })
            .eq('id', perfId);
          if (updateError) {
            console.error('Erro ao atualizar URL do programa:', updateError);
            toast.error('Performance salva, mas erro no upload do programa');
          } else {
            toast.success('Programa do concerto salvo com sucesso!');
          }
        } else {
          toast.error('Performance salva, mas erro no upload do programa');
        }
      }
      navigate('/performances');
    } catch (error) {
      console.error('Erro ao salvar performance:', error);
      toast.error('Erro ao salvar performance. Tente novamente.');
    }
  };

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
          />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NovaPerformance;
