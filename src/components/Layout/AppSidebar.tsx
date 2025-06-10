import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  FileMusic, 
  Calendar, 
  FolderOpen, 
  BarChart3, 
  Users, 
  Settings,
  Home,
  Plus
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from '@/components/ui/sidebar';
import { useAuth } from '@/hooks/useAuth';

const AppSidebar: React.FC = () => {
  const { profile, user } = useAuth();
  const { setOpenMobile, isMobile } = useSidebar();

  const handleItemClick = () => {
    // Fechar o menu mobile quando um item for clicado
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/',
      icon: Home,
      roles: ['ADMIN', 'GERENTE', 'ARQUIVISTA', 'MUSICO']
    },
    {
      name: 'Partituras',
      href: '/partituras',
      icon: FileMusic,
      roles: ['ADMIN', 'GERENTE', 'ARQUIVISTA', 'MUSICO']
    },
    {
      name: 'Nova Partitura',
      href: '/partituras/nova',
      icon: Plus,
      roles: ['ADMIN', 'GERENTE']
    },
    {
      name: 'Performances',
      href: '/performances',
      icon: Calendar,
      roles: ['ADMIN', 'GERENTE', 'ARQUIVISTA', 'MUSICO']
    },
    {
      name: 'Nova Performance',
      href: '/performances/nova',
      icon: Plus,
      roles: ['ADMIN', 'GERENTE']
    },
    {
      name: 'Repositório',
      href: '/repositorio',
      icon: FolderOpen,
      roles: ['ADMIN', 'GERENTE', 'ARQUIVISTA', 'MUSICO']
    },
    {
      name: 'Relatórios',
      href: '/relatorios',
      icon: BarChart3,
      roles: ['ADMIN', 'GERENTE', 'ARQUIVISTA', 'MUSICO']
    },
    {
      name: 'Usuários',
      href: '/usuarios',
      icon: Users,
      roles: ['ADMIN']
    },
    {
      name: 'Configurações',
      href: '/configuracoes',
      icon: Settings,
      roles: ['ADMIN', 'GERENTE']
    }
  ];

  // Log mais detalhado para debug
  console.log('=== SIDEBAR DEBUG ===');
  console.log('User:', user);
  console.log('Profile:', profile);
  console.log('Profile role:', profile?.role);
  console.log('Total navigation items:', navigationItems.length);

  // Filtrar itens sem depender do role do profile se não existir
  const filteredItems = profile?.role 
    ? navigationItems.filter(item => item.roles.includes(profile.role))
    : navigationItems; // Mostrar todos se não tiver role (para debug)

  console.log('Filtered items:', filteredItems);
  console.log('Items to render:', filteredItems.length);
  console.log('=== END SIDEBAR DEBUG ===');

  return (
    <Sidebar className="border-r border-gray-200">
      <SidebarHeader className="px-4 py-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">
          ACO<em>R</em>DES
        </h2>
        {/* Debug info no header */}
        <div className="text-xs text-gray-500 mt-1">
          Role: {profile?.role || 'Carregando...'}
        </div>
      </SidebarHeader>
      <SidebarContent className="px-2 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="px-2 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
            Navegação ({filteredItems.length} itens)
          </SidebarGroupLabel>
          <SidebarGroupContent className="mt-2">
            <SidebarMenu className="space-y-1">
              {filteredItems.length === 0 ? (
                <div className="px-3 py-2 text-sm text-gray-500">
                  Nenhum item de navegação disponível
                </div>
              ) : (
                filteredItems.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <SidebarMenuItem key={item.name}>
                      <SidebarMenuButton asChild className="w-full">
                        <NavLink
                          to={item.href}
                          onClick={handleItemClick}
                          className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors w-full ${
                              isActive
                                ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                            }`
                          }
                        >
                          <IconComponent className="h-5 w-5 flex-shrink-0" />
                          <span className="truncate">{item.name}</span>
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
