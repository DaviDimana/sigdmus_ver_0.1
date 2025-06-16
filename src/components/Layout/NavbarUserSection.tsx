
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Settings, LogOut, User, Users } from 'lucide-react';

interface NavbarUserSectionProps {
  user: any;
  profile: any;
  onSignOut: () => void;
  onCreateProfile: () => void;
}

const NavbarUserSection: React.FC<NavbarUserSectionProps> = ({
  user,
  profile,
  onSignOut,
  onCreateProfile
}) => {
  const navigate = useNavigate();

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

  if (user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex items-center space-x-3 hover:bg-blue-50 hover:text-blue-600 h-12 w-12 rounded-full p-0">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-blue-100 text-blue-600 text-sm font-semibold">
                {profile?.name ? profile.name.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          {/* Header do usuário */}
          <div className="px-3 py-2 border-b">
            <div className="flex items-center space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-blue-100 text-blue-600">
                  {profile?.name ? profile.name.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 truncate">
                  {profile?.name || user.email || 'Usuário'}
                </div>
                <div className="flex items-center space-x-2 mt-1">
                  {profile?.role ? (
                    <>
                      <Badge variant={getRoleBadgeVariant(profile.role)} className="text-xs">
                        {getRoleLabel(profile.role)}
                      </Badge>
                      {profile.setor && (
                        <span className="text-xs text-gray-500 truncate">
                          {profile.setor.replace('ACERVO_', '')}
                        </span>
                      )}
                    </>
                  ) : (
                    <span className="text-xs text-gray-500">Perfil não criado</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Itens do menu */}
          {profile ? (
            <DropdownMenuItem 
              className="hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 cursor-pointer"
              onClick={() => navigate('/perfil')}
            >
              <User className="mr-2 h-4 w-4 transition-all duration-200 group-hover:scale-110" />
              <span className="transition-all duration-200 group-hover:font-semibold">Meu Perfil</span>
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem 
              className="hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 cursor-pointer"
              onClick={onCreateProfile}
            >
              <User className="mr-2 h-4 w-4 transition-all duration-200 group-hover:scale-110" />
              <span className="transition-all duration-200 group-hover:font-semibold">Criar Perfil</span>
            </DropdownMenuItem>
          )}

          {/* Configurações - sempre visível para usuários logados */}
          <DropdownMenuItem 
            className="hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 cursor-pointer"
            onClick={() => navigate('/configuracoes')}
          >
            <Settings className="mr-2 h-4 w-4 transition-all duration-200 group-hover:scale-110" />
            <span className="transition-all duration-200 group-hover:font-semibold">Configurações</span>
          </DropdownMenuItem>

          {/* Usuários - apenas para ADMIN */}
          {profile?.role === 'ADMIN' && (
            <DropdownMenuItem 
              className="hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 cursor-pointer"
              onClick={() => navigate('/usuarios')}
            >
              <Users className="mr-2 h-4 w-4 transition-all duration-200 group-hover:scale-110" />
              <span className="transition-all duration-200 group-hover:font-semibold">Usuários</span>
            </DropdownMenuItem>
          )}

          <DropdownMenuSeparator />
          
          <DropdownMenuItem 
            className="text-red-600 focus:text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200 cursor-pointer"
            onClick={onSignOut}
          >
            <LogOut className="mr-2 h-4 w-4 transition-all duration-200 group-hover:scale-110" />
            <span className="transition-all duration-200 group-hover:font-semibold">Sair</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return null;
};

export default NavbarUserSection;
