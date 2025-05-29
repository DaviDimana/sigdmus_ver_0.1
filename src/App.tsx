
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./components/Layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import Partituras from "./pages/Partituras";
import NovaPartitura from "./pages/NovaPartitura";
import Performances from "./pages/Performances";
import NovaPerformance from "./pages/NovaPerformance";
import Repositorio from "./pages/Repositorio";
import Relatorios from "./pages/Relatorios";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  // Simulando usuário logado (será substituído pela autenticação real)
  const currentUser = {
    name: "João Silva",
    role: "admin" as const
  };

  // Para demo, vamos mostrar o layout principal. Na implementação real,
  // verificaremos se o usuário está autenticado
  const isAuthenticated = true;

  if (!isAuthenticated) {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="*" element={<Login />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <MainLayout currentUser={currentUser}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/partituras" element={<Partituras />} />
              <Route path="/partituras/nova" element={<NovaPartitura />} />
              <Route path="/performances" element={<Performances />} />
              <Route path="/performances/nova" element={<NovaPerformance />} />
              <Route path="/repositorio" element={<Repositorio />} />
              <Route path="/relatorios" element={<Relatorios />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </MainLayout>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
