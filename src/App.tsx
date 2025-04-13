
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { AssessmentProvider } from "./contexts/AssessmentContext";

// Pages
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/Auth/LoginPage";
import RegisterPage from "./pages/Auth/RegisterPage";
import Dashboard from "./pages/Dashboard";
import AssessmentStart from "./pages/Assessment/AssessmentStart";
import AssessmentCategory from "./pages/Assessment/AssessmentCategory";
import AssessmentResults from "./pages/Assessment/AssessmentResults";
import AssessmentHistory from "./pages/Assessment/AssessmentHistory";
import PrintView from "./pages/Assessment/PrintView";
import NotFound from "./pages/NotFound";
import SupportContactPage from "./pages/SupportContactPage";

// Admin Pages
import UsersManagement from "./pages/Admin/UsersManagement";
import Statistics from "./pages/Admin/Statistics";

const queryClient = new QueryClient();

// Admin route component
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="h-screen flex items-center justify-center">Chargement...</div>;
  }
  
  if (!user || user.email !== "admin@example.com") {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="h-screen flex items-center justify-center">Chargement...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Print route component - Less restrictive, allows non-authenticated access for sharing
const PrintRoute = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/landing" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/support" element={<SupportContactPage />} />
      
      {/* Protected Routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/assessment" element={
        <ProtectedRoute>
          <AssessmentStart />
        </ProtectedRoute>
      } />
      
      <Route path="/assessment/:category" element={
        <ProtectedRoute>
          <AssessmentCategory />
        </ProtectedRoute>
      } />
      
      <Route path="/assessment/results" element={
        <ProtectedRoute>
          <AssessmentResults />
        </ProtectedRoute>
      } />
      
      <Route path="/assessment/history" element={
        <ProtectedRoute>
          <AssessmentHistory />
        </ProtectedRoute>
      } />
      
      {/* Print view - accessible without login for sharing */}
      <Route path="/assessment/print" element={
        <PrintRoute>
          <PrintView />
        </PrintRoute>
      } />
      
      {/* Admin Routes */}
      <Route path="/admin/users" element={
        <AdminRoute>
          <UsersManagement />
        </AdminRoute>
      } />
      
      <Route path="/admin/statistics" element={
        <AdminRoute>
          <Statistics />
        </AdminRoute>
      } />
      
      {/* Catch all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <AssessmentProvider>
            <AppRoutes />
            <Toaster />
            <Sonner />
          </AssessmentProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </BrowserRouter>
);

export default App;
