
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePerformances } from '@/hooks/usePerformances';
import { toast } from 'sonner';
import PerformanceForm from '@/components/PerformanceForm';
import { supabase } from '@/integrations/supabase/client';

const NovaPerformance = () => {
  const navigate = useNavigate();
  const { createPerformance } = usePerformances();

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
      
      console.log('Dados da performance:', performanceData);
      console.log('Arquivo do programa:', programFile);
      
      // Criar a performance primeiro
      const performance = await createPerformance.mutateAsync(performanceData);
      
      // Se houver arquivo, fazer upload
      if (programFile && performance) {
        const programUrl = await uploadProgramFile(programFile, performance.id);
        
        if (programUrl) {
          // Atualizar a performance com a URL do arquivo
          const { error: updateError } = await supabase
            .from('performances')
            .update({ programa_arquivo_url: programUrl })
            .eq('id', performance.id);
            
          if (updateError) {
            console.error('Erro ao atualizar URL do programa:', updateError);
            toast.error('Performance criada, mas erro no upload do programa');
          } else {
            toast.success('Performance e programa cadastrados com sucesso!');
          }
        } else {
          toast.error('Performance criada, mas erro no upload do programa');
        }
      } else {
        toast.success('Performance cadastrada com sucesso!');
      }
      
      navigate('/performances');
    } catch (error) {
      console.error('Erro ao cadastrar performance:', error);
      toast.error('Erro ao cadastrar performance. Tente novamente.');
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
          <h1 className="text-3xl font-bold text-gray-900">Nova Performance</h1>
          <p className="text-gray-600 mt-2">
            Cadastre uma nova performance no sistema
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações da Performance</CardTitle>
          <CardDescription>
            Preencha todos os campos obrigatórios para cadastrar a performance. Você também pode fazer upload do programa do concerto.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <PerformanceForm
            onSubmit={handleSubmit}
            onCancel={() => navigate('/performances')}
            isSubmitting={createPerformance.isPending}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default NovaPerformance;
