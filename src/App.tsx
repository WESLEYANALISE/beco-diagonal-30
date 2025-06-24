
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { BottomNavigation } from "@/components/BottomNavigation";
import Index from "./pages/Index";
import Categorias from "./pages/Categorias";
import Favoritos from "./pages/Favoritos";
import Novos from "./pages/Novos";
import CategoriaLista from "./pages/CategoriaLista";
import SubcategoriaLista from "./pages/SubcategoriaLista";
import Explorar from "./pages/Explorar";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen bg-gradient-to-br from-magical-midnight via-magical-deepPurple to-magical-mysticalPurple">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/categorias" element={<Categorias />} />
            <Route path="/favoritos" element={<Favoritos />} />
            <Route path="/novos" element={<Novos />} />
            <Route path="/categoria-lista" element={<CategoriaLista />} />
            <Route path="/subcategoria-lista" element={<SubcategoriaLista />} />
            <Route path="/explorar" element={<Explorar />} />
          </Routes>
          <BottomNavigation />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
