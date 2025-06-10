
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
    <div className="space-y-4 sm:space-y-6 p-2 sm:p-0">
      <div className="flex flex-col sm:flex-row sm:items-start space-y-4 sm:space-y-0 sm:space-x-4">
        <Button
          variant="ghost"
          onClick={() => navigate('/performances')}
          className="flex items-center space-x-2 w-fit"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Voltar</span>
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Nova Performance</h1>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">
            Cadastre uma nova performance no sistema
          </p>
        </div>
      </div>

      <Card className="w-full">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-lg sm:text-xl">Informações da Performance</CardTitle>
          <CardDescription className="text-sm sm:text-base">
            Preencha todos os campos obrigatórios para cadastrar a performance
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
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
