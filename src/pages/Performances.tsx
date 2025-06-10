
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Edit, Trash2, Calendar, MapPin, Clock, User, Music } from 'lucide-react';
import { usePerformances } from '@/hooks/usePerformances';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const Performances = () => {
  const { performances, isLoading, deletePerformance } = usePerformances();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPerformances = performances.filter(performance =>
    performance.titulo_obra.toLowerCase().includes(searchTerm.toLowerCase()) ||
    performance.nome_compositor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    performance.local.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta performance?')) {
      try {
        await deletePerformance.mutateAsync(id);
        toast.success('Performance excluída com sucesso!');
      } catch (error) {
        console.error('Erro ao excluir performance:', error);
        toast.error('Erro ao excluir performance. Tente novamente.');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Carregando performances...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 p-2 sm:p-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Performances</h1>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">
            Gerencie as performances musicais do arquivo
          </p>
        </div>
        
        <Button
          onClick={() => navigate('/performances/nova')}
          className="flex items-center space-x-2 w-full sm:w-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Nova Performance</span>
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Buscar performances..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        {filteredPerformances.map((performance) => (
          <Card key={performance.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex flex-col space-y-2">
                <CardTitle className="text-base sm:text-lg leading-tight line-clamp-2">
                  {performance.titulo_obra}
                </CardTitle>
                <CardDescription className="text-sm">
                  {performance.nome_compositor}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
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
                <div className="flex items-start space-x-2">
                  <User className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-600 mb-1">Maestros:</p>
                    <p className="text-sm line-clamp-2">{performance.maestros}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <Music className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-600 mb-1">Intérpretes:</p>
                    <p className="text-sm line-clamp-2">{performance.interpretes}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mt-4 pt-4 border-t">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => navigate(`/performances/${performance.id}/editar`)}
                  className="flex-1"
                >
                  <Edit className="h-3 w-3 mr-2" />
                  Editar
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleDelete(performance.id)}
                  disabled={deletePerformance.isPending}
                  className="flex-1"
                >
                  <Trash2 className="h-3 w-3 mr-2" />
                  Excluir
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPerformances.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Nenhuma performance encontrada.</p>
          <Button
            onClick={() => navigate('/performances/nova')}
            className="mt-4"
          >
            <Plus className="h-4 w-4 mr-2" />
            Criar primeira performance
          </Button>
        </div>
      )}
    </div>
  );
};

export default Performances;
