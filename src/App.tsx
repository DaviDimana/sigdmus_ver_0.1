
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import MainLayout from "./components/Layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import Partituras from "./pages/Partituras";
import NovaPartitura from "./pages/NovaPartitura";
import Performances from "./pages/Performances";
import NovaPerformance from "./pages/NovaPerformance";
import Repositorio from "./pages/Repositorio";
import Relatorios from "./pages/Relatorios";
import Configuracoes from "./pages/Configuracoes";
import Usuarios from "./pages/Usuarios";
import Perfil from "./pages/Perfil";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  const { user, profile, loading } = useAuth();

  console.log('App: Current auth state:', { 
    hasUser: !!user, 
    hasProfile: !!profile, 
    loading,
    userEmail: user?.email 
  });

  // Show loading while checking auth state
  if (loading) {
    console.log('App: Still loading auth state...');
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  // If no user, show auth page and redirect any other route to /auth
  if (!user) {
    console.log('App: No user found, showing auth page');
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="*" element={<Navigate to="/auth" replace />} />
        </Routes>
      </BrowserRouter>
    );
  }

  // User is authenticated, show main app
  console.log('App: User authenticated, showing main app');
  
  // Create user object for MainLayout - even without profile
  const currentUser = profile ? {
    name: profile.name,
    role: profile.role.toLowerCase() as 'admin' | 'supervisor' | 'user'
  } : {
    name: user.user_metadata?.name || user.email || 'Usuário',
    role: 'user' as const
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect /auth to dashboard if user is authenticated */}
        <Route path="/auth" element={<Navigate to="/" replace />} />
        
        {/* Main app routes - all redirect to Dashboard (/) */}
        <Route path="/*" element={
          <MainLayout currentUser={currentUser}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/partituras" element={<Partituras />} />
              <Route path="/partituras/nova" element={<NovaPartitura />} />
              <Route path="/performances" element={<Performances />} />
              <Route path="/performances/nova" element={<NovaPerformance />} />
              <Route path="/repositorio" element={<Repositorio />} />
              <Route path="/relatorios" element={<Relatorios />} />
              <Route path="/configuracoes" element={<Configuracoes />} />
              <Route path="/usuarios" element={<Usuarios />} />
              <Route path="/perfil" element={<Perfil />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </MainLayout>
        } />
      </Routes>
    </BrowserRouter>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AppContent />
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
