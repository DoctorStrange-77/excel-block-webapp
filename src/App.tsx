import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import Home from "./pages/Home";
import Split from "./pages/Split";
import Atleti from "./pages/Atleti";
import Schede from "./pages/Schede";
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
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/split" element={<Split />} />
            <Route path="/atleti" element={<Atleti />} />
            <Route path="/schede" element={<Schede />} />
            <Route path="/progressioni" element={<Progressioni />} />
            <Route path="/esercizi" element={<Esercizi />} />
            <Route path="/distretti" element={<Distretti />} />
            <Route path="/dieta" element={<Dieta />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
