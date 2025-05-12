import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { AssessmentProvider } from "./contexts/assessment";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { AnimatePresence } from "framer-motion";
import { Suspense, lazy } from 'react';
import LoadingIndicator from './components/LoadingIndicator';

// Lazy-loaded Pages pour les performances avec préchargement
const LandingPage = lazy(() => import("./pages/LandingPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const LoginPage = lazy(() => import("./pages/Auth/LoginPage"));
const RegisterPage = lazy(() => import("./pages/Auth/RegisterPage"));
const ForgotPasswordPage = lazy(() => import("./pages/Auth/ForgotPasswordPage"));
const ResetPasswordPage = lazy(() => import("./pages/Auth/ResetPasswordPage"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const AssessmentStart = lazy(() => import("./pages/Assessment/AssessmentStart"));
const AssessmentCategory = lazy(() => import("./pages/Assessment/AssessmentCategory"));
const AssessmentResults = lazy(() => import("./pages/Assessment/AssessmentResults"));
const AssessmentHistory = lazy(() => import("./pages/Assessment/AssessmentHistory"));
const PrintView = lazy(() => import("./pages/Assessment/PrintView"));
const NotFound = lazy(() => import("./pages/NotFound"));
const SupportContactPage = lazy(() => import("./pages/SupportContactPage"));
const PrivacyPolicyPage = lazy(() => import("./pages/PrivacyPolicyPage"));
const TermsOfServicePage = lazy(() => import("./pages/TermsOfServicePage"));
const UsersManagement = lazy(() => import("./pages/Admin/UsersManagement"));
const Statistics = lazy(() => import("./pages/Admin/Statistics"));
const QuranSearchPage = lazy(() => import("./pages/QuranSearchPage"));
const AdminDashboard = lazy(() => import("./pages/Admin/AdminDashboard"));
const EmailCampaigns = lazy(() => import("./pages/Admin/EmailCampaigns"));
const IntegrationsPage = lazy(() => import("./pages/Admin/IntegrationsPage"));
const RecommendationPage = lazy(() => import("./pages/Assessment/RecommendationPage"));
const WebhookSettings = lazy(() => import("./pages/Admin/WebhookSettings"));

// Optimisation des requêtes avec Tanstack Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1, // Réduire le nombre de tentatives pour éviter les requêtes infinies
      refetchOnWindowFocus: false, // Désactiver le refetch automatique
    },
  },
});

// Composant de chargement subtil
const PageLoader = () => (
  <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
    <LoadingIndicator size="md" minimal={true} />
  </div>
);

// Préchargement des routes importantes
const preloadRoutes = () => {
  // Précharger les routes les plus fréquemment utilisées
  import("./pages/Dashboard");
  import("./pages/Assessment/AssessmentStart");
};

function App() {
  // Précharger les routes importantes au démarrage
  preloadRoutes();
  
  // Fonctions de route protégée
  const AppRoutes = () => {
    const { user, loading } = useAuth();
    
    // Early return if auth is still loading to prevent render errors
    if (loading) {
      return <PageLoader />;
    }
    
    const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
      if (!user) {
        return <Navigate to="/login" />;
      }
      
      return <>{children}</>;
    }
    
    const IndexRoute = () => {
      if (user) {
        return <Navigate to="/dashboard" replace />;
      }
      
      return <Navigate to="/landing" replace />;
    };
    
    const AdminRoute = ({ children }: { children: React.ReactNode }) => {
      if (!user || !isAdmin) {
        return <Navigate to="/login" replace />;
      }
      
      return <>{children}</>;
    };
    
    const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
      if (!user) {
        return <Navigate to="/login" replace />;
      }
      
      return <>{children}</>;
    };
    
    const PrintRoute = ({ children }: { children: React.ReactNode }) => {
      return <>{children}</>;
    };

    // Fix: isAdmin is not defined, get it from useAuth
    const { isAdmin } = useAuth();

    return (
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<IndexRoute />} />
          
          {/* Public Routes */}
          <Route path="/landing" element={
            <Suspense fallback={<PageLoader />}>
              <LandingPage />
            </Suspense>
          } />
          <Route path="/about" element={
            <Suspense fallback={<PageLoader />}>
              <AboutPage />
            </Suspense>
          } />
          <Route path="/login" element={
            <Suspense fallback={<PageLoader />}>
              <LoginPage />
            </Suspense>
          } />
          <Route path="/register" element={
            <Suspense fallback={<PageLoader />}>
              <RegisterPage />
            </Suspense>
          } />
          <Route path="/forgot-password" element={
            <Suspense fallback={<PageLoader />}>
              <ForgotPasswordPage />
            </Suspense>
          } />
          <Route path="/reset-password/:token" element={
            <Suspense fallback={<PageLoader />}>
              <ResetPasswordPage />
            </Suspense>
          } />
          <Route path="/support" element={
            <Suspense fallback={<PageLoader />}>
              <SupportContactPage />
            </Suspense>
          } />
          <Route path="/privacy" element={
            <Suspense fallback={<PageLoader />}>
              <PrivacyPolicyPage />
            </Suspense>
          } />
          <Route path="/terms" element={
            <Suspense fallback={<PageLoader />}>
              <TermsOfServicePage />
            </Suspense>
          } />
          <Route path="/quran-search" element={
            <Suspense fallback={<PageLoader />}>
              <QuranSearchPage />
            </Suspense>
          } />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Suspense fallback={<PageLoader />}>
                <Dashboard />
              </Suspense>
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
          
          <Route path="/assessment/recommendations" element={
            <ProtectedRoute>
              <RecommendationPage />
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
          <Route path="/admin" element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } />
          
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
          
          <Route path="/admin/email-campaigns" element={
            <AdminRoute>
              <EmailCampaigns />
            </AdminRoute>
          } />
          
          <Route path="/admin/integrations" element={
            <AdminRoute>
              <IntegrationsPage />
            </AdminRoute>
          } />
          
          <Route path="/admin/webhook-settings" element={
            <WebhookSettings />
          } />
          
          {/* Catch all */}
          <Route path="*" element={
            <Suspense fallback={<PageLoader />}>
              <NotFound />
            </Suspense>
          } />
        </Routes>
      </AnimatePresence>
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
