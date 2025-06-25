
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { BottomNavigation } from "@/components/BottomNavigation";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { useBackgroundMusic } from "@/hooks/useBackgroundMusic";
import { usePerformanceMonitor } from "@/hooks/usePerformanceMonitor";
import Index from "./pages/Index";
import Categorias from "./pages/Categorias";
import Favoritos from "./pages/Favoritos";
import Novos from "./pages/Novos";
import CategoriaLista from "./pages/CategoriaLista";
import SubcategoriaLista from "./pages/SubcategoriaLista";
import SubcategoriaDetalhes from "./pages/SubcategoriaDetalhes";
import Explorar from "./pages/Explorar";

// Optimized QueryClient configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (was cacheTime)
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

const AppContent = () => {
  // Initialize background music and performance monitoring
  useBackgroundMusic();
  usePerformanceMonitor();

  return (
    <div className="min-h-screen bg-gradient-to-br from-magical-midnight via-magical-deepPurple to-magical-mysticalPurple relative">
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/categorias" element={<Categorias />} />
        <Route path="/favoritos" element={<Favoritos />} />
        <Route path="/novos" element={<Novos />} />
        <Route path="/categoria-lista" element={<CategoriaLista />} />
        <Route path="/subcategoria-lista" element={<SubcategoriaLista />} />
        <Route path="/subcategoria-detalhes" element={<SubcategoriaDetalhes />} />
        <Route path="/explorar" element={<Explorar />} />
      </Routes>
      <BottomNavigation />
    </div>
  );
};

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
