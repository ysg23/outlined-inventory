import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import InventoryLanding from "./pages/InventoryLanding";
import { SimpleLogin } from "./components/auth/simple-login";
import { OAuthCallback } from "./components/auth/oauth-callback";
import { ProtectedRoute } from "./components/auth/protected-route";

const queryClient = new QueryClient();

// Simple 404 component
const NotFound = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-4 text-foreground">404 - Page Not Found</h1>
      <p className="text-xl text-muted-foreground mb-6">The page you're looking for doesn't exist.</p>
      <a href="/" className="text-primary hover:underline">Go back to dashboard</a>
    </div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<SimpleLogin />} />
          <Route path="/oauth/callback" element={<OAuthCallback />} />
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Index />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/inventory" 
            element={
              <ProtectedRoute>
                <InventoryLanding />
              </ProtectedRoute>
            } 
          />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
