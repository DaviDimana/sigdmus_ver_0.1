import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import NavbarUserSection from './NavbarUserSection';

interface NavbarProps {
  currentUser?: {
    name: string;
    role: 'admin' | 'supervisor' | 'user';
  } | null;
}

const Navbar: React.FC<NavbarProps> = ({ currentUser }) => {
  const { user, profile, signOut, updateProfile } = useAuth();
  const { state, isMobile } = useSidebar();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/auth', { replace: true });
      // Se necessário, descomente para forçar reload total:
      // window.location.reload();
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

  // Determinar se o card deve ser visível
  // Visível quando: sidebar está colapsada (não expandida) ou em mobile
  const shouldShowCard = state === 'collapsed' || isMobile;

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          {/* Ícone de collapse e estrutura condicional */}
          <div className="flex items-center space-x-4">
            <SidebarTrigger className="h-14 w-14 min-h-[56px] min-w-[56px] flex items-center justify-center ml-0" />
            {/* Logo e nome do sistema só aparecem quando sidebar está colapsada ou em mobile */}
            {(state === 'collapsed' || isMobile) && (
              <div>
                {/* Versão desktop */}
                <div className="hidden md:flex items-center space-x-4">
                  <img 
                    src="/lovable-uploads/81009293-f25e-4f72-a80a-e150f7665dc2.png" 
                    alt="SIGMus Logo" 
                    className="h-12 w-auto"
                  />
                  <div className="flex flex-col">
                    <div className="text-2xl font-bold text-blue-700 tracking-wide">
                      SiGDMus
                    </div>
                    <div className="text-sm text-gray-600 leading-tight max-w-[200px] font-sans font-semibold">
                      Sistema Integrado de Gestão e
                      <br />
                      Documentação Musical
                    </div>
                  </div>
                </div>
                {/* Versão mobile */}
                <div className="flex md:hidden items-center space-x-2">
                  <img 
                    src="/lovable-uploads/81009293-f25e-4f72-a80a-e150f7665dc2.png" 
                    alt="SIGMus Logo" 
                    className="h-8 w-auto"
                  />
                  <div className="flex flex-col">
                    <div className="text-base font-bold text-blue-700 tracking-wide">
                      SiGDMus
                    </div>
                    <div className="text-[10px] text-gray-600 leading-tight max-w-[140px] font-sans font-medium">
                      Sistema Integrado de Gestão e
                      <br />
                      Documentação Musical
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4 flex-shrink-0 ml-auto">
            {user ? (
              <NavbarUserSection
                user={user}
                profile={profile}
                onSignOut={handleSignOut}
              />
            ) : (
              <Button 
                onClick={() => navigate('/auth')}
                className="h-9 px-4 text-sm bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200/50"
              >
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
