
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Upload, Download, Search, FileText, Music, FileSpreadsheet, File, Trash2 } from 'lucide-react';
import { useArquivos } from '@/hooks/useArquivos';
import { usePartituras } from '@/hooks/usePartituras';
import { usePerformances } from '@/hooks/usePerformances';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const uploadSchema = z.object({
  categoria: z.string().min(1, 'Categoria é obrigatória'),
  obra: z.string().min(1, 'Obra é obrigatória'),
  partitura_id: z.string().optional(),
  performance_id: z.string().optional(),
});

type UploadFormData = z.infer<typeof uploadSchema>;

const Repositorio = () => {
  const { arquivos, isLoading, uploadArquivo, downloadArquivo, deleteArquivo } = useArquivos();
  const { partituras } = usePartituras();
  const { performances } = usePerformances();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

  const form = useForm<UploadFormData>({
    resolver: zodResolver(uploadSchema),
    defaultValues: {
      categoria: '',
      obra: '',
      partitura_id: '',
      performance_id: '',
    },
  });

  const filteredArquivos = arquivos.filter(arquivo => {
    const matchesSearch = arquivo.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         arquivo.obra.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || arquivo.categoria === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async (data: UploadFormData) => {
    if (!selectedFile) {
      toast.error('Selecione um arquivo para fazer upload');
      return;
    }

    try {
      await uploadArquivo.mutateAsync({
        file: selectedFile,
        metadata: data
      });
      toast.success('Arquivo enviado com sucesso!');
      setUploadDialogOpen(false);
      setSelectedFile(null);
      form.reset();
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      toast.error('Erro ao fazer upload do arquivo. Tente novamente.');
    }
  };

  const handleDownload = async (arquivo: any) => {
    try {
      await downloadArquivo.mutateAsync(arquivo);
      toast.success('Download iniciado!');
    } catch (error) {
      console.error('Erro ao fazer download:', error);
      toast.error('Erro ao fazer download. Tente novamente.');
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
              <span>Upload Arquivo</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Upload de Arquivo</DialogTitle>
              <DialogDescription>
                Faça upload de um novo arquivo para o repositório
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleUpload)} className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Arquivo</label>
                  <Input
                    type="file"
                    onChange={handleFileSelect}
                    className="mt-2"
                    accept=".pdf,.doc,.docx,.mp3,.wav,.midi,.mid,.mp4,.avi,.mov"
                  />
                  {selectedFile && (
                    <p className="text-xs text-gray-500 mt-1">
                      Arquivo selecionado: {selectedFile.name} ({formatFileSize(selectedFile.size)})
                    </p>
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
            <SelectItem value="">Todas as categorias</SelectItem>
            {categorias.map((categoria) => (
              <SelectItem key={categoria} value={categoria}>
                {categoria}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArquivos.map((arquivo) => (
          <Card key={arquivo.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  {getFileIcon(arquivo.tipo)}
                  <Badge variant="secondary">{arquivo.categoria}</Badge>
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
                  className="flex-1"
                  onClick={() => handleDownload(arquivo)}
                  disabled={downloadArquivo.isPending}
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

      {filteredArquivos.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">Nenhum arquivo encontrado.</p>
        </div>
      )}
    </div>
  );
};

export default Repositorio;
