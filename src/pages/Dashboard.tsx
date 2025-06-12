
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, FileText, Music, Users, Clock, Download } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { usePartituras } from '@/hooks/usePartituras';
import { usePerformances } from '@/hooks/usePerformances';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const Dashboard = () => {
  const { profile } = useAuth();
  const { partituras, isLoading: loadingPartituras } = usePartituras();
  const { performances, isLoading: loadingPerformances } = usePerformances();

  // Calcular estatísticas reais
  const totalPartituras = partituras?.length || 0;
  const totalPerformances = performances?.length || 0;
  const partiturasDigitalizadas = partituras?.filter(p => p.digitalizado).length || 0;
  
  // Atividades recentes baseadas em dados reais
  const getRecentActivities = () => {
    const activities = [];
    
    // Últimas partituras adicionadas
    const recentPartituras = partituras?.slice(0, 3) || [];
    recentPartituras.forEach(partitura => {
      activities.push({
        id: `partitura-${partitura.id}`,
        action: "Nova partitura adicionada",
        item: `${partitura.titulo} - ${partitura.compositor}`,
        user: "Sistema",
        time: format(new Date(partitura.created_at), 'dd/MM/yyyy HH:mm', { locale: ptBR }),
        type: "upload",
        timestamp: new Date(partitura.created_at)
      });
    });

    // Últimas performances registradas
    const recentPerformances = performances?.slice(0, 3) || [];
    recentPerformances.forEach(performance => {
      activities.push({
        id: `performance-${performance.id}`,
        action: "Performance registrada",
        item: `${performance.titulo_obra} - ${performance.nome_compositor}`,
        user: "Sistema",
        time: format(new Date(performance.created_at), 'dd/MM/yyyy HH:mm', { locale: ptBR }),
        type: "performance",
        timestamp: new Date(performance.created_at)
      });
    });

    // Ordenar por data mais recente
    return activities
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 5);
  };

  // Próximas performances
  const getUpcomingPerformances = () => {
    const today = new Date();
    return performances?.filter(performance => {
      const performanceDate = new Date(performance.data);
      return performanceDate >= today;
    })
    .sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime())
    .slice(0, 3) || [];
  };

  const stats = [
    {
      title: "Total de Partituras",
      value: loadingPartituras ? "..." : totalPartituras.toString(),
      description: "Partituras catalogadas",
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      title: "Performances",
      value: loadingPerformances ? "..." : totalPerformances.toString(),
      description: "Performances registradas",
      icon: Music,
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      title: "Digitalizadas",
      value: loadingPartituras ? "..." : partiturasDigitalizadas.toString(),
      description: "Partituras digitalizadas",
      icon: Download,
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    },
    {
      title: "Usuários Ativos",
      value: "1", // Por enquanto apenas o usuário logado
      description: "Usuários cadastrados",
      icon: Users,
      color: "text-orange-600",
      bgColor: "bg-orange-100"
    }
  ];

  const recentActivities = getRecentActivities();
  const upcomingPerformances = getUpcomingPerformances();

  const formatDateForCard = (dateString: string) => {
    const date = new Date(dateString);
    return {
      day: format(date, 'dd'),
      month: format(date, 'MMM', { locale: ptBR }).toUpperCase()
    };
  };

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Hoje";
    if (diffDays === 1) return "Amanhã";
    if (diffDays < 7) return `Em ${diffDays} dias`;
    if (diffDays < 14) return "Em 1 semana";
    return `Em ${Math.ceil(diffDays / 7)} semanas`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Bem-vindo ao Sistema de Acervos Musicais
          {profile && (
            <span className="ml-2">
              <Badge variant="outline" className="ml-2">
                {profile.name}
              </Badge>
            </span>
          )}
        </p>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Atividades Recentes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="mr-2 h-5 w-5" />
              Atividades Recentes
            </CardTitle>
            <CardDescription>
              Últimas atividades no sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.length > 0 ? (
                recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-4">
                    <div className={`p-2 rounded-full ${
                      activity.type === 'upload' ? 'bg-blue-100' :
                      activity.type === 'performance' ? 'bg-green-100' :
                      'bg-orange-100'
                    }`}>
                      {activity.type === 'upload' && <FileText className="h-4 w-4 text-blue-600" />}
                      {activity.type === 'performance' && <Music className="h-4 w-4 text-green-600" />}
                      {activity.type === 'download' && <Download className="h-4 w-4 text-orange-600" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.action}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {activity.item}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">{activity.user}</p>
                      <p className="text-xs text-gray-400">{activity.time}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">Nenhuma atividade recente</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Próximos Eventos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              Próximas Performances
            </CardTitle>
            <CardDescription>
              Performances programadas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingPerformances.length > 0 ? (
                upcomingPerformances.map((performance) => {
                  const dateInfo = formatDateForCard(performance.data);
                  return (
                    <div key={performance.id} className="flex items-center space-x-4">
                      <div className="w-12 text-center">
                        <div className="text-sm font-bold text-blue-600">{dateInfo.day}</div>
                        <div className="text-xs text-gray-500">{dateInfo.month}</div>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{performance.titulo_obra}</p>
                        <p className="text-xs text-gray-500">
                          {performance.local} - {performance.horario}
                        </p>
                      </div>
                      <Badge variant="outline">
                        {getRelativeTime(performance.data)}
                      </Badge>
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-gray-500">Nenhuma performance programada</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
