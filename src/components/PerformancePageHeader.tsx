
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Filter } from 'lucide-react';

interface PerformancePageHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onNewPerformance: () => void;
}

const PerformancePageHeader: React.FC<PerformancePageHeaderProps> = ({
  searchTerm,
  onSearchChange,
  onNewPerformance
}) => {
  return (
    <div className="flex flex-col space-y-4">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Performances</h1>
        <p className="text-gray-600 mt-2">
          Gerencie e consulte o histórico de performances
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar performances..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" size="sm" className="w-full sm:w-auto">
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>
        </div>
        
        <Button onClick={onNewPerformance} className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Nova Performance
        </Button>
      </div>
    </div>
  );
};

export default PerformancePageHeader;
