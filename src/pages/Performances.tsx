
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Filter, Calendar, MapPin, Clock, User, Music } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePerformances } from '@/hooks/usePerformances';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const Performances = () => {
  const navigate = useNavigate();
  const { performances, isLoading } = usePerformances();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPerformances = performances?.filter(performance =>
    performance.titulo_obra?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    performance.nome_compositor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    performance.local?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    performance.maestros?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: ptBR });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="space-y-6">
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
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="sm" className="w-full sm:w-auto">
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </Button>
          </div>
          
          <Button onClick={() => navigate('/performances/nova')} className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Nova Performance
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPerformances.map((performance) => (
            <Card key={performance.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg font-semibold line-clamp-2">
                    {performance.titulo_obra}
                  </CardTitle>
                  <Badge variant="outline" className="bg-blue-100 text-blue-800">
                    Performance
                  </Badge>
                </div>
                <CardDescription>
                  <div className="flex items-center text-sm text-gray-600">
                    <User className="h-4 w-4 mr-1" />
                    {performance.nome_compositor}
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-sm">
                    <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    <span className="truncate">{performance.local}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm">
                    <Calendar className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    <span>{formatDate(performance.data)}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm">
                    <Clock className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    <Badge variant="outline" className="text-xs">
                      {performance.horario}
                    </Badge>
                  </div>

                  <div className="space-y-2 pt-2">
                    <div className="flex items-start space-x-2">
                      <User className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-600 mb-1">Maestros:</p>
                        <p className="text-sm text-gray-800 line-clamp-2">{performance.maestros}</p>
                      </div>
                    </div>
                    
                    {performance.interpretes && (
                      <div className="flex items-start space-x-2">
                        <Music className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-600 mb-1">Intérpretes:</p>
                          <p className="text-sm text-gray-800 line-clamp-2">{performance.interpretes}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {performance.release && (
                    <div className="pt-2 border-t">
                      <p className="text-xs text-gray-600 mb-1">Release:</p>
                      <p className="text-sm text-gray-700 line-clamp-3">{performance.release}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

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
    </div>
  );
};

export default Performances;
