
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileMusic, Calendar, FolderOpen, Users } from 'lucide-react';

const Dashboard = () => {
  const stats = [
    {
      title: 'Total de Partituras',
      value: '156',
      description: 'Obras catalogadas',
      icon: FileMusic,
      color: 'text-blue-600'
    },
    {
      title: 'Performances',
      value: '23',
      description: 'Este mês',
      icon: Calendar,
      color: 'text-green-600'
    },
    {
      title: 'Arquivos PDF',
      value: '98',
      description: 'No repositório',
      icon: FolderOpen,
      color: 'text-purple-600'
    },
    {
      title: 'Usuários Ativos',
      value: '12',
      description: 'Último mês',
      icon: Users,
      color: 'text-orange-600'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Visão geral do sistema de gerenciamento musical
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <CardDescription className="text-xs text-muted-foreground">
                {stat.description}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Atividades Recentes</CardTitle>
            <CardDescription>
              Últimas ações realizadas no sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Nova partitura adicionada</p>
                  <p className="text-xs text-gray-500">Sinfonia nº 9 - Beethoven</p>
                </div>
                <span className="text-xs text-gray-400">2h atrás</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Performance registrada</p>
                  <p className="text-xs text-gray-500">Concerto de Primavera</p>
                </div>
                <span className="text-xs text-gray-400">5h atrás</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Arquivo PDF carregado</p>
                  <p className="text-xs text-gray-500">Partitura - Ave Maria</p>
                </div>
                <span className="text-xs text-gray-400">1d atrás</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Próximas Performances</CardTitle>
            <CardDescription>
              Eventos musicais programados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div>
                  <p className="font-medium text-blue-900">Concerto de Natal</p>
                  <p className="text-sm text-blue-700">Sala Principal</p>
                </div>
                <span className="text-sm font-medium text-blue-600">25 Dez</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <p className="font-medium text-green-900">Recital de Piano</p>
                  <p className="text-sm text-green-700">Auditório</p>
                </div>
                <span className="text-sm font-medium text-green-600">02 Jan</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div>
                  <p className="font-medium text-purple-900">Festival de Inverno</p>
                  <p className="text-sm text-purple-700">Teatro Municipal</p>
                </div>
                <span className="text-sm font-medium text-purple-600">15 Jan</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
