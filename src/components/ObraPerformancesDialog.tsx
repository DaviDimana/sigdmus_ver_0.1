import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Clock, User, Music } from 'lucide-react';
import { usePerformances } from '@/hooks/usePerformances';

interface ObraPerformancesDialogProps {
  isOpen: boolean;
  onClose: () => void;
  obra: string;
}

const ObraPerformancesDialog: React.FC<ObraPerformancesDialogProps> = ({
  isOpen,
  onClose,
  obra
}) => {
  const { performances, isLoading } = usePerformances();

  // Filtrar performances que correspondem à obra (busca por título similar)
  const performancesRelacionadas = performances.filter(performance => 
    performance.titulo_obra.toLowerCase().includes(obra.toLowerCase()) ||
    obra.toLowerCase().includes(performance.titulo_obra.toLowerCase())
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Performances Relacionadas</DialogTitle>
          <DialogDescription>Veja todas as performances relacionadas a esta obra.</DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-500">Carregando performances...</p>
            </div>
          ) : performancesRelacionadas.length === 0 ? (
            <div className="text-center py-8">
              <Music className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Nenhuma performance encontrada</p>
              <p className="text-gray-400 text-sm">
                Ainda não há performances registradas para esta obra
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  {performancesRelacionadas.length} performance(s) encontrada(s)
                </p>
                <Badge variant="secondary">
                  {performancesRelacionadas.length} total
                </Badge>
              </div>
              
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {performancesRelacionadas.map((performance) => (
                  <div key={performance.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between space-y-2 sm:space-y-0">
                      <div className="flex-1 space-y-3">
                        <div>
                          <h3 className="font-semibold text-lg text-gray-900">
                            {performance.titulo_obra}
                          </h3>
                          <p className="text-gray-600">{performance.nome_compositor}</p>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
                            <span className="truncate">{performance.local}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-gray-400 flex-shrink-0" />
                            <span>{new Date(performance.data).toLocaleDateString('pt-BR')}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-gray-400 flex-shrink-0" />
                            <span>{performance.horario}</span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-start space-x-2">
                            <User className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-gray-600 mb-1">Maestros:</p>
                              <p className="text-sm text-gray-800 line-clamp-2">{performance.maestros}</p>
                            </div>
                          </div>
                          <div className="flex items-start space-x-2">
                            <Music className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-gray-600 mb-1">Intérpretes:</p>
                              <p className="text-sm text-gray-800 line-clamp-2">{performance.interpretes}</p>
                            </div>
                          </div>
                        </div>

                        {performance.release && (
                          <div className="pt-2 border-t">
                            <p className="text-xs text-gray-600 mb-1">Release:</p>
                            <p className="text-sm text-gray-700 line-clamp-3">{performance.release}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ObraPerformancesDialog;
