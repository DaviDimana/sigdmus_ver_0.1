
import React from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import AppSidebar from './AppSidebar';
import Navbar from './Navbar';

interface User {
  name: string;
  role: 'admin' | 'supervisor' | 'user';
}

interface MainLayoutProps {
  children: React.ReactNode;
  currentUser: User | null;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, currentUser }) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <Navbar currentUser={currentUser} />
          <main className="flex-1 p-6 overflow-auto bg-gray-50">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;
