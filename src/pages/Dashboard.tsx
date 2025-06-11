
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, FileText, Music, Users, Clock, Download } from 'lucide-react';
import { useAuthState } from '@/hooks/useAuthState';

const Dashboard = () => {
  const { profile } = useAuthState();

  const stats = [
    {
      title: "Total de Partituras",
      value: "248",
      description: "Partituras catalogadas",
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      title: "Performances",
      value: "156",
      description: "Performances registradas",
      icon: Music,
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      title: "Usuários Ativos",
      value: "42",
      description: "Usuários cadastrados",
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    },
    {
      title: "Downloads",
      value: "1,234",
      description: "Downloads realizados",
      icon: Download,
      color: "text-orange-600",
      bgColor: "bg-orange-100"
    }
  ];

  const recentActivities = [
    {
      id: 1,
      action: "Nova partitura adicionada",
      item: "Sonata em Dó Maior - Mozart",
      user: "Ana Silva",
      time: "2 horas atrás",
      type: "upload"
    },
    {
      id: 2,
      action: "Performance registrada",
      item: "Concerto de Primavera - Vivaldi",
      user: "Carlos Santos",
      time: "4 horas atrás",
      type: "performance"
    },
    {
      id: 3,
      action: "Download realizado",
      item: "Sinfonia No. 40 - Mozart",
      user: "Maria Oliveira",
      time: "6 horas atrás",
      type: "download"
    }
  ];

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
              {recentActivities.map((activity) => (
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
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Próximos Eventos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              Próximos Eventos
            </CardTitle>
            <CardDescription>
              Performances e eventos programados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 text-center">
                  <div className="text-sm font-bold text-blue-600">15</div>
                  <div className="text-xs text-gray-500">JUN</div>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Concerto de Câmara</p>
                  <p className="text-xs text-gray-500">Auditório Principal - 19h30</p>
                </div>
                <Badge variant="outline">Hoje</Badge>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-12 text-center">
                  <div className="text-sm font-bold text-green-600">18</div>
                  <div className="text-xs text-gray-500">JUN</div>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Recital de Piano</p>
                  <p className="text-xs text-gray-500">Sala de Música - 20h00</p>
                </div>
                <Badge variant="secondary">Em 3 dias</Badge>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-12 text-center">
                  <div className="text-sm font-bold text-orange-600">22</div>
                  <div className="text-xs text-gray-500">JUN</div>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Ensaio Geral</p>
                  <p className="text-xs text-gray-500">Teatro Municipal - 14h00</p>
                </div>
                <Badge variant="outline">Em 1 semana</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
