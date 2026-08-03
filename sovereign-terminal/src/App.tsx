import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import SovereignTerminal from "./pages/SovereignTerminal";
import Auth from "./pages/Auth";
import CreateAgent from "./pages/CreateAgent";
import Chat from "./pages/Chat";
import Dashboard from "./pages/Dashboard";
import FleetCommand from "./pages/FleetCommand";
import NeuroLabs from "./pages/NeuroLabs";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex min-h-screen items-center justify-center text-muted-foreground" style={{ fontFamily: "'JetBrains Mono', monospace" }}>INITIALIZING...</div>;
  if (!user) return <Navigate to="/auth" replace />;
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Navbar />
          <Routes>
            <Route path="/" element={<ProtectedRoute><SovereignTerminal /></ProtectedRoute>} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/create" element={<ProtectedRoute><CreateAgent /></ProtectedRoute>} />
            <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
            <Route path="/chat/:agentId" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/fleet" element={<ProtectedRoute><FleetCommand /></ProtectedRoute>} />
            <Route path="/neuro" element={<ProtectedRoute><NeuroLabs /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
