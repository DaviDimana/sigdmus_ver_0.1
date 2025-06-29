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
import Relatorios from "./pages/Relatorios";
import Configuracoes from "./pages/Configuracoes";
import Perfil from "./pages/Perfil";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import Usuarios from "./pages/Usuarios";

const queryClient = new QueryClient();

const ProtectedRoutes = () => {
  const { user, profile, loading } = useAuth();
  const location = useLocation();

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

  // Redirecionar para /auth se não autenticado e tentar acessar /
  if (!user && location.pathname === "/") {
    return <Navigate to="/auth" replace />;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const currentUser = profile ? {
    name: profile.full_name || user.email,
    role: profile.role_user_role?.toLowerCase() as 'admin' | 'supervisor' | 'user' || 'user'
  } : {
    name: user.user_metadata?.full_name || user.email || 'Usuário',
    role: 'user' as const
  };

  return (
          <MainLayout currentUser={currentUser}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/partituras" element={<Partituras />} />
              <Route path="/partituras/nova" element={<NovaPartitura />} />
        <Route path="/partituras/:id/editar" element={<NovaPartitura />} />
              <Route path="/performances" element={<Performances />} />
              <Route path="/performances/nova" element={<NovaPerformance />} />
              <Route path="/relatorios" element={<Relatorios />} />
              <Route path="/configuracoes" element={<Configuracoes />} />
              <Route path="/perfil" element={<Perfil />} />
              <Route path="/usuarios" element={<Usuarios />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </MainLayout>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
        <Toaster />
        <Sonner />
          <Routes>
            <Route path="/auth" element={<Auth />} />
            {/* Redirecionar tudo que não for /auth para ProtectedRoutes */}
            <Route path="*" element={<ProtectedRoutes />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
