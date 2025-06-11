import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react';
import { usePartituras, type Partitura } from '@/hooks/usePartituras';
import { toast } from 'sonner';
import PartituraForm from '@/components/PartituraForm';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const Partituras = () => {
  const navigate = useNavigate();
  const { partituras, isLoading, deletePartitura, updatePartitura } = usePartituras();
  const [searchTerm, setSearchTerm] = useState('');
  const [editingPartitura, setEditingPartitura] = useState<Partitura | null>(null);
  const [viewingPartitura, setViewingPartitura] = useState<Partitura | null>(null);

  const filteredPartituras = partituras.filter(partitura =>
    partitura.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    partitura.compositor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    partitura.setor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (partitura: Partitura) => {
    setEditingPartitura(partitura);
  };

  const handleEditSubmit = async (data: any) => {
    if (!editingPartitura) return;
    
    try {
      await updatePartitura.mutateAsync({
        id: editingPartitura.id,
        updates: data
      });
      toast.success('Partitura atualizada com sucesso!');
      setEditingPartitura(null);
    } catch (error) {
      console.error('Erro ao atualizar partitura:', error);
      toast.error('Erro ao atualizar partitura. Tente novamente.');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta partitura?')) {
      try {
        await deletePartitura.mutateAsync(id);
        toast.success('Partitura excluída com sucesso!');
      } catch (error) {
        console.error('Erro ao excluir partitura:', error);
        toast.error('Erro ao excluir partitura. Tente novamente.');
      }
    }
  };

  const handleView = (partitura: Partitura) => {
    setViewingPartitura(partitura);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Carregando partituras...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Partituras</h1>
          <p className="text-gray-600 mt-2">
            Gerencie o acervo de partituras
          </p>
        </div>
        <Button 
          className="flex items-center space-x-2"
          onClick={() => navigate('/partituras/nova')}
        >
          <Plus className="h-4 w-4" />
          <span>Nova Partitura</span>
        </Button>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar por título, compositor ou setor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPartituras.map((partitura) => (
          <Card key={partitura.id} className="hover:shadow-xl hover:shadow-blue-300/50 transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <Badge variant="secondary">{partitura.setor}</Badge>
                {partitura.digitalizado && (
                  <Badge variant="outline" className="bg-green-50 text-green-700">
                    Digital
                  </Badge>
                )}
              </div>
              <CardTitle className="text-lg">{partitura.titulo}</CardTitle>
              <CardDescription>{partitura.compositor}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">Instrumentação:</span> {partitura.instrumentacao}
                </div>
                {partitura.tonalidade && (
                  <div>
                    <span className="font-medium">Tonalidade:</span> {partitura.tonalidade}
                  </div>
                )}
                {partitura.genero && (
                  <div>
                    <span className="font-medium">Gênero:</span> {partitura.genero}
                  </div>
                )}
                {partitura.numero_pasta && (
                  <div>
                    <span className="font-medium">Pasta:</span> {partitura.numero_pasta}
                  </div>
                )}
              </div>
              
              <div className="flex space-x-2 mt-4">
                <Button size="sm" variant="outline" onClick={() => handleView(partitura)}>
                  <Eye className="h-3 w-3 mr-1" />
                  Ver Detalhes
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleEdit(partitura)}>
                  <Edit className="h-3 w-3 mr-1" />
                  Editar
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleDelete(partitura.id)}>
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPartituras.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">Nenhuma partitura encontrada.</p>
        </div>
      )}

      {/* Dialog para edição */}
      <Dialog open={!!editingPartitura} onOpenChange={() => setEditingPartitura(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Partitura</DialogTitle>
            <DialogDescription>
              Modifique as informações da partitura
            </DialogDescription>
          </DialogHeader>
          {editingPartitura && (
            <PartituraForm
              partitura={editingPartitura}
              onSubmit={handleEditSubmit}
              onCancel={() => setEditingPartitura(null)}
              isSubmitting={updatePartitura.isPending}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog para visualização */}
      <Dialog open={!!viewingPartitura} onOpenChange={() => setViewingPartitura(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes da Partitura</DialogTitle>
          </DialogHeader>
          {viewingPartitura && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">{viewingPartitura.titulo}</h3>
                <p className="text-gray-600">{viewingPartitura.compositor}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Setor:</span> {viewingPartitura.setor}
                </div>
                <div>
                  <span className="font-medium">Digitalizado:</span> {viewingPartitura.digitalizado ? 'Sim' : 'Não'}
                </div>
                <div>
                  <span className="font-medium">Instrumentação:</span> {viewingPartitura.instrumentacao}
                </div>
                {viewingPartitura.tonalidade && (
                  <div>
                    <span className="font-medium">Tonalidade:</span> {viewingPartitura.tonalidade}
                  </div>
                )}
                {viewingPartitura.genero && (
                  <div>
                    <span className="font-medium">Gênero:</span> {viewingPartitura.genero}
                  </div>
                )}
                {viewingPartitura.edicao && (
                  <div>
                    <span className="font-medium">Edição:</span> {viewingPartitura.edicao}
                  </div>
                )}
                {viewingPartitura.ano_edicao && (
                  <div>
                    <span className="font-medium">Ano da Edição:</span> {viewingPartitura.ano_edicao}
                  </div>
                )}
                {viewingPartitura.numero_armario && (
                  <div>
                    <span className="font-medium">Armário:</span> {viewingPartitura.numero_armario}
                  </div>
                )}
                {viewingPartitura.numero_prateleira && (
                  <div>
                    <span className="font-medium">Prateleira:</span> {viewingPartitura.numero_prateleira}
                  </div>
                )}
                {viewingPartitura.numero_pasta && (
                  <div>
                    <span className="font-medium">Pasta:</span> {viewingPartitura.numero_pasta}
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

export default Partituras;
