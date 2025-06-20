import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface PartituraPageHeaderProps {
  onNewPartitura: () => void;
}

const PartituraPageHeader: React.FC<PartituraPageHeaderProps> = ({ onNewPartitura }) => {
  return (
    <div className="flex flex-col space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Partituras</h1>
          <p className="text-gray-600 mt-2">
            Gerencie o acervo de partituras musicais
          </p>
        </div>
        <Button 
          onClick={onNewPartitura}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nova Partitura
        </Button>
      </div>
    </div>
  );
};

export default PartituraPageHeader;
