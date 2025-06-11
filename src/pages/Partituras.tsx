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
  const { getArquivosByPartitura, downloadArquivo } = useArquivos();
  
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
      const arquivos = await getArquivosByPartitura.mutateAsync(partitura.id);
      if (arquivos && arquivos.length > 0) {
        const arquivo = arquivos[0];
        
        if (arquivo.requer_autorizacao && profile?.role !== 'ADMIN' && profile?.role !== 'GERENTE') {
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
      const arquivos = await getArquivosByPartitura.mutateAsync(partitura.id);
      if (arquivos && arquivos.length > 0) {
        const arquivo = arquivos[0];
        
        if (arquivo.requer_autorizacao && profile?.role !== 'ADMIN' && profile?.role !== 'GERENTE') {
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
    <div className="space-y-3 sm:space-y-6 p-1 sm:p-0">
      <div className="flex flex-col space-y-3 sm:space-y-4">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">Partituras</h1>
          <p className="text-gray-600 mt-1 sm:mt-2 text-xs sm:text-sm md:text-base">
            Gerencie e consulte o acervo de partituras
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar partituras..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 text-sm"
              />
            </div>
            <Button variant="outline" size="sm" className="w-full sm:w-auto">
              <Filter className="h-4 w-4 mr-2" />
              <span className="text-sm">Filtros</span>
            </Button>
          </div>
          
          <Button onClick={() => navigate('/partituras/nova')} className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            <span className="text-sm">Nova Partitura</span>
          </Button>
        </div>
      </div>

      <Card className="w-full">
        <CardHeader className="p-3 sm:p-4 md:p-6">
          <CardTitle className="text-base sm:text-lg md:text-xl">Lista de Partituras</CardTitle>
          <CardDescription className="text-xs sm:text-sm md:text-base">
            {filteredPartituras.length} partitura(s) encontrada(s)
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-3 sm:p-4 md:p-6 space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs sm:text-sm">Título</TableHead>
                    <TableHead className="text-xs sm:text-sm">Compositor</TableHead>
                    <TableHead className="text-xs sm:text-sm">Setor</TableHead>
                    <TableHead className="text-xs sm:text-sm">Instrumentação</TableHead>
                    <TableHead className="text-xs sm:text-sm">Status</TableHead>
                    <TableHead className="text-xs sm:text-sm text-center">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPartituras.map((partitura) => (
                    <TableRow key={partitura.id}>
                      <TableCell className="font-medium text-xs sm:text-sm">
                        {partitura.titulo}
                      </TableCell>
                      <TableCell className="text-xs sm:text-sm">{partitura.compositor}</TableCell>
                      <TableCell className="text-xs sm:text-sm">
                        <Badge variant="secondary" className="text-xs">
                          {partitura.setor}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs sm:text-sm">{partitura.instrumentacao}</TableCell>
                      <TableCell className="text-xs sm:text-sm">
                        <Badge 
                          variant={partitura.digitalizado === 'Sim' ? 'default' : 'outline'}
                          className="text-xs"
                        >
                          {partitura.digitalizado === 'Sim' ? 'Digital' : 'Físico'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center space-x-1">
                          {partitura.digitalizado === 'Sim' && (
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
        isOpen={uploadDialogOpen}
        onClose={() => setUploadDialogOpen(false)}
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
