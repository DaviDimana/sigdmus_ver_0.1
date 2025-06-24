import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UserManagement from '@/components/Settings/UserManagement';
import ProfileSettings from '@/components/Settings/ProfileSettings';
import PasswordSettings from '@/components/Settings/PasswordSettings';
import { Users, User, Lock } from 'lucide-react';

const Configuracoes: React.FC = () => {
  console.log('=== CONFIGURAÇÕES PAGE LOADING ===');
  
  const { profile, user, loading } = useAuth();
  
  console.log('Auth state in Configurações:', { profile, user, loading });

  if (loading) {
    console.log('Configurações: Still loading auth...');
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Carregando configurações...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    console.log('Configurações: No user found');
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Usuário não encontrado</p>
      </div>
    );
  }

  console.log('Configurações: Rendering page for user:', user.email);
  console.log('Configurações: Profile role:', profile?.role_user_role);

  // Sempre mostrar as configurações básicas, independente do profile
  const showUserManagement = profile?.role === 'ADMIN';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Configurações</h1>
        <p className="text-gray-600 mt-2">
          Gerencie suas configurações e preferências
        </p>
        {/* Debug info */}
        <div className="text-xs text-gray-400 mt-1">
          Debug: User: {user?.email}, Role: {profile?.role || 'N/A'}, Loading: {loading.toString()}
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="profile" className="flex items-center gap-2 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700">
            <User className="h-4 w-4 transition-all duration-200 group-hover:scale-110" />
            <span className="transition-all duration-200 group-hover:font-semibold">Perfil</span>
          </TabsTrigger>
          <TabsTrigger value="password" className="flex items-center gap-2 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700">
            <Lock className="h-4 w-4 transition-all duration-200 group-hover:scale-110" />
            <span className="transition-all duration-200 group-hover:font-semibold">Senha</span>
          </TabsTrigger>
          {showUserManagement && (
            <TabsTrigger value="users" className="flex items-center gap-2 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700">
              <Users className="h-4 w-4 transition-all duration-200 group-hover:scale-110" />
              <span className="transition-all duration-200 group-hover:font-semibold">Usuários</span>
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Informações do Perfil</CardTitle>
            </CardHeader>
            <CardContent>
              <ProfileSettings />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="password">
          <Card>
            <CardHeader>
              <CardTitle>Alterar Senha</CardTitle>
            </CardHeader>
            <CardContent>
              <PasswordSettings />
            </CardContent>
          </Card>
        </TabsContent>

        {showUserManagement && (
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>Gerenciamento de Usuários</CardTitle>
              </CardHeader>
              <CardContent>
                <UserManagement />
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default Configuracoes;
