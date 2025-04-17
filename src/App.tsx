import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { AssessmentProvider } from "./contexts/AssessmentContext";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster as Sonner } from "@/components/ui/sonner";

// Pages
import LandingPage from "./pages/LandingPage";
import AboutPage from "./pages/AboutPage";
import LoginPage from "./pages/Auth/LoginPage";
import RegisterPage from "./pages/Auth/RegisterPage";
import ForgotPasswordPage from "./pages/Auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/Auth/ResetPasswordPage";
import Dashboard from "./pages/Dashboard";
import AssessmentStart from "./pages/Assessment/AssessmentStart";
import AssessmentCategory from "./pages/Assessment/AssessmentCategory";
import AssessmentResults from "./pages/Assessment/AssessmentResults";
import AssessmentHistory from "./pages/Assessment/AssessmentHistory";
import PrintView from "./pages/Assessment/PrintView";
import NotFound from "./pages/NotFound";
import SupportContactPage from "./pages/SupportContactPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import TermsOfServicePage from "./pages/TermsOfServicePage";
import UsersManagement from "./pages/Admin/UsersManagement";
import Statistics from "./pages/Admin/Statistics";
import QuranSearchPage from "./pages/QuranSearchPage";

const queryClient = new QueryClient();

// Move these components inside the App function to fix the hooks issue
function App() {
  // Create a function component for routes that should be wrapped with proper context
  const AppRoutes = () => {
    const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
      const { user, loading } = useAuth();
      
      if (loading) {
        return <div>Loading...</div>;
      }
      
      if (!user) {
        return <Navigate to="/login" />;
      }
      
      return <>{children}</>;
    }
    
    const IndexRoute = () => {
      const { user, loading } = useAuth();
      
      if (loading) {
        return <div className="h-screen flex items-center justify-center">Chargement...</div>;
      }
      
      if (user) {
        return <Navigate to="/dashboard" replace />;
      }
      
      return <Navigate to="/register" replace />;
    };
    
    const AdminRoute = ({ children }: { children: React.ReactNode }) => {
      const { user, loading } = useAuth();
      
      if (loading) {
        return <div className="h-screen flex items-center justify-center">Chargement...</div>;
      }
      
      if (!user || !user.email || user.email !== "admin@example.com") {
        return <Navigate to="/login" replace />;
      }
      
      return <>{children}</>;
    };
    
    const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
      const { user, loading } = useAuth();
      
      if (loading) {
        return <div className="h-screen flex items-center justify-center">Chargement...</div>;
      }
      
      if (!user) {
        return <Navigate to="/login" replace />;
      }
      
      return <>{children}</>;
    };
    
    const PrintRoute = ({ children }: { children: React.ReactNode }) => {
      return <>{children}</>;
    };

    return (
      <Routes>
        <Route path="/" element={<IndexRoute />} />
        
        {/* Public Routes */}
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        <Route path="/support" element={<SupportContactPage />} />
        <Route path="/privacy" element={<PrivacyPolicyPage />} />
        <Route path="/terms" element={<TermsOfServicePage />} />
        <Route path="/quran-search" element={<QuranSearchPage />} />
        
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
        
        {/* Print Routes */}
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

  return (
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
}

export default App;
