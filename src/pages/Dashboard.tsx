import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileMusic, Calendar, FolderOpen, Users, TrendingUp, Activity } from 'lucide-react';
import { usePartituras } from '@/hooks/usePartituras';
import { usePerformances } from '@/hooks/usePerformances';
import { useArquivos } from '@/hooks/useArquivos';

const Dashboard = () => {
  const { partituras, isLoading: loadingPartituras } = usePartituras();
  const { performances, isLoading: loadingPerformances } = usePerformances();
  const { arquivos, isLoading: loadingArquivos } = useArquivos();

  // Calculate statistics
  const totalPartituras = partituras.length;
  const totalArquivos = arquivos.length;
  const totalPerformances = performances.length;
  
  // Get performances from this month
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const performancesThisMonth = performances.filter(performance => {
    const performanceDate = new Date(performance.data);
    return performanceDate.getMonth() === currentMonth && performanceDate.getFullYear() === currentYear;
  }).length;

  // Get next performances (upcoming)
  const today = new Date();
  const upcomingPerformances = performances
    .filter(performance => new Date(performance.data) > today)
    .sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime())
    .slice(0, 3);

  // Get recent activities (latest partituras and performances)
  const recentPartituras = partituras
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 2);

  const recentPerformances = performances
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 2);

  // Get total downloads from arquivos
  const totalDownloads = arquivos.reduce((sum, arquivo) => sum + (arquivo.downloads || 0), 0);

  const stats = [
    {
      title: 'Total de Partituras',
      value: loadingPartituras ? '...' : totalPartituras.toString(),
      description: 'Obras catalogadas',
      icon: FileMusic,
      color: 'text-blue-600'
    },
    {
      title: 'Performances',
      value: loadingPerformances ? '...' : performancesThisMonth.toString(),
      description: 'Este mês',
      icon: Calendar,
      color: 'text-green-600'
    },
    {
      title: 'Arquivos PDF',
      value: loadingArquivos ? '...' : totalArquivos.toString(),
      description: 'No repositório',
      icon: FolderOpen,
      color: 'text-purple-600'
    },
    {
      title: 'Total Downloads',
      value: loadingArquivos ? '...' : totalDownloads.toString(),
      description: 'Do repositório',
      icon: TrendingUp,
      color: 'text-orange-600'
    }
  ];

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Há poucos minutos';
    if (diffInHours < 24) return `${diffInHours}h atrás`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return '1d atrás';
    return `${diffInDays}d atrás`;
  };

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
          <Card key={index} className="hover:shadow-xl hover:shadow-blue-300/50 transition-shadow">
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
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>Atividades Recentes</span>
            </CardTitle>
            <CardDescription>
              Últimas ações realizadas no sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentPartituras.map((partitura) => (
                <div key={`partitura-${partitura.id}`} className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Nova partitura adicionada</p>
                    <p className="text-xs text-gray-500">{partitura.titulo} - {partitura.compositor}</p>
                  </div>
                  <span className="text-xs text-gray-400">{formatTimeAgo(partitura.created_at)}</span>
                </div>
              ))}
              {recentPerformances.map((performance) => (
                <div key={`performance-${performance.id}`} className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Performance registrada</p>
                    <p className="text-xs text-gray-500">{performance.titulo_obra}</p>
                  </div>
                  <span className="text-xs text-gray-400">{formatTimeAgo(performance.created_at)}</span>
                </div>
              ))}
              {recentPartituras.length === 0 && recentPerformances.length === 0 && (
                <div className="text-center py-4">
                  <p className="text-sm text-gray-500">Nenhuma atividade recente</p>
                </div>
              )}
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
              {upcomingPerformances.map((performance) => (
                <div key={performance.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div>
                    <p className="font-medium text-blue-900">{performance.titulo_obra}</p>
                    <p className="text-sm text-blue-700">{performance.local}</p>
                  </div>
                  <span className="text-sm font-medium text-blue-600">
                    {new Date(performance.data).toLocaleDateString('pt-BR', { 
                      day: '2-digit', 
                      month: 'short' 
                    })}
                  </span>
                </div>
              ))}
              {upcomingPerformances.length === 0 && (
                <div className="text-center py-4">
                  <p className="text-sm text-gray-500">Nenhuma performance agendada</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
