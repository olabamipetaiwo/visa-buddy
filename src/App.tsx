import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { Analytics } from "@vercel/analytics/react";
import { trackAnalytics } from "./lib/analytics";
import { useEffect } from "react";
const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    const setupAnalytics = async () => {
      const analytics = await trackAnalytics();
      // if(window) {
      // declare global {
      //   interface Window {
      //     analytics: any;
      //   }
      // }
      // export {};
      //   window.analytics = analytics;
      // }
    };

    setupAnalytics();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Analytics />
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
