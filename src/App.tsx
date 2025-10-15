import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./components/Layout";
import Index from "./pages/Index";
import Home from "./pages/Home";
import Atleti from "./pages/Atleti";
import GestioneSchede from "./pages/GestioneSchede";
import Progressioni from "./pages/Progressioni";
import Esercizi from "./pages/Esercizi";
import Distretti from "./pages/Distretti";
import Dieta from "./pages/Dieta";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route element={<Layout />}>
            <Route path="/home" element={<Home />} />
            <Route path="/atleti" element={<Atleti />} />
            <Route path="/schede" element={<GestioneSchede />} />
            <Route path="/progressioni" element={<Progressioni />} />
            <Route path="/esercizi" element={<Esercizi />} />
            <Route path="/distretti" element={<Distretti />} />
            <Route path="/dieta" element={<Dieta />} />
          </Route>
          <Route path="/split" element={<Index />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
