
// Since Header.tsx is a read-only file, I'll need to create a new component that extends it
// This will be a new component that can be imported in place of the original Header

import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { ChartBar, LineChart } from 'lucide-react';

const EnhancedHeader = () => {
  const location = useLocation();
  const { user, signOut } = useAuth();
  
  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Déconnexion réussie",
        description: "Vous avez été déconnecté avec succès.",
      });
    } catch (error) {
      console.error('Logout failed:', error);
      toast({
        variant: "destructive",
        title: "Erreur de déconnexion",
        description: "Une erreur s'est produite lors de la déconnexion.",
      });
    }
  };
  
  // Check if the current path is the KPI Dashboard
  const isKpiDashboard = location.pathname === '/kpi-dashboard';
  
  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto flex flex-wrap items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <div className="font-bold text-xl text-spirit-purple">SpiritTrack</div>
        </div>
        
        <nav className="hidden md:flex gap-4 items-center">
          {user && (
            <>
              <Link to="/dashboard" className={`px-3 py-2 rounded-md ${location.pathname === '/dashboard' ? 'bg-gray-100 font-medium' : 'hover:bg-gray-50'}`}>
                Tableau de bord
              </Link>
              <Link to="/kpi-dashboard" className={`px-3 py-2 rounded-md flex items-center gap-1 ${isKpiDashboard ? 'bg-gray-100 font-medium' : 'hover:bg-gray-50'}`}>
                <ChartBar className="h-4 w-4" />
                KPIs & Analytics
              </Link>
              <Link to="/assessment" className={`px-3 py-2 rounded-md ${location.pathname === '/assessment' ? 'bg-gray-100 font-medium' : 'hover:bg-gray-50'}`}>
                Évaluation
              </Link>
              <Link to="/assessment/history" className={`px-3 py-2 rounded-md ${location.pathname === '/assessment/history' ? 'bg-gray-100 font-medium' : 'hover:bg-gray-50'}`}>
                Historique
              </Link>
              {/* More links can be added here */}
            </>
          )}
          {!user && (
            <>
              <Link to="/login" className={`px-3 py-2 rounded-md ${location.pathname === '/login' ? 'bg-gray-100 font-medium' : 'hover:bg-gray-50'}`}>
                Se connecter
              </Link>
              <Link to="/register" className={`px-3 py-2 rounded-md ${location.pathname === '/register' ? 'bg-gray-100 font-medium' : 'hover:bg-gray-50'}`}>
                S'inscrire
              </Link>
            </>
          )}
        </nav>
        
        <div className="flex items-center gap-2">
          {user ? (
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Déconnexion
            </Button>
          ) : (
            <Link to="/login">
              <Button size="sm">Se connecter</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default EnhancedHeader;
