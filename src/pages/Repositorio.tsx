import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FolderOpen, Upload, Download, Search, FileText } from 'lucide-react';
import { Input } from '@/components/ui/input';

const Repositorio = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Repositório</h1>
          <p className="text-gray-600 mt-2">
            Gerencie arquivos e documentos do sistema
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Upload className="h-4 w-4 mr-2" />
          Upload de Arquivo
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar arquivos..."
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <FolderOpen className="h-4 w-4 mr-2" />
          Nova Pasta
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <Card className="shadow-xl hover:shadow-2xl transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center justify-center h-20 mb-4">
              <FolderOpen className="h-12 w-12 text-blue-500" />
            </div>
            <h3 className="font-medium text-center">Partituras</h3>
            <p className="text-sm text-gray-500 text-center mt-1">24 arquivos</p>
          </CardContent>
        </Card>

        <Card className="shadow-xl hover:shadow-2xl transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center justify-center h-20 mb-4">
              <FolderOpen className="h-12 w-12 text-green-500" />
            </div>
            <h3 className="font-medium text-center">Áudios</h3>
            <p className="text-sm text-gray-500 text-center mt-1">12 arquivos</p>
          </CardContent>
        </Card>

        <Card className="shadow-xl hover:shadow-2xl transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center justify-center h-20 mb-4">
              <FolderOpen className="h-12 w-12 text-purple-500" />
            </div>
            <h3 className="font-medium text-center">Programas</h3>
            <p className="text-sm text-gray-500 text-center mt-1">8 arquivos</p>
          </CardContent>
        </Card>

        <Card className="shadow-xl hover:shadow-2xl transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center justify-center h-20 mb-4">
              <FileText className="h-12 w-12 text-orange-500" />
            </div>
            <h3 className="font-medium text-center">Relatórios</h3>
            <p className="text-sm text-gray-500 text-center mt-1">15 arquivos</p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle>Arquivos Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <FileText className="h-8 w-8 text-red-500" />
                <div>
                  <p className="font-medium">Sinfonia_n9_Beethoven.pdf</p>
                  <p className="text-sm text-gray-500">Adicionado em 10/06/2024</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button size="sm" variant="outline">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <FileText className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="font-medium">Programa_Concerto_Primavera.pdf</p>
                  <p className="text-sm text-gray-500">Adicionado em 08/06/2024</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button size="sm" variant="outline">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <FileText className="h-8 w-8 text-green-500" />
                <div>
                  <p className="font-medium">Relatório_Mensal_Maio.pdf</p>
                  <p className="text-sm text-gray-500">Adicionado em 05/06/2024</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button size="sm" variant="outline">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Repositorio;
