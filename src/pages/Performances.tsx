import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Calendar, MapPin, Clock, Users } from 'lucide-react';

const Performances = () => {
  const navigate = useNavigate();

  const performances = [
    {
      id: 1,
      titulo: "Concerto de Natal",
      obra: "Sinfonia nº 9 - Beethoven",
      data: "2024-12-25",
      horario: "19:30",
      local: "Sala Principal",
      regente: "Maestro Silva",
      publico: 250,
      status: "Agendado",
      tipo: "Concerto"
    },
    {
      id: 2,
      titulo: "Recital de Piano",
      obra: "Ave Maria - Schubert",
      data: "2025-01-02",
      horario: "20:00",
      local: "Auditório",
      regente: "Ana Costa",
      publico: 120,
      status: "Agendado",
      tipo: "Recital"
    },
    {
      id: 3,
      titulo: "Festival de Inverno",
      obra: "O Guarani - Carlos Gomes",
      data: "2024-11-15",
      horario: "18:00",
      local: "Teatro Municipal",
      regente: "Maestro Santos",
      publico: 400,
      status: "Realizado",
      tipo: "Festival"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Agendado': return 'bg-blue-100 text-blue-800';
      case 'Realizado': return 'bg-green-100 text-green-800';
      case 'Cancelado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'Concerto': return 'bg-purple-100 text-purple-800';
      case 'Recital': return 'bg-orange-100 text-orange-800';
      case 'Festival': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Performances</h1>
          <p className="text-gray-600 mt-2">
            Gerencie apresentações e eventos musicais
          </p>
        </div>
        <Button 
          className="flex items-center space-x-2"
          onClick={() => navigate('/performances/nova')}
        >
          <Plus className="h-4 w-4" />
          <span>Nova Performance</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {performances.map((performance) => (
          <Card key={performance.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex space-x-2">
                  <Badge className={getTipoColor(performance.tipo)}>
                    {performance.tipo}
                  </Badge>
                  <Badge className={getStatusColor(performance.status)}>
                    {performance.status}
                  </Badge>
                </div>
              </div>
              <CardTitle className="text-lg">{performance.titulo}</CardTitle>
              <CardDescription>{performance.obra}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-sm">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span>{new Date(performance.data).toLocaleDateString('pt-BR')}</span>
                  <Clock className="h-4 w-4 text-gray-500 ml-2" />
                  <span>{performance.horario}</span>
                </div>
                
                <div className="flex items-center space-x-2 text-sm">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span>{performance.local}</span>
                </div>
                
                <div className="flex items-center space-x-2 text-sm">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span>{performance.publico} pessoas</span>
                </div>
                
                <div className="text-sm">
                  <span className="text-gray-600">Regente: </span>
                  <span className="font-medium">{performance.regente}</span>
                </div>
                
                <div className="pt-3 border-t">
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      Editar
                    </Button>
                    <Button size="sm" className="flex-1">
                      Detalhes
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Calendário de Performances</CardTitle>
          <CardDescription>
            Visão mensal dos eventos programados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>Calendário interativo será implementado na próxima etapa</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Performances;
