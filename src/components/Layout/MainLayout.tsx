
import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

interface MainLayoutProps {
  children: React.ReactNode;
  currentUser?: {
    name: string;
    role: 'admin' | 'supervisor' | 'user';
  } | null;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, currentUser }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar currentUser={currentUser} />
      <div className="flex">
        <Sidebar userRole={currentUser?.role} />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
