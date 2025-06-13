import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, FileMusic, Calendar, Users } from 'lucide-react';

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Visão geral do sistema de gestão musical
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Partituras</CardTitle>
            <FileMusic className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">
              +5% em relação ao mês anterior
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Performances</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <p className="text-xs text-muted-foreground">
              +12% em relação ao mês anterior
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuários Ativos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-muted-foreground">
              +3 novos usuários
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Relatórios</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">
              Gerados este mês
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle>Atividades Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <FileMusic className="h-4 w-4 text-blue-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Nova partitura adicionada</p>
                  <p className="text-xs text-gray-500">Sinfonia nº 9 - Beethoven</p>
                </div>
                <span className="text-xs text-gray-400">2h atrás</span>
              </div>
              <div className="flex items-center space-x-4">
                <Calendar className="h-4 w-4 text-green-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Performance agendada</p>
                  <p className="text-xs text-gray-500">Concerto de Primavera</p>
                </div>
                <span className="text-xs text-gray-400">5h atrás</span>
              </div>
              <div className="flex items-center space-x-4">
                <Users className="h-4 w-4 text-purple-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Novo usuário registrado</p>
                  <p className="text-xs text-gray-500">João Silva - Violinista</p>
                </div>
                <span className="text-xs text-gray-400">1d atrás</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle>Próximos Eventos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="text-sm font-medium">Ensaio Geral</h4>
                <p className="text-xs text-gray-500">Amanhã, 14:00</p>
                <p className="text-xs text-gray-400">Sala Principal</p>
              </div>
              <div className="border-l-4 border-green-500 pl-4">
                <h4 className="text-sm font-medium">Concerto de Câmara</h4>
                <p className="text-xs text-gray-500">15/06, 19:30</p>
                <p className="text-xs text-gray-400">Teatro Municipal</p>
              </div>
              <div className="border-l-4 border-purple-500 pl-4">
                <h4 className="text-sm font-medium">Workshop de Regência</h4>
                <p className="text-xs text-gray-500">20/06, 10:00</p>
                <p className="text-xs text-gray-400">Conservatório</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
