
import React from 'react';
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
import { Settings, LogOut, User } from 'lucide-react';

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

  if (user && profile) {
    return (
      <>
        {/* Botão de Logout visível apenas no desktop */}
        <Button 
          variant="outline" 
          onClick={onSignOut}
          className="hidden md:flex h-7 px-2 text-xs text-red-600 border-red-300 hover:bg-red-50 hover:text-red-700 hover:border-red-400 shadow-lg shadow-blue-200/50"
        >
          <LogOut className="mr-1 h-3 w-3" />
          <span className="hidden sm:inline">Sair</span>
        </Button>

        {/* Dropdown do usuário */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center space-x-3 hover:bg-blue-50 hover:text-blue-600">
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
            <DropdownMenuItem className="hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 cursor-pointer">
              <User className="mr-2 h-4 w-4 transition-all duration-200 group-hover:scale-110" />
              <span className="transition-all duration-200 group-hover:font-semibold">Perfil</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 cursor-pointer">
              <Settings className="mr-2 h-4 w-4 transition-all duration-200 group-hover:scale-110" />
              <span className="transition-all duration-200 group-hover:font-semibold">Configurações</span>
            </DropdownMenuItem>
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
      </>
    );
  }

  if (user && !profile) {
    return (
      <>
        {/* Layout desktop - botões lado a lado */}
        <div className="hidden md:flex items-center space-x-2">
          <Button 
            variant="outline" 
            onClick={onSignOut}
            className="h-7 px-2 text-xs text-red-600 border-red-300 hover:bg-red-50 hover:text-red-700 hover:border-red-400 shadow-lg shadow-blue-200/50"
          >
            <LogOut className="mr-1 h-3 w-3" />
            <span className="hidden sm:inline">Sair</span>
          </Button>
          <Button 
            onClick={onCreateProfile} 
            className="h-7 px-2 text-xs bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200/50"
          >
            <span>Criar Perfil</span>
          </Button>
        </div>

        {/* Layout mobile - botões empilhados */}
        <div className="flex md:hidden flex-col space-y-1">
          <Button 
            onClick={onCreateProfile} 
            className="h-6 px-2 text-xs bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200/50 min-w-[60px]"
          >
            <span>Novo</span>
          </Button>
          <Button 
            variant="outline" 
            onClick={onSignOut}
            className="h-6 px-2 text-xs text-red-600 border-red-300 hover:bg-red-50 hover:text-red-700 hover:border-red-400 shadow-lg shadow-blue-200/50 min-w-[60px]"
          >
            <LogOut className="h-3 w-3" />
          </Button>
        </div>
      </>
    );
  }

  return null;
};

export default NavbarUserSection;
