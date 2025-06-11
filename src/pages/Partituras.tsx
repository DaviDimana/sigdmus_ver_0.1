
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Download, Eye, Upload, FileText, Music, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePartituras } from '@/hooks/usePartituras';
import { useArquivos } from '@/hooks/useArquivos';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import PartituraViewer from '@/components/PartituraViewer';
import UploadDialog from '@/components/UploadDialog';

const Partituras = () => {
  const navigate = useNavigate();
  const { partituras, isLoading } = usePartituras();
  const { arquivos, downloadArquivo } = useArquivos();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPartitura, setSelectedPartitura] = useState<any>(null);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedPartituraForUpload, setSelectedPartituraForUpload] = useState<any>(null);

  const filteredPartituras = partituras?.filter(partitura =>
    partitura.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    partitura.compositor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (partitura.genero && partitura.genero.toLowerCase().includes(searchTerm.toLowerCase()))
  ) || [];

  const handleDownload = async (arquivo: any) => {
    try {
      await downloadArquivo.mutateAsync(arquivo);
      toast.success('Download iniciado com sucesso!');
    } catch (error) {
      console.error('Erro ao fazer download:', error);
      toast.error('Erro ao fazer download do arquivo');
    }
  };

  const handleView = (partitura: any) => {
    setSelectedPartitura(partitura);
    setViewerOpen(true);
  };

  const handleUpload = (partitura: any) => {
    setSelectedPartituraForUpload(partitura);
    setUploadDialogOpen(true);
  };

  const getGenreColor = (genre: string) => {
    const colors = {
      'CLASSICO': 'bg-blue-100 text-blue-800',
      'BARROCO': 'bg-purple-100 text-purple-800',
      'ROMANTICO': 'bg-pink-100 text-pink-800',
      'MODERNO': 'bg-green-100 text-green-800',
      'CONTEMPORANEO': 'bg-orange-100 text-orange-800',
      'POPULAR': 'bg-yellow-100 text-yellow-800',
    };
    return colors[genre as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const canUpload = user && (
    user.role === 'ADMIN' || 
    user.role === 'GERENTE' || 
    user.role === 'ARQUIVISTA'
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Partituras</h1>
            <p className="text-gray-600 mt-2">
              Gerencie o acervo de partituras musicais
            </p>
          </div>
          <Button 
            onClick={() => navigate('/nova-partitura')}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nova Partitura
          </Button>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por título, compositor ou gênero..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPartituras.map((partitura) => {
          const relatedArquivos = arquivos?.filter(arquivo => arquivo.partitura_id === partitura.id) || [];
          
          return (
            <Card key={partitura.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg font-semibold line-clamp-2">
                    {partitura.titulo}
                  </CardTitle>
                  <Badge className="bg-green-100 text-green-800">
                    ATIVO
                  </Badge>
                </div>
                <CardDescription className="space-y-1">
                  <div className="flex items-center text-sm text-gray-600">
                    <User className="h-4 w-4 mr-1" />
                    {partitura.compositor}
                  </div>
                  <div className="flex items-center justify-between">
                    {partitura.genero && (
                      <Badge variant="outline" className={getGenreColor(partitura.genero)}>
                        {partitura.genero}
                      </Badge>
                    )}
                    {partitura.ano_edicao && (
                      <span className="text-xs text-gray-500">
                        {partitura.ano_edicao}
                      </span>
                    )}
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Instrumentação:</span>
                    <span className="font-medium">{partitura.instrumentacao}</span>
                  </div>
                  
                  {partitura.edicao && (
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>Edição:</span>
                      <span className="font-medium">{partitura.edicao}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Arquivos:</span>
                    <span className="font-medium">{relatedArquivos.length}</span>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleView(partitura)}
                      className="flex-1"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Ver
                    </Button>
                    
                    {relatedArquivos.length > 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownload(relatedArquivos[0])}
                        className="flex-1"
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    )}
                    
                    {canUpload && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUpload(partitura)}
                        className="flex-1"
                      >
                        <Upload className="h-4 w-4 mr-1" />
                        Upload
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredPartituras.length === 0 && !isLoading && (
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
            <Button onClick={() => navigate('/nova-partitura')}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Partitura
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Dialogs */}
      {selectedPartitura && relatedArquivos && relatedArquivos.length > 0 && (
        <PartituraViewer
          open={viewerOpen}
          onOpenChange={setViewerOpen}
          arquivo={relatedArquivos[0]}
          onDownload={() => handleDownload(relatedArquivos[0])}
        />
      )}

      <UploadDialog
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
        partituraId={selectedPartituraForUpload?.id}
        partituraTitle={selectedPartituraForUpload?.titulo}
      />
    </div>
  );
};

export default Partituras;
