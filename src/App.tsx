
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

const AppContent = () => {
  const { user, profile, loading } = useAuth();

  // Show loading while checking auth state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  // Show auth page if not authenticated
  if (!user) {
    return (
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="*" element={<Auth />} />
      </Routes>
    );
  }

  // Convert profile to format expected by MainLayout
  const currentUser = profile ? {
    name: profile.name,
    role: profile.role.toLowerCase() as 'admin' | 'supervisor' | 'user'
  } : {
    name: user.user_metadata?.name || user.email || 'Usuário',
    role: 'user' as const
  };

  return (
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
        <Route path="/auth" element={<Auth />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </MainLayout>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
