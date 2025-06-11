
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Plus } from 'lucide-react';

interface PartituraEmptyStateProps {
  searchTerm: string;
  onAddPartitura: () => void;
}

const PartituraEmptyState: React.FC<PartituraEmptyStateProps> = ({ 
  searchTerm, 
  onAddPartitura 
}) => {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12">
        <FileText className="h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Nenhuma partitura encontrada
        </h3>
        <p className="text-gray-600 text-center mb-4">
          {searchTerm 
            ? "Tente ajustar os termos de busca ou limpar os filtros."
            : "Comece adicionando sua primeira partitura ao acervo."
          }
        </p>
        <Button onClick={onAddPartitura}>
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Partitura
        </Button>
      </CardContent>
    </Card>
  );
};

export default PartituraEmptyState;
