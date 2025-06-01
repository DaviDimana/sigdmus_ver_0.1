
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
    <Sidebar variant="sidebar" className="w-64 border-r bg-background">
      <SidebarHeader className="border-b px-6 py-4 bg-background">
        <h2 className="text-lg font-semibold text-foreground">
          Sistema Musical
        </h2>
      </SidebarHeader>
      <SidebarContent className="bg-background">
        <SidebarGroup>
          <SidebarGroupLabel className="px-6 py-2 text-sm font-medium text-muted-foreground">
            Navegação
          </SidebarGroupLabel>
          <SidebarGroupContent className="px-3">
            <SidebarMenu>
              {filteredItems.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton asChild className="w-full">
                    <NavLink
                      to={item.href}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors w-full ${
                          isActive
                            ? 'bg-primary text-primary-foreground'
                            : 'text-foreground hover:bg-accent hover:text-accent-foreground'
                        }`
                      }
                    >
                      <item.icon className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate">{item.name}</span>
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
