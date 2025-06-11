
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePerformances } from '@/hooks/usePerformances';
import { toast } from 'sonner';
import PerformanceForm from '@/components/PerformanceForm';

const NovaPerformance = () => {
  const navigate = useNavigate();
  const { createPerformance } = usePerformances();

  const handleSubmit = async (data: any) => {
    try {
      await createPerformance.mutateAsync(data);
      toast.success('Performance cadastrada com sucesso!');
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
            Preencha todos os campos obrigatórios para cadastrar a performance
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
