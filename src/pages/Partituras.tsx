
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Filter, FileMusic, Calendar, User } from 'lucide-react';

const Partituras = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const partituras = [
    {
      id: 1,
      titulo: "Sinfonia nº 9 em Ré menor",
      compositor: "Ludwig van Beethoven",
      genero: "Clássico",
      duracao: "65 min",
      dificuldade: "Avançado",
      status: "Ativo",
      dataAdicao: "2024-01-15",
      ultimaPerformance: "2024-03-20"
    },
    {
      id: 2,
      titulo: "Ave Maria",
      compositor: "Franz Schubert",
      genero: "Sacro",
      duracao: "6 min",
      dificuldade: "Intermediário",
      status: "Ativo",
      dataAdicao: "2024-02-10",
      ultimaPerformance: "2024-05-12"
    },
    {
      id: 3,
      titulo: "O Guarani - Abertura",
      compositor: "Carlos Gomes",
      genero: "Ópera",
      duracao: "8 min",
      dificuldade: "Avançado",
      status: "Ativo",
      dataAdicao: "2024-01-28",
      ultimaPerformance: "2024-04-08"
    }
  ];

  const getDifficultyColor = (dificuldade: string) => {
    switch (dificuldade) {
      case 'Iniciante': return 'bg-green-100 text-green-800';
      case 'Intermediário': return 'bg-yellow-100 text-yellow-800';
      case 'Avançado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Partituras</h1>
          <p className="text-gray-600 mt-2">
            Gerencie seu catálogo de partituras musicais
          </p>
        </div>
        <Button className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Nova Partitura</span>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros e Busca</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por título, compositor ou gênero..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Button variant="outline" className="flex items-center space-x-2">
              <Filter className="h-4 w-4" />
              <span>Filtros Avançados</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {partituras.map((partitura) => (
          <Card key={partitura.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-start justify-between">
                <FileMusic className="h-8 w-8 text-blue-600" />
                <Badge className={getDifficultyColor(partitura.dificuldade)}>
                  {partitura.dificuldade}
                </Badge>
              </div>
              <CardTitle className="text-lg">{partitura.titulo}</CardTitle>
              <CardDescription className="flex items-center space-x-1">
                <User className="h-3 w-3" />
                <span>{partitura.compositor}</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Gênero:</span>
                  <span className="font-medium">{partitura.genero}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Duração:</span>
                  <span className="font-medium">{partitura.duracao}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Última Performance:</span>
                  <span className="font-medium flex items-center space-x-1">
                    <Calendar className="h-3 w-3" />
                    <span>{new Date(partitura.ultimaPerformance).toLocaleDateString('pt-BR')}</span>
                  </span>
                </div>
                <div className="pt-3 border-t">
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      Editar
                    </Button>
                    <Button size="sm" className="flex-1">
                      Ver Detalhes
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Partituras;
