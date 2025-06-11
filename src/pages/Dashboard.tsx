
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Music, FileText, Users, TrendingUp, Plus, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePartituras } from '@/hooks/usePartituras';
import { usePerformances } from '@/hooks/usePerformances';
import { useAuth } from '@/hooks/useAuth';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { partituras } = usePartituras();
  const { performances } = usePerformances();

  const stats = [
    {
      title: 'Total de Partituras',
      value: partituras?.length || 0,
      icon: Music,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Performances Registradas',
      value: performances?.length || 0,
      icon: FileText,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Digitalizadas',
      value: partituras?.filter(p => p.digitalizado === 'Sim').length || 0,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Usuários Ativos',
      value: '12',
      icon: Users,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ];

  const quickActions = [
    {
      title: 'Nova Partitura',
      description: 'Cadastrar nova partitura no acervo',
      action: () => navigate('/partituras/nova'),
      icon: Plus,
      color: 'bg-blue-600 hover:bg-blue-700',
    },
    {
      title: 'Nova Performance',
      description: 'Registrar nova performance musical',
      action: () => navigate('/performances/nova'),
      icon: Plus,
      color: 'bg-green-600 hover:bg-green-700',
    },
    {
      title: 'Buscar Partituras',
      description: 'Pesquisar no acervo de partituras',
      action: () => navigate('/partituras'),
      icon: Search,
      color: 'bg-purple-600 hover:bg-purple-700',
    },
    {
      title: 'Repositório',
      description: 'Acessar repositório de arquivos',
      action: () => navigate('/repositorio'),
      icon: FileText,
      color: 'bg-orange-600 hover:bg-orange-700',
    },
  ];

  return (
    <div className="space-y-3 sm:space-y-6 p-1 sm:p-0">
      <div className="flex flex-col space-y-3 sm:space-y-4">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
            Dashboard
          </h1>
          <p className="text-gray-600 mt-1 sm:mt-2 text-xs sm:text-sm md:text-base">
            Bem-vindo(a), {profile?.full_name || user?.email}!
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="w-full">
            <CardContent className="p-3 sm:p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-2 sm:p-3 rounded-full ${stat.bgColor}`}>
                  <stat.icon className={`h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="w-full">
        <CardHeader className="p-3 sm:p-4 md:p-6">
          <CardTitle className="text-base sm:text-lg md:text-xl">Ações Rápidas</CardTitle>
          <CardDescription className="text-xs sm:text-sm md:text-base">
            Acesse rapidamente as principais funcionalidades do sistema
          </CardDescription>
        </CardHeader>
        <CardContent className="p-3 sm:p-4 md:p-6 pt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                onClick={action.action}
                className={`h-auto p-3 sm:p-4 flex flex-col items-start space-y-2 ${action.color}`}
              >
                <div className="flex items-center space-x-2 w-full">
                  <action.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="text-xs sm:text-sm font-semibold">{action.title}</span>
                </div>
                <span className="text-xs text-left opacity-90">{action.description}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
        <Card className="w-full">
          <CardHeader className="p-3 sm:p-4 md:p-6">
            <CardTitle className="text-base sm:text-lg md:text-xl">Partituras Recentes</CardTitle>
            <CardDescription className="text-xs sm:text-sm md:text-base">
              Últimas partituras adicionadas ao acervo
            </CardDescription>
          </CardHeader>
          <CardContent className="p-3 sm:p-4 md:p-6 pt-0">
            <div className="space-y-3">
              {partituras?.slice(0, 5).map((partitura, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <Music className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                      {partitura.titulo}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {partitura.compositor}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardHeader className="p-3 sm:p-4 md:p-6">
            <CardTitle className="text-base sm:text-lg md:text-xl">Performances Recentes</CardTitle>
            <CardDescription className="text-xs sm:text-sm md:text-base">
              Últimas performances registradas
            </CardDescription>
          </CardHeader>
          <CardContent className="p-3 sm:p-4 md:p-6 pt-0">
            <div className="space-y-3">
              {performances?.slice(0, 5).map((performance, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <FileText className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                      {performance.titulo_obra}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {performance.local} - {performance.data}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
