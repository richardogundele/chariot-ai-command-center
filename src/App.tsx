
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import Index from "./pages/Index";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import Campaign from "./pages/Campaign";
import Reports from "./pages/Reports";
import Alerts from "./pages/Alerts";
import AddProduct from "./pages/AddProduct";
import NotFound from "./pages/NotFound";
import Products from "./pages/Products";
import CampaignCreation from "./pages/CampaignCreation";
import SavedProducts from "./pages/SavedProducts";
import PlatformConnections from "./pages/PlatformConnections";
import Settings from "./pages/Settings";
import { getCurrentUser } from "./services/auth/authService";
import { SetupNotification } from "./components/notifications/SetupNotification";

const queryClient = new QueryClient();

// ProtectedRoute component that checks Supabase authentication
const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        const { user } = await getCurrentUser();
        setIsAuthenticated(!!user);
      } catch (error) {
        console.error("Auth check error:", error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    }

    checkAuth();
  }, []);

  if (isLoading) {
    // Consider adding a loading spinner or component here
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return isAuthenticated ? (
    <>
      {children}
      <SetupNotification />
    </>
  ) : (
    <Navigate to="/login" />
  );
};

const App = () => {
  return (
    <ThemeProvider defaultTheme="system" storageKey="chariot-theme">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Navigate to="/login" />} />
              <Route path="/login" element={<Login />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              {/* Redirect onboarding to dashboard - users will add products from there */}
              <Route path="/onboarding" element={<Navigate to="/dashboard" />} />
              
              {/* Protected routes */}
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/campaign" element={<ProtectedRoute><Campaign /></ProtectedRoute>} />
              <Route path="/campaign/create" element={<ProtectedRoute><CampaignCreation /></ProtectedRoute>} />
              <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
              <Route path="/alerts" element={<ProtectedRoute><Alerts /></ProtectedRoute>} />
              <Route path="/add-product" element={<ProtectedRoute><AddProduct /></ProtectedRoute>} />
              <Route path="/products" element={<ProtectedRoute><Products /></ProtectedRoute>} />
              <Route path="/saved-products" element={<ProtectedRoute><SavedProducts /></ProtectedRoute>} />
              <Route path="/platforms" element={<ProtectedRoute><PlatformConnections /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
              
              {/* Redirect analytics to reports since they're merged */}
              <Route path="/analytics" element={<Navigate to="/reports" />} />
              
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;
