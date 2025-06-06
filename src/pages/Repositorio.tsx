import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Upload, Download, Search, FileText, Music, FileSpreadsheet, File, Trash2, Eye } from 'lucide-react';
import { useArquivos } from '@/hooks/useArquivos';
import { usePartituras } from '@/hooks/usePartituras';
import { usePerformances } from '@/hooks/usePerformances';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import PartituraViewer from '@/components/PartituraViewer';
import RequestAuthDialog from '@/components/RequestAuthDialog';
import ObraCard from '@/components/ObraCard';

const uploadSchema = z.object({
  categoria: z.string().min(1, 'Categoria é obrigatória'),
  obra: z.string().min(1, 'Obra é obrigatória'),
  partitura_id: z.string().optional(),
  performance_id: z.string().optional(),
  restricao_download: z.boolean().optional(),
});

type UploadFormData = z.infer<typeof uploadSchema>;

const Repositorio = () => {
  const { arquivos, isLoading, uploadArquivo, downloadArquivo, deleteArquivo, solicitarAutorizacao } = useArquivos();
  const { partituras } = usePartituras();
  const { performances } = usePerformances();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [selectedArquivo, setSelectedArquivo] = useState<any>(null);
  const [requestAuthDialogOpen, setRequestAuthDialogOpen] = useState(false);
  const [selectedArquivoForAuth, setSelectedArquivoForAuth] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'grouped' | 'individual'>('grouped');

  const form = useForm<UploadFormData>({
    resolver: zodResolver(uploadSchema),
    defaultValues: {
      categoria: '',
      obra: '',
      partitura_id: '',
      performance_id: '',
      restricao_download: false,
    },
  });

  // Agrupar arquivos por obra
  const arquivosPorObra = arquivos.reduce((acc, arquivo) => {
    const obra = arquivo.obra;
    if (!acc[obra]) {
      acc[obra] = [];
    }
    acc[obra].push(arquivo);
    return acc;
  }, {} as Record<string, any[]>);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 0) {
      setSelectedFiles(files);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async (data: UploadFormData) => {
    if (selectedFiles.length === 0) {
      toast.error('Selecione pelo menos um arquivo para fazer upload');
      return;
    }

    if (!data.categoria || !data.obra) {
      toast.error('Categoria e obra são obrigatórios');
      return;
    }

    try {
      const uploadPromises = selectedFiles.map(async (file) => {
        const metadata = {
          categoria: data.categoria,
          obra: data.obra,
          partitura_id: data.partitura_id && data.partitura_id !== 'none' ? data.partitura_id : undefined,
          performance_id: data.performance_id && data.performance_id !== 'none' ? data.performance_id : undefined,
          restricao_download: data.restricao_download || false,
        };

        return uploadArquivo.mutateAsync({
          file,
          metadata
        });
      });

      await Promise.all(uploadPromises);
      
      toast.success(`${selectedFiles.length} arquivo(s) enviado(s) com sucesso!`);
      setUploadDialogOpen(false);
      setSelectedFiles([]);
      form.reset();
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      toast.error('Erro ao fazer upload dos arquivos. Tente novamente.');
    }
  };

  const handleDownload = async (arquivo: any) => {
    try {
      await downloadArquivo.mutateAsync(arquivo);
      toast.success('Download iniciado!');
    } catch (error: any) {
      console.error('Erro ao fazer download:', error);
      if (error.message === 'AUTHORIZATION_REQUIRED') {
        setSelectedArquivoForAuth(arquivo);
        setRequestAuthDialogOpen(true);
      } else {
        toast.error('Erro ao fazer download. Tente novamente.');
      }
    }
  };

  const handleRequestAuth = async (mensagem: string) => {
    if (!selectedArquivoForAuth) return;
    
    try {
      await solicitarAutorizacao.mutateAsync({
        arquivo: selectedArquivoForAuth,
        mensagem
      });
      toast.success('Solicitação de autorização enviada!');
    } catch (error) {
      console.error('Erro ao solicitar autorização:', error);
      toast.error('Erro ao enviar solicitação. Tente novamente.');
    }
  };

  const handleDelete = async (arquivo: any) => {
    if (confirm('Tem certeza que deseja excluir este arquivo?')) {
      try {
        await deleteArquivo.mutateAsync(arquivo);
        toast.success('Arquivo excluído com sucesso!');
      } catch (error) {
        console.error('Erro ao excluir arquivo:', error);
        toast.error('Erro ao excluir arquivo. Tente novamente.');
      }
    }
  };

  const handleViewFile = (arquivo: any) => {
    setSelectedArquivo(arquivo);
    setViewerOpen(true);
  };

  const getFileIcon = (tipo: string) => {
    if (tipo.includes('pdf')) return <FileText className="h-5 w-5 text-red-500" />;
    if (tipo.includes('audio') || tipo.includes('midi')) return <Music className="h-5 w-5 text-purple-500" />;
    if (tipo.includes('spreadsheet') || tipo.includes('excel')) return <FileSpreadsheet className="h-5 w-5 text-green-500" />;
    return <File className="h-5 w-5 text-gray-500" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const categorias = [
    'Partitura PDF',
    'Áudio de Performance',
    'Vídeo de Performance',
    'Documento de Apoio',
    'MIDI',
    'Outros'
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Carregando repositório...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Repositório</h1>
          <p className="text-gray-600 mt-2">
            Gerencie arquivos digitais do acervo
          </p>
        </div>
        
        <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center space-x-2">
              <Upload className="h-4 w-4" />
              <span>Upload Arquivos</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Upload de Arquivos</DialogTitle>
              <DialogDescription>
                Faça upload de arquivos para o repositório (múltiplos arquivos permitidos)
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleUpload)} className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Arquivos</label>
                  <Input
                    type="file"
                    onChange={handleFileSelect}
                    className="mt-2"
                    accept=".pdf,.doc,.docx,.mp3,.wav,.midi,.mid,.mp4,.avi,.mov"
                    multiple
                  />
                  {selectedFiles.length > 0 && (
                    <div className="mt-2 space-y-1 max-h-32 overflow-y-auto">
                      {selectedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between text-xs bg-gray-50 p-2 rounded">
                          <span className="truncate flex-1">{file.name} ({formatFileSize(file.size)})</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(index)}
                            className="h-4 w-4 p-0 ml-2"
                          >
                            ×
                          </Button>
                        </div>
                      ))}
                      <p className="text-xs text-gray-500 mt-1">
                        Total: {selectedFiles.length} arquivo(s)
                      </p>
                    </div>
                  )}
                </div>

                <FormField
                  control={form.control}
                  name="categoria"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categoria *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a categoria" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categorias.map((categoria) => (
                            <SelectItem key={categoria} value={categoria}>
                              {categoria}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="obra"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome da Obra *</FormLabel>
                      <FormControl>
                        <Input placeholder="Digite o nome da obra" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="partitura_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Partitura Relacionada (Opcional)</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma partitura" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">Nenhuma partitura</SelectItem>
                          {partituras.map((partitura) => (
                            <SelectItem key={partitura.id} value={partitura.id}>
                              {partitura.titulo} - {partitura.compositor}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="performance_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Performance Relacionada (Opcional)</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma performance" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">Nenhuma performance</SelectItem>
                          {performances.map((performance) => (
                            <SelectItem key={performance.id} value={performance.id}>
                              {performance.titulo_obra} - {new Date(performance.data).toLocaleDateString('pt-BR')}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="restricao_download"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={field.onChange}
                          className="mt-1"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          Restringir download
                        </FormLabel>
                        <p className="text-xs text-gray-500">
                          Quando marcado, outros usuários precisarão solicitar autorização para baixar este arquivo
                        </p>
                      </div>
                    </FormItem>
                  )}
                />

                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setUploadDialogOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={uploadArquivo.isPending}>
                    {uploadArquivo.isPending ? 'Enviando...' : 'Enviar'}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar arquivos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filtrar por categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as categorias</SelectItem>
              {categorias.map((categoria) => (
                <SelectItem key={categoria} value={categoria}>
                  {categoria}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === 'grouped' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grouped')}
          >
            Por Obra
          </Button>
          <Button
            variant={viewMode === 'individual' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('individual')}
          >
            Individual
          </Button>
        </div>
      </div>

      {viewMode === 'grouped' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {Object.entries(arquivosPorObra).map(([obra, arquivosObra]) => (
            <ObraCard
              key={obra}
              obra={obra}
              arquivos={arquivosObra}
              onDownload={handleDownload}
              onView={handleViewFile}
              onDelete={handleDelete}
              getFileIcon={getFileIcon}
              formatFileSize={formatFileSize}
              downloadArquivo={downloadArquivo}
              deleteArquivo={deleteArquivo}
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArquivos.map((arquivo) => (
            <Card key={arquivo.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    {getFileIcon(arquivo.tipo)}
                    <Badge variant="secondary">{arquivo.categoria}</Badge>
                    {arquivo.restricao_download && (
                      <Badge variant="outline" className="text-xs">
                        Restrito
                      </Badge>
                    )}
                  </div>
                </div>
                <CardTitle className="text-lg truncate">{arquivo.nome}</CardTitle>
                <CardDescription>{arquivo.obra}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">Tamanho:</span> {formatFileSize(arquivo.tamanho)}
                  </div>
                  <div>
                    <span className="font-medium">Downloads:</span> {arquivo.downloads || 0}
                  </div>
                  <div>
                    <span className="font-medium">Adicionado:</span> {new Date(arquivo.created_at).toLocaleDateString('pt-BR')}
                  </div>
                </div>
                
                <div className="flex space-x-2 mt-4">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleViewFile(arquivo)}
                    className="flex-1"
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    Visualizar
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={() => handleDownload(arquivo)}
                    disabled={downloadArquivo.isPending}
                    className="flex-1"
                  >
                    <Download className="h-3 w-3 mr-1" />
                    Download
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleDelete(arquivo)}
                    disabled={deleteArquivo.isPending}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {filteredArquivos.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">Nenhum arquivo encontrado.</p>
        </div>
      )}

      <PartituraViewer
        isOpen={viewerOpen}
        onClose={() => setViewerOpen(false)}
        arquivo={selectedArquivo}
        onDownload={() => selectedArquivo && handleDownload(selectedArquivo)}
      />

      <RequestAuthDialog
        isOpen={requestAuthDialogOpen}
        onClose={() => setRequestAuthDialogOpen(false)}
        onSubmit={handleRequestAuth}
        arquivoNome={selectedArquivoForAuth?.nome || ''}
      />
    </div>
  );
};

export default Repositorio;
