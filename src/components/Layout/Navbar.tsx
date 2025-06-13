
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { SidebarTrigger } from '@/components/ui/sidebar';
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

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          {/* Ícone de collapse e título */}
          <div className="flex items-center space-x-4">
            <SidebarTrigger className="h-8 w-8" />
            <NavbarTitle />
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
