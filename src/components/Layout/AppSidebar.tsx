
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
} from '@/components/ui/sidebar';
import { useAuth } from '@/hooks/useAuth';

const AppSidebar: React.FC = () => {
  const { profile } = useAuth();

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

  const filteredItems = navigationItems.filter(item => 
    profile?.role && item.roles.includes(profile.role)
  );

  console.log('Profile:', profile);
  console.log('Filtered items:', filteredItems);
  console.log('Navigation items to render:', filteredItems.length);

  return (
    <Sidebar className="border-r border-gray-200">
      <SidebarHeader className="px-4 py-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">
          Sistema Musical
        </h2>
      </SidebarHeader>
      <SidebarContent className="px-2 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="px-2 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
            Navegação
          </SidebarGroupLabel>
          <SidebarGroupContent className="mt-2">
            <SidebarMenu className="space-y-1">
              {filteredItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton asChild className="w-full">
                      <NavLink
                        to={item.href}
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
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
