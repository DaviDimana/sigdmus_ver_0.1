
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Search, Eye, Download, FileText, Upload, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePartituras } from '@/hooks/usePartituras';
import { useArquivos } from '@/hooks/useArquivos';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import UploadDialog from '@/components/UploadDialog';
import PartituraViewer from '@/components/PartituraViewer';
import RequestAuthDialog from '@/components/RequestAuthDialog';
import { useAuth } from '@/hooks/useAuth';

const Partituras = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { partituras, isLoading } = usePartituras();
  const { arquivos, getArquivosByPartitura, downloadArquivo } = useArquivos();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedPartitura, setSelectedPartitura] = useState<any>(null);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [selectedArquivo, setSelectedArquivo] = useState<any>(null);
  const [requestAuthOpen, setRequestAuthOpen] = useState(false);

  const filteredPartituras = partituras?.filter(partitura =>
    partitura.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    partitura.compositor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    partitura.setor?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleUpload = (partitura: any) => {
    setSelectedPartitura(partitura);
    setUploadDialogOpen(true);
  };

  const handleView = async (partitura: any) => {
    try {
      const arquivosPartitura = arquivos?.filter(arquivo => arquivo.partitura_id === partitura.id);
      if (arquivosPartitura && arquivosPartitura.length > 0) {
        const arquivo = arquivosPartitura[0];
        
        if (arquivo.restricao_download && profile?.role !== 'ADMIN' && profile?.role !== 'GERENTE') {
          setSelectedArquivo(arquivo);
          setRequestAuthOpen(true);
          return;
        }
        
        setSelectedArquivo(arquivo);
        setViewerOpen(true);
      } else {
        toast.error('Nenhum arquivo encontrado para esta partitura');
      }
    } catch (error) {
      console.error('Erro ao buscar arquivos:', error);
      toast.error('Erro ao buscar arquivos da partitura');
    }
  };

  const handleDownload = async (partitura: any) => {
    try {
      const arquivosPartitura = arquivos?.filter(arquivo => arquivo.partitura_id === partitura.id);
      if (arquivosPartitura && arquivosPartitura.length > 0) {
        const arquivo = arquivosPartitura[0];
        
        if (arquivo.restricao_download && profile?.role !== 'ADMIN' && profile?.role !== 'GERENTE') {
          setSelectedArquivo(arquivo);
          setRequestAuthOpen(true);
          return;
        }
        
        await downloadArquivo.mutateAsync(arquivo.id);
        toast.success('Download iniciado com sucesso');
      } else {
        toast.error('Nenhum arquivo encontrado para esta partitura');
      }
    } catch (error) {
      console.error('Erro no download:', error);
      toast.error('Erro ao fazer download do arquivo');
    }
  };

  const handleRequestAuth = async (mensagem: string) => {
    console.log('Solicitação de autorização:', {
      arquivo: selectedArquivo?.nome,
      usuario: user?.email,
      mensagem
    });
    toast.success('Solicitação enviada com sucesso!');
  };

  const handleViewerDownload = async () => {
    if (selectedArquivo) {
      try {
        await downloadArquivo.mutateAsync(selectedArquivo.id);
        toast.success('Download iniciado com sucesso');
      } catch (error) {
        console.error('Erro no download:', error);
        toast.error('Erro ao fazer download do arquivo');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Partituras</h1>
          <p className="text-gray-600 mt-2">
            Gerencie e consulte o acervo de partituras
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar partituras..."
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
          
          <Button onClick={() => navigate('/partituras/nova')} className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Nova Partitura
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Partituras</CardTitle>
          <CardDescription>
            {filteredPartituras.length} partitura(s) encontrada(s)
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Título</TableHead>
                    <TableHead>Compositor</TableHead>
                    <TableHead>Setor</TableHead>
                    <TableHead>Instrumentação</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-center">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPartituras.map((partitura) => (
                    <TableRow key={partitura.id}>
                      <TableCell className="font-medium">
                        {partitura.titulo}
                      </TableCell>
                      <TableCell>{partitura.compositor}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {partitura.setor}
                        </Badge>
                      </TableCell>
                      <TableCell>{partitura.instrumentacao}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={partitura.digitalizado ? 'default' : 'outline'}
                        >
                          {partitura.digitalizado ? 'Digital' : 'Físico'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center space-x-1">
                          {partitura.digitalizado && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleView(partitura)}
                                className="h-8 w-8 p-0"
                              >
                                <Eye className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDownload(partitura)}
                                className="h-8 w-8 p-0"
                              >
                                <Download className="h-3 w-3" />
                              </Button>
                            </>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleUpload(partitura)}
                            className="h-8 w-8 p-0"
                          >
                            <Upload className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <UploadDialog
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
        partituraId={selectedPartitura?.id}
        partituraTitle={selectedPartitura?.titulo}
      />

      <PartituraViewer
        isOpen={viewerOpen}
        onClose={() => setViewerOpen(false)}
        arquivo={selectedArquivo}
        onDownload={handleViewerDownload}
      />

      <RequestAuthDialog
        isOpen={requestAuthOpen}
        onClose={() => setRequestAuthOpen(false)}
        onSubmit={handleRequestAuth}
        arquivoNome={selectedArquivo?.nome || ''}
      />
    </div>
  );
};

export default Partituras;
