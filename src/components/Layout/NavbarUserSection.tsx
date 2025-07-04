import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Settings, LogOut, User, Users } from 'lucide-react';

interface NavbarUserSectionProps {
  user: any;
  profile: any;
  onSignOut: () => void;
}

const NavbarUserSection: React.FC<NavbarUserSectionProps> = ({
  user,
  profile,
  onSignOut,
}) => {
  const navigate = useNavigate();
  const [avatarTimestamp, setAvatarTimestamp] = useState(Date.now());

  // Atualizar timestamp quando o avatar mudar
  useEffect(() => {
    if (profile?.avatar_url) {
      setAvatarTimestamp(Date.now());
    }
  }, [profile?.avatar_url]);

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

  // Verificar se o usuário é admin (mesmo sem perfil criado)
  const isAdmin = profile?.role === 'ADMIN' || 
                  user?.email === 'admin@sigmusicorp.com' || 
                  user?.email === 'davidimana123@gmail.com';

  if (user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex items-center space-x-3 hover:bg-blue-50 hover:text-blue-600 h-12 w-12 rounded-full p-0">
            <Avatar className="h-16 w-16 border-2 border-blue-600">
              <AvatarImage 
                src={profile?.avatar_url ? `${profile.avatar_url}?t=${avatarTimestamp}` : undefined} 
                alt={profile?.name || user.email} 
              />
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
              <Avatar className="h-12 w-12 border-2 border-blue-600">
                <AvatarImage 
                  src={profile?.avatar_url ? `${profile.avatar_url}?t=${avatarTimestamp}` : undefined} 
                  alt={profile?.name || user.email} 
                />
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
                      <Badge variant={getRoleBadgeVariant(profile.role_user_role)} className="text-xs">
                        {getRoleLabel(profile.role_user_role)}
                      </Badge>
                      {profile.setor && (
                        <span className="text-xs text-gray-500 truncate">
                          {profile.setor.replace('ACERVO_', '')}
                        </span>
                      )}
                    </>
                  ) : (
                    <span className="text-xs text-gray-500">
                      {isAdmin ? 'Administrador (carregando perfil...)' : 'Perfil não criado'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Meu Perfil - sempre visível para usuários logados */}
          <DropdownMenuItem 
            className="hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 cursor-pointer"
            onClick={() => navigate('/perfil')}
          >
            <User className="mr-2 h-4 w-4 transition-all duration-200 group-hover:scale-110" />
            <span className="transition-all duration-200 group-hover:font-semibold">Meu Perfil</span>
          </DropdownMenuItem>

          {/* Usuários - para ADMINs (mesmo sem perfil criado) */}
          {isAdmin && (
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
