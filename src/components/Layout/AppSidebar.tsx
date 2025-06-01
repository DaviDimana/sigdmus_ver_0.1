
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

  return (
    <Sidebar>
      <SidebarHeader className="px-4 py-3 border-b">
        <h2 className="text-lg font-semibold text-gray-900">
          Sistema Musical
        </h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
            Navegação
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="px-2">
              {filteredItems.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.href}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                          isActive
                            ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                        }`
                      }
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
