
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
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
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  console.log('ProtectedRoute: Check auth state', { 
    hasUser: !!user, 
    loading, 
    currentPath: location.pathname 
  });

  if (loading) {
    console.log('ProtectedRoute: Still loading auth state...');
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    console.log('ProtectedRoute: No user, redirecting to auth');
    return <Navigate to="/auth" replace />;
  }

  console.log('ProtectedRoute: User authenticated, showing content');
  return <>{children}</>;
};

const AppContent = () => {
  const { user, profile, loading } = useAuth();

  console.log('App: Current state:', { 
    hasUser: !!user, 
    hasProfile: !!profile, 
    loading,
    userEmail: user?.email 
  });

  // Show loading while checking auth state
  if (loading) {
    console.log('App: Loading auth state...');
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  // Create user object for MainLayout
  const currentUser = user && profile ? {
    name: profile.name,
    role: profile.role.toLowerCase() as 'admin' | 'supervisor' | 'user'
  } : user ? {
    name: user.user_metadata?.name || user.email || 'Usuário',
    role: 'user' as const
  } : null;

  return (
    <BrowserRouter>
      <Routes>
        {/* Auth route - always accessible */}
        <Route path="/auth" element={user ? <Navigate to="/" replace /> : <Auth />} />
        
        {/* Protected routes */}
        <Route path="/*" element={
          <ProtectedRoute>
            <MainLayout currentUser={currentUser!}>
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
                <Route path="*" element={<NotFound />} />
              </Routes>
            </MainLayout>
          </ProtectedRoute>
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
