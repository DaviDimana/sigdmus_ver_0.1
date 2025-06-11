
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
import { useNavigate } from 'react-router-dom';

interface NavbarProps {
  currentUser?: {
    name: string;
    role: 'admin' | 'supervisor' | 'user';
  } | null;
}

const Navbar: React.FC<NavbarProps> = ({ currentUser }) => {
  const { user, profile, signOut, updateProfile } = useAuth();
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

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/auth');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleCreateProfile = async () => {
    if (!user) return;
    
    try {
      await updateProfile({
        name: user.user_metadata?.name || user.email || 'Usuário',
        email: user.email || '',
        role: 'MUSICO' as const
      });
    } catch (error) {
      console.error('Error creating profile:', error);
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Título versão desktop */}
          <div className="hidden md:block">
            <span className="text-xs sm:text-sm md:text-base lg:text-lg font-bold text-blue-600 uppercase tracking-wide">
              Sistema Integrado de Documentação e Consulta de Acervos Musicais
            </span>
          </div>

          {/* Título versão mobile - 3 linhas */}
          <div className="block md:hidden">
            <div className="text-[11px] leading-tight font-bold text-blue-600 uppercase tracking-wide">
              <div>Sistema Integrado de</div>
              <div>Documentação e Consulta de</div>
              <div>Acervos Musicais</div>
            </div>
          </div>

          <div className="flex items-center space-x-4 flex-shrink-0 ml-auto">
            {user && profile ? (
              <>
                {/* Botão de Logout visível */}
                <Button 
                  variant="outline" 
                  onClick={handleSignOut}
                  className="h-7 px-2 text-xs text-red-600 border-red-300 hover:bg-red-50 hover:text-red-700 hover:border-red-400 shadow-lg shadow-blue-200/50"
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
                      onClick={handleSignOut}
                    >
                      <LogOut className="mr-2 h-4 w-4 transition-all duration-200 group-hover:scale-110" />
                      <span className="transition-all duration-200 group-hover:font-semibold">Sair</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : user && !profile ? (
              <>
                <Button 
                  variant="outline" 
                  onClick={handleSignOut}
                  className="h-7 px-2 text-xs text-red-600 border-red-300 hover:bg-red-50 hover:text-red-700 hover:border-red-400 shadow-lg shadow-blue-200/50"
                >
                  <LogOut className="mr-1 h-3 w-3" />
                  <span className="hidden sm:inline">Sair</span>
                </Button>
                <Button 
                  onClick={handleCreateProfile} 
                  className="h-7 px-2 text-xs bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200/50"
                >
                  <span>Criar Perfil</span>
                </Button>
              </>
            ) : (
              <Button onClick={() => navigate('/auth')}>
                <span>Entrar</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
