
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePartituras } from '@/hooks/usePartituras';
import { toast } from 'sonner';
import PartituraForm from '@/components/PartituraForm';

const NovaPartitura = () => {
  const navigate = useNavigate();
  const { createPartitura } = usePartituras();

  const handleSubmit = async (data: any) => {
    try {
      await createPartitura.mutateAsync(data);
      toast.success('Partitura cadastrada com sucesso!');
      navigate('/partituras');
    } catch (error) {
      console.error('Erro ao cadastrar partitura:', error);
      toast.error('Erro ao cadastrar partitura. Tente novamente.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          onClick={() => navigate('/partituras')}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Voltar</span>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Nova Partitura</h1>
          <p className="text-gray-600 mt-2">
            Cadastre uma nova partitura no sistema
          </p>
        </div>
      </div>

      <Card className="max-w-4xl">
        <CardHeader>
          <CardTitle>Informações da Partitura</CardTitle>
          <CardDescription>
            Preencha todos os campos obrigatórios para cadastrar a partitura
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PartituraForm
            onSubmit={handleSubmit}
            onCancel={() => navigate('/partituras')}
            isSubmitting={createPartitura.isPending}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default NovaPartitura;
