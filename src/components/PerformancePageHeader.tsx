import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface PerformancePageHeaderProps {
  onNewPerformance: () => void;
}

const PerformancePageHeader: React.FC<PerformancePageHeaderProps> = ({
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
        <div className="flex-1" />
        <Button onClick={onNewPerformance} className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Nova Performance
        </Button>
      </div>
    </div>
  );
};

export default PerformancePageHeader;
