import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Users, UserPlus, Search, Mail, Phone } from 'lucide-react';

const Usuarios = () => {
  const usuarios = [
    {
      id: 1,
      nome: 'João Silva',
      email: 'joao.silva@email.com',
      role: 'ADMIN',
      status: 'Ativo',
      telefone: '(11) 99999-9999'
    },
    {
      id: 2,
      nome: 'Maria Santos',
      email: 'maria.santos@email.com',
      role: 'GERENTE',
      status: 'Ativo',
      telefone: '(11) 88888-8888'
    },
    {
      id: 3,
      nome: 'Pedro Costa',
      email: 'pedro.costa@email.com',
      role: 'MUSICO',
      status: 'Ativo',
      telefone: '(11) 77777-7777'
    }
  ];

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-red-100 text-red-800';
      case 'GERENTE':
        return 'bg-blue-100 text-blue-800';
      case 'MUSICO':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Usuários</h1>
          <p className="text-gray-600 mt-2">
            Gerencie usuários e permissões do sistema
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <UserPlus className="h-4 w-4 mr-2" />
          Novo Usuário
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar usuários..."
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {usuarios.map((usuario) => (
          <Card key={usuario.id} className="shadow-xl hover:shadow-2xl transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-blue-100 text-blue-700 font-medium">
                    {usuario.nome.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <CardTitle className="text-lg">{usuario.nome}</CardTitle>
                  <Badge className={`text-xs ${getRoleColor(usuario.role)}`}>
                    {usuario.role}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Mail className="h-4 w-4" />
                  <span>{usuario.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Phone className="h-4 w-4" />
                  <span>{usuario.telefone}</span>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <Badge variant="outline" className="text-green-600 border-green-200">
                    {usuario.status}
                  </Badge>
                  <Button size="sm" variant="outline">
                    Editar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Estatísticas de Usuários</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">3</div>
              <div className="text-sm text-gray-600">Total de Usuários</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">3</div>
              <div className="text-sm text-gray-600">Usuários Ativos</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">0</div>
              <div className="text-sm text-gray-600">Pendentes</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">0</div>
              <div className="text-sm text-gray-600">Bloqueados</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Usuarios;
