
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Plus, Calendar, MapPin, Clock, Users, Search, Edit, Trash2, Eye } from 'lucide-react';
import { usePerformances, type Performance } from '@/hooks/usePerformances';
import { toast } from 'sonner';
import PerformanceForm from '@/components/PerformanceForm';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const Performances = () => {
  const navigate = useNavigate();
  const { performances, isLoading, deletePerformance, updatePerformance } = usePerformances();
  const [searchTerm, setSearchTerm] = useState('');
  const [editingPerformance, setEditingPerformance] = useState<Performance | null>(null);
  const [viewingPerformance, setViewingPerformance] = useState<Performance | null>(null);

  const filteredPerformances = performances.filter(performance =>
    performance.titulo_obra.toLowerCase().includes(searchTerm.toLowerCase()) ||
    performance.nome_compositor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    performance.local.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (performance: Performance) => {
    setEditingPerformance(performance);
  };

  const handleEditSubmit = async (data: any) => {
    if (!editingPerformance) return;
    
    try {
      await updatePerformance.mutateAsync({
        id: editingPerformance.id,
        updates: data
      });
      toast.success('Performance atualizada com sucesso!');
      setEditingPerformance(null);
    } catch (error) {
      console.error('Erro ao atualizar performance:', error);
      toast.error('Erro ao atualizar performance. Tente novamente.');
    }
  };

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

  const handleView = (performance: Performance) => {
    setViewingPerformance(performance);
  };

  const getStatusFromDate = (data: string) => {
    const today = new Date();
    const performanceDate = new Date(data);
    return performanceDate > today ? 'Agendado' : 'Realizado';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Agendado': return 'bg-blue-100 text-blue-800';
      case 'Realizado': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Performances</h1>
          <p className="text-gray-600 mt-2">
            Gerencie apresentações e eventos musicais
          </p>
        </div>
        <Button 
          className="flex items-center space-x-2"
          onClick={() => navigate('/performances/nova')}
        >
          <Plus className="h-4 w-4" />
          <span>Nova Performance</span>
        </Button>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar por obra, compositor ou local..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPerformances.map((performance) => {
          const status = getStatusFromDate(performance.data);
          return (
            <Card key={performance.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <Badge className={getStatusColor(status)}>
                    {status}
                  </Badge>
                </div>
                <CardTitle className="text-lg">{performance.titulo_obra}</CardTitle>
                <CardDescription>{performance.nome_compositor}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-sm">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span>{new Date(performance.data).toLocaleDateString('pt-BR')}</span>
                    <Clock className="h-4 w-4 text-gray-500 ml-2" />
                    <span>{performance.horario}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span>{performance.local}</span>
                  </div>
                  
                  <div className="text-sm">
                    <span className="text-gray-600">Maestro: </span>
                    <span className="font-medium">{performance.maestros}</span>
                  </div>
                  
                  <div className="pt-3 border-t">
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" onClick={() => handleView(performance)}>
                        <Eye className="h-3 w-3 mr-1" />
                        Detalhes
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleEdit(performance)}>
                        <Edit className="h-3 w-3 mr-1" />
                        Editar
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDelete(performance.id)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredPerformances.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">Nenhuma performance encontrada.</p>
        </div>
      )}

      {/* Dialog para edição */}
      <Dialog open={!!editingPerformance} onOpenChange={() => setEditingPerformance(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Performance</DialogTitle>
            <DialogDescription>
              Modifique as informações da performance
            </DialogDescription>
          </DialogHeader>
          {editingPerformance && (
            <PerformanceForm
              performance={editingPerformance}
              onSubmit={handleEditSubmit}
              onCancel={() => setEditingPerformance(null)}
              isSubmitting={updatePerformance.isPending}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog para visualização */}
      <Dialog open={!!viewingPerformance} onOpenChange={() => setViewingPerformance(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes da Performance</DialogTitle>
          </DialogHeader>
          {viewingPerformance && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">{viewingPerformance.titulo_obra}</h3>
                <p className="text-gray-600">{viewingPerformance.nome_compositor}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Data:</span> {new Date(viewingPerformance.data).toLocaleDateString('pt-BR')}
                </div>
                <div>
                  <span className="font-medium">Horário:</span> {viewingPerformance.horario}
                </div>
                <div>
                  <span className="font-medium">Local:</span> {viewingPerformance.local}
                </div>
                <div>
                  <span className="font-medium">Status:</span> {getStatusFromDate(viewingPerformance.data)}
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">Maestro(s):</span>
                  <p className="mt-1">{viewingPerformance.maestros}</p>
                </div>
                <div>
                  <span className="font-medium">Intérprete(s):</span>
                  <p className="mt-1">{viewingPerformance.interpretes}</p>
                </div>
                {viewingPerformance.release && (
                  <div>
                    <span className="font-medium">Release:</span>
                    <p className="mt-1">{viewingPerformance.release}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Performances;
