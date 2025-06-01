
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
import { cn } from '@/lib/utils';

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

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="p-4">
          <h2 className="text-lg font-semibold text-sidebar-foreground">
            Sistema Musical
          </h2>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navegação</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredItems.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.href}
                      className={({ isActive }) =>
                        cn(
                          'flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                          isActive
                            ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                            : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                        )
                      }
                    >
                      <item.icon className="h-4 w-4" />
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
