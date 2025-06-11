

import React from 'react';
import { Settings, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { Badge } from '@/components/ui/badge';

interface NavbarProps {
  currentUser?: {
    name: string;
    role: 'admin' | 'supervisor' | 'user';
  } | null;
}

const Navbar: React.FC<NavbarProps> = ({ currentUser }) => {
  const { signOut, profile } = useAuth();

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'Administrador';
      case 'GERENTE': return 'Gerente';
      case 'ARQUIVISTA': return 'Arquivista';
      case 'MUSICO': return 'Músico';
      default: return 'Usuário';
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'destructive';
      case 'GERENTE': return 'default';
      case 'ARQUIVISTA': return 'secondary';
      case 'MUSICO': return 'outline';
      default: return 'outline';
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Título versão desktop */}
          <div className="hidden md:block">
            <span className="text-xs sm:text-sm md:text-base lg:text-lg font-medium text-gray-700">
              Sistema Integrado de Documentação e Consulta de Acervos Musicais
            </span>
          </div>

          {/* Título versão mobile - 3 linhas */}
          <div className="block md:hidden">
            <div className="text-[10px] leading-tight font-medium text-gray-700">
              <div>Sistema Integrado de</div>
              <div>Documentação e Consulta de</div>
              <div>Acervos Musicais</div>
            </div>
          </div>

          <div className="flex items-center space-x-4 flex-shrink-0 ml-auto">
            {profile ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-blue-100 text-blue-600">
                        {profile.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden md:block text-left">
                      <div className="text-sm font-medium text-gray-900">
                        {profile.name}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={getRoleBadgeVariant(profile.role)} className="text-xs">
                          {getRoleLabel(profile.role)}
                        </Badge>
                        {profile.setor && (
                          <span className="text-xs text-gray-500">
                            {profile.setor.replace('ACERVO_', '')}
                          </span>
                        )}
                      </div>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    Perfil
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    Configurações
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="text-red-600 focus:text-red-600"
                    onClick={handleSignOut}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button>
                Entrar
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

