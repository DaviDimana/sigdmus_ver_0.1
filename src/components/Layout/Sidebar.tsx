
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  FileMusic, 
  Calendar, 
  FolderOpen, 
  BarChart3, 
  Users, 
  Settings,
  Home
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  userRole?: 'admin' | 'supervisor' | 'user';
}

const Sidebar: React.FC<SidebarProps> = ({ userRole = 'user' }) => {
  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/',
      icon: Home,
      roles: ['admin', 'supervisor', 'user']
    },
    {
      name: 'Partituras',
      href: '/partituras',
      icon: FileMusic,
      roles: ['admin', 'supervisor', 'user']
    },
    {
      name: 'Performances',
      href: '/performances',
      icon: Calendar,
      roles: ['admin', 'supervisor', 'user']
    },
    {
      name: 'Repositório',
      href: '/repositorio',
      icon: FolderOpen,
      roles: ['admin', 'supervisor', 'user']
    },
    {
      name: 'Relatórios',
      href: '/relatorios',
      icon: BarChart3,
      roles: ['admin', 'supervisor']
    },
    {
      name: 'Usuários',
      href: '/usuarios',
      icon: Users,
      roles: ['admin']
    },
    {
      name: 'Configurações',
      href: '/configuracoes',
      icon: Settings,
      roles: ['admin', 'supervisor']
    }
  ];

  const filteredItems = navigationItems.filter(item => 
    item.roles.includes(userRole)
  );

  return (
    <div className="w-64 bg-gray-50 min-h-screen border-r border-gray-200">
      <div className="p-4">
        <nav className="space-y-2">
          {filteredItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  'flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors',
                  isActive
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                )
              }
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
