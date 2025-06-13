
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  FolderOpen, 
  Upload, 
  Download, 
  Search, 
  FileText, 
  Music, 
  FileAudio,
  Grid3X3,
  List,
  Filter,
  Calendar,
  User,
  Tag
} from 'lucide-react';

const Repositorio = () => {
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', name: 'Todos', icon: FolderOpen, count: 59, color: 'text-gray-500' },
    { id: 'partituras', name: 'Partituras', icon: Music, count: 24, color: 'text-blue-500' },
    { id: 'audios', name: 'Áudios', icon: FileAudio, count: 12, color: 'text-green-500' },
    { id: 'programas', name: 'Programas', icon: FileText, count: 8, color: 'text-purple-500' },
    { id: 'relatorios', name: 'Relatórios', icon: FileText, count: 15, color: 'text-orange-500' }
  ];

  const recentFiles = [
    {
      id: 1,
      name: 'Sinfonia_n9_Beethoven.pdf',
      type: 'Partitura',
      size: '2.4 MB',
      date: '10/06/2024',
      author: 'João Silva',
      category: 'partituras',
      tags: ['Clássico', 'Beethoven', 'Sinfonia']
    },
    {
      id: 2,
      name: 'Programa_Concerto_Primavera.pdf',
      type: 'Programa',
      size: '1.2 MB',
      date: '08/06/2024',
      author: 'Maria Santos',
      category: 'programas',
      tags: ['Concerto', 'Primavera', '2024']
    },
    {
      id: 3,
      name: 'Relatório_Mensal_Maio.pdf',
      type: 'Relatório',
      size: '890 KB',
      date: '05/06/2024',
      author: 'Carlos Oliveira',
      category: 'relatorios',
      tags: ['Mensal', 'Maio', 'Gestão']
    },
    {
      id: 4,
      name: 'Audio_Ensaio_Requiem.mp3',
      type: 'Áudio',
      size: '15.2 MB',
      date: '03/06/2024',
      author: 'Ana Costa',
      category: 'audios',
      tags: ['Ensaio', 'Requiem', 'Mozart']
    }
  ];

  const filteredFiles = selectedCategory === 'all' 
    ? recentFiles 
    : recentFiles.filter(file => file.category === selectedCategory);

  const getFileIcon = (category: string) => {
    switch (category) {
      case 'partituras': return Music;
      case 'audios': return FileAudio;
      case 'programas': return FileText;
      case 'relatorios': return FileText;
      default: return FileText;
    }
  };

  const getFileColor = (category: string) => {
    switch (category) {
      case 'partituras': return 'text-blue-500';
      case 'audios': return 'text-green-500';
      case 'programas': return 'text-purple-500';
      case 'relatorios': return 'text-orange-500';
      default: return 'text-gray-500';
    }
  };

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

      {/* Barra de Busca e Controles */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar arquivos..."
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>
          <Button 
            variant={viewType === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewType('grid')}
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button 
            variant={viewType === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewType('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Categorias */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {categories.map((category) => {
          const IconComponent = category.icon;
          return (
            <Card 
              key={category.id}
              className={`cursor-pointer transition-all hover:shadow-lg ${
                selectedCategory === category.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
              }`}
              onClick={() => setSelectedCategory(category.id)}
            >
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center h-12 mb-3">
                  <IconComponent className={`h-8 w-8 ${category.color}`} />
                </div>
                <h3 className="font-medium text-sm">{category.name}</h3>
                <p className="text-xs text-gray-500 mt-1">{category.count} arquivos</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Lista de Arquivos */}
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>
              {selectedCategory === 'all' ? 'Todos os Arquivos' : 
                categories.find(cat => cat.id === selectedCategory)?.name || 'Arquivos'}
            </span>
            <Badge variant="secondary">
              {filteredFiles.length} arquivo{filteredFiles.length !== 1 ? 's' : ''}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {viewType === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredFiles.map((file) => {
                const FileIcon = getFileIcon(file.category);
                const fileColor = getFileColor(file.category);
                
                return (
                  <Card key={file.id} className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <FileIcon className={`h-8 w-8 ${fileColor} flex-shrink-0 mt-1`} />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm truncate">{file.name}</h4>
                          <p className="text-xs text-gray-500 mt-1">{file.type} • {file.size}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Calendar className="h-3 w-3 text-gray-400" />
                            <span className="text-xs text-gray-500">{file.date}</span>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <User className="h-3 w-3 text-gray-400" />
                            <span className="text-xs text-gray-500">{file.author}</span>
                          </div>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {file.tags.slice(0, 2).map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs px-1 py-0">
                                {tag}
                              </Badge>
                            ))}
                            {file.tags.length > 2 && (
                              <Badge variant="outline" className="text-xs px-1 py-0">
                                +{file.tags.length - 2}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <Button size="sm" variant="outline" className="flex-shrink-0">
                          <Download className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredFiles.map((file) => {
                const FileIcon = getFileIcon(file.category);
                const fileColor = getFileColor(file.category);
                
                return (
                  <div key={file.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <FileIcon className={`h-6 w-6 ${fileColor} flex-shrink-0`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3">
                          <p className="font-medium text-sm truncate">{file.name}</p>
                          <div className="flex flex-wrap gap-1">
                            {file.tags.slice(0, 3).map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs px-1 py-0">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-xs text-gray-500">{file.type} • {file.size}</span>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3 text-gray-400" />
                            <span className="text-xs text-gray-500">{file.date}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3 text-gray-400" />
                            <span className="text-xs text-gray-500">{file.author}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Repositorio;
