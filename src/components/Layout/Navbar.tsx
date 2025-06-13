
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar';
import NavbarTitle from './NavbarTitle';
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

  // Determinar se o card deve ser visível
  // Visível quando: sidebar está colapsada (não expandida) ou em mobile
  const shouldShowCard = state === 'collapsed' || isMobile;

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          {/* Ícone de collapse e estrutura condicional */}
          <div className="flex items-center space-x-4">
            <SidebarTrigger className="h-8 w-8" />
            
            {/* Card com logo, sigla e subtítulo - com animação */}
            <div className={`transition-all duration-300 ease-in-out ${
              shouldShowCard 
                ? 'opacity-100 translate-x-0 scale-100' 
                : 'opacity-0 -translate-x-4 scale-95 pointer-events-none'
            }`}>
              <div className="flex items-center space-x-4">
                <img 
                  src="/lovable-uploads/81009293-f25e-4f72-a80a-e150f7665dc2.png" 
                  alt="SIGMus Logo" 
                  className="h-16 w-auto"
                />
                <div className="flex flex-col text-left">
                  <div className="text-3xl font-bold text-blue-700 tracking-wide">
                    SiGMus
                  </div>
                  <div className="text-base text-gray-600 leading-tight max-w-[250px] font-bold">
                    Sistema Integrado de Gestão e
                    <br />
                    Documentação Musical
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4 flex-shrink-0 ml-auto">
            <NavbarUserSection
              user={user}
              profile={profile}
              onSignOut={handleSignOut}
              onCreateProfile={handleCreateProfile}
            />
            
            {!user && (
              <button onClick={() => navigate('/auth')}>
                <span>Entrar</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
