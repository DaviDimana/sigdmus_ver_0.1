
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Music } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePerformances } from '@/hooks/usePerformances';
import { Skeleton } from '@/components/ui/skeleton';
import PerformanceCard from '@/components/PerformanceCard';
import PerformancePageHeader from '@/components/PerformancePageHeader';
import ProgramViewer from '@/components/ProgramViewer';

const Performances = () => {
  const navigate = useNavigate();
  const { performances, isLoading } = usePerformances();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPerformance, setSelectedPerformance] = useState<any>(null);

  const filteredPerformances = performances?.filter(performance =>
    performance.titulo_obra?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    performance.nome_compositor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    performance.local?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    performance.maestros?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleViewProgram = (performance: any) => {
    setSelectedPerformance(performance);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PerformancePageHeader
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onNewPerformance={() => navigate('/performances/nova')}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <div className="p-6">
                <Skeleton className="h-6 w-3/4 mb-4" />
                <Skeleton className="h-4 w-1/2 mb-3" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PerformancePageHeader
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onNewPerformance={() => navigate('/performances/nova')}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPerformances.map((performance) => (
          <PerformanceCard 
            key={performance.id} 
            performance={performance} 
            onViewProgram={handleViewProgram}
          />
        ))}
      </div>

      {filteredPerformances.length === 0 && !isLoading && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Music className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhuma performance encontrada
            </h3>
            <p className="text-gray-600 text-center mb-4">
              {searchTerm 
                ? "Tente ajustar os termos de busca ou limpar os filtros."
                : "Comece registrando sua primeira performance."
              }
            </p>
            <Button onClick={() => navigate('/performances/nova')}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Performance
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Dialog para visualizar programa */}
      <ProgramViewer
        isOpen={!!selectedPerformance}
        onClose={() => setSelectedPerformance(null)}
        performance={selectedPerformance || {}}
        onDownload={() => {
          // Implementar lógica de download se necessário
          console.log('Download programa:', selectedPerformance);
        }}
      />
    </div>
  );
};

export default Performances;
