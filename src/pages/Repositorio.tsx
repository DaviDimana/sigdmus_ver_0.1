import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { FileText, Upload, Download, Search, Folder, File } from 'lucide-react';
import UploadDialog from '@/components/UploadDialog';

const Repositorio = () => {
  const arquivos = [
    {
      id: 1,
      nome: "Sinfonia_9_Beethoven_Partitura_Completa.pdf",
      tipo: "PDF",
      tamanho: "2.4 MB",
      dataUpload: "2024-01-15",
      categoria: "Partitura Completa",
      obra: "Sinfonia nº 9 - Beethoven",
      downloads: 45
    },
    {
      id: 2,
      nome: "Ave_Maria_Schubert_Piano.pdf",
      tipo: "PDF",
      tamanho: "1.2 MB",
      dataUpload: "2024-02-10",
      categoria: "Parte Individual",
      obra: "Ave Maria - Schubert",
      downloads: 23
    },
    {
      id: 3,
      nome: "Guarani_Abertura_Orquestra.pdf",
      tipo: "PDF",
      tamanho: "3.1 MB",
      dataUpload: "2024-01-28",
      categoria: "Partitura Completa",
      obra: "O Guarani - Carlos Gomes",
      downloads: 18
    }
  ];

  const categorias = [
    { nome: "Partitura Completa", count: 15, color: "bg-blue-100 text-blue-800" },
    { nome: "Parte Individual", count: 32, color: "bg-green-100 text-green-800" },
    { nome: "Redução Piano", count: 8, color: "bg-purple-100 text-purple-800" },
    { nome: "Áudio de Referência", count: 12, color: "bg-orange-100 text-orange-800" }
  ];

  const handleUpload = (file: File, data: any) => {
    console.log('Arquivo enviado:', file);
    console.log('Dados do formulário:', data);
    // Aqui seria implementada a lógica para salvar no banco de dados
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Repositório</h1>
          <p className="text-gray-600 mt-2">
            Organize e gerencie arquivos PDF das partituras
          </p>
        </div>
        <UploadDialog onUpload={handleUpload}>
          <Button className="flex items-center space-x-2">
            <Upload className="h-4 w-4" />
            <span>Upload de Arquivo</span>
          </Button>
        </UploadDialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {categorias.map((categoria, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Folder className="h-6 w-6 text-gray-500" />
                <Badge className={categoria.color}>
                  {categoria.count}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <h3 className="font-semibold text-sm">{categoria.nome}</h3>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Buscar Arquivos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por nome do arquivo, obra ou categoria..."
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Arquivos Recentes</CardTitle>
          <CardDescription>
            Últimos arquivos adicionados ao repositório
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {arquivos.map((arquivo) => (
              <div key={arquivo.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-4">
                  <FileText className="h-8 w-8 text-red-500" />
                  <div>
                    <h4 className="font-medium text-gray-900">{arquivo.nome}</h4>
                    <p className="text-sm text-gray-500">{arquivo.obra}</p>
                    <div className="flex items-center space-x-4 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {arquivo.categoria}
                      </Badge>
                      <span className="text-xs text-gray-400">{arquivo.tamanho}</span>
                      <span className="text-xs text-gray-400">
                        {new Date(arquivo.dataUpload).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <p className="text-sm text-gray-600">{arquivo.downloads} downloads</p>
                  </div>
                  <Button size="sm" variant="outline" className="flex items-center space-x-1">
                    <Download className="h-3 w-3" />
                    <span>Download</span>
                  </Button>
                  <Button size="sm" variant="ghost">
                    <File className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Repositorio;
