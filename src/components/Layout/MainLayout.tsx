
import React from 'react';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
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
          <header className="flex h-20 shrink-0 items-center gap-2 border-b px-4 bg-white">
            <SidebarTrigger className="h-6 w-6 text-gray-600 hover:text-gray-900" />
            <div className="flex-1 ml-2">
              <Navbar currentUser={currentUser} />
            </div>
          </header>
          <main className="flex-1 p-6 overflow-auto bg-gray-50">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;
