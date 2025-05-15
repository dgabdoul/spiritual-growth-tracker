
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Home, 
  Info, 
  HelpCircle, 
  LogOut, 
  BarChart3, 
  Settings,
  Users,
  FileText,
  BookOpen,
  User
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import Logo from './Logo';
import { toast } from "@/hooks/use-toast";

const Header: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
      toast({
        title: "Déconnexion réussie",
        description: "À bientôt sur SpiritTrack!",
      });
    } catch (error) {
      console.error('Erreur lors de la déconnexion', error);
      toast({
        title: "Erreur de déconnexion",
        description: "Veuillez réessayer",
        variant: "destructive",
      });
    }
  };

  // Helper function to check if a path is active
  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  // Style for active navigation links
  const activeLinkClass = "bg-accent/80 text-accent-foreground font-medium";

  return (
    <header className="sticky top-0 z-50 w-full py-3 px-4 sm:px-6 lg:px-8 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Logo />

        {user ? (
          <div className="flex items-center gap-2 md:gap-4">
            <NavigationMenu className="hidden sm:flex">
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className={cn(
                    "bg-transparent hover:bg-gray-50",
                    isActive('/dashboard') || isActive('/assessment') ? activeLinkClass : ""
                  )}>
                    Évaluations
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                      <li className="row-span-3">
                        <NavigationMenuLink asChild>
                          <Link
                            className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-spirit-soft-purple to-spirit-light-purple p-6 no-underline outline-none focus:shadow-md"
                            to="/dashboard"
                          >
                            <BarChart3 className="h-6 w-6 text-white" />
                            <div className="mt-4 mb-2 text-lg font-medium text-white">
                              Dashboard
                            </div>
                            <p className="text-sm leading-tight text-white/90">
                              Visualisez vos progrès et résultats
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <ListItem 
                        to="/assessment" 
                        title="Nouvelle Évaluation" 
                        icon={<FileText className="h-4 w-4 mr-2" />}
                        isActive={isActive('/assessment') && !isActive('/assessment/history')}
                      >
                        Commencez une nouvelle évaluation spirituelle
                      </ListItem>
                      <ListItem 
                        to="/assessment/results" 
                        title="Résultats Récents" 
                        icon={<BarChart3 className="h-4 w-4 mr-2" />}
                        isActive={isActive('/assessment/results')}
                      >
                        Voir vos derniers résultats d'évaluation
                      </ListItem>
                      <ListItem 
                        to="/assessment/history" 
                        title="Historique" 
                        icon={<BookOpen className="h-4 w-4 mr-2" />}
                        isActive={isActive('/assessment/history')}
                      >
                        Consultez l'historique de vos évaluations
                      </ListItem>
                      <ListItem 
                        to="/assessment/recommendations" 
                        title="Recommendations" 
                        icon={<BookOpen className="h-4 w-4 mr-2" />}
                        isActive={isActive('/assessment/recommendations')}
                      >
                        Conseils et recommandations personnalisés
                      </ListItem>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <NavigationMenuTrigger className={cn(
                    "bg-transparent hover:bg-gray-50",
                    isActive('/about') || isActive('/landing') || isActive('/quran-search') ? activeLinkClass : ""
                  )}>
                    Informations
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4">
                      <ListItem
                        to="/landing"
                        title="Accueil"
                        icon={<Home className="h-4 w-4 mr-2" />}
                        isActive={isActive('/landing')}
                      >
                        Découvrez notre plateforme et nos services
                      </ListItem>
                      <ListItem
                        to="/about"
                        title="À propos"
                        icon={<Info className="h-4 w-4 mr-2" />}
                        isActive={isActive('/about')}
                      >
                        En savoir plus sur notre mission et notre équipe
                      </ListItem>
                      <ListItem
                        to="/quran-search"
                        title="Recherche Quranique"
                        icon={<BookOpen className="h-4 w-4 mr-2" />}
                        isActive={isActive('/quran-search')}
                      >
                        Explorer les versets du Quran
                      </ListItem>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {user && user.email === "admin@example.com" && (
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className={cn(
                      "bg-transparent hover:bg-gray-50",
                      isActive('/admin') ? activeLinkClass : ""
                    )}>
                      Administration
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[400px] gap-3 p-4">
                        <ListItem
                          to="/admin"
                          title="Tableau de bord"
                          icon={<BarChart3 className="h-4 w-4 mr-2" />}
                          isActive={isActive('/admin') && location.pathname === '/admin'}
                        >
                          Aperçu général de l'administration
                        </ListItem>
                        <ListItem
                          to="/admin/users"
                          title="Gestion des utilisateurs"
                          icon={<Users className="h-4 w-4 mr-2" />}
                          isActive={isActive('/admin/users')}
                        >
                          Gérez les utilisateurs et leurs accès
                        </ListItem>
                        <ListItem
                          to="/admin/statistics"
                          title="Statistiques"
                          icon={<BarChart3 className="h-4 w-4 mr-2" />}
                          isActive={isActive('/admin/statistics')}
                        >
                          Consultez les statistiques d'utilisation
                        </ListItem>
                        <ListItem
                          to="/admin/email-campaigns"
                          title="Campagnes Email"
                          icon={<FileText className="h-4 w-4 mr-2" />}
                          isActive={isActive('/admin/email-campaigns')}
                        >
                          Gérer les campagnes d'emails
                        </ListItem>
                        <ListItem
                          to="/admin/integrations"
                          title="Intégrations"
                          icon={<Settings className="h-4 w-4 mr-2" />}
                          isActive={isActive('/admin/integrations')}
                        >
                          Configurer les intégrations externes
                        </ListItem>
                        <ListItem
                          to="/admin/webhook-settings"
                          title="Webhooks"
                          icon={<Settings className="h-4 w-4 mr-2" />}
                          isActive={isActive('/admin/webhook-settings')}
                        >
                          Configurer les webhooks
                        </ListItem>
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                )}
              </NavigationMenuList>
            </NavigationMenu>
            
            {/* Mobile navigation - hamburger menu can be added here */}
            
            <div className="flex items-center gap-2 sm:gap-3">
              <Link to="/assessment">
                <Button variant="default" className="bg-spirit-purple hover:bg-spirit-deep-purple text-white">
                  <FileText size={16} className="mr-2 hidden sm:inline-block" />
                  Évaluation
                </Button>
              </Link>

              <Link to="/support">
                <Button variant="outline" size="icon" className="sm:hidden" title="Support">
                  <HelpCircle size={16} />
                </Button>
                <Button variant="outline" className="hidden sm:flex">
                  <HelpCircle size={16} className="mr-2" />
                  Support
                </Button>
              </Link>
              
              <Button variant="ghost" onClick={handleLogout} className="text-gray-600" title="Déconnexion">
                <LogOut size={16} className="sm:mr-2" />
                <span className="hidden sm:inline">Déconnexion</span>
              </Button>

              <Link to="/profile" className="hidden sm:block">
                <Button variant="ghost" className="rounded-full size-9 p-0 overflow-hidden">
                  <User size={18} />
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Public navigation links */}
            <Link to="/landing" className={cn(
              "hidden sm:flex items-center text-sm font-medium transition-colors hover:text-primary",
              isActive('/landing') ? "text-primary" : "text-muted-foreground"
            )}>
              <Home size={16} className="mr-1.5" />
              Accueil
            </Link>
            
            <Link to="/about" className={cn(
              "hidden sm:flex items-center text-sm font-medium transition-colors hover:text-primary",
              isActive('/about') ? "text-primary" : "text-muted-foreground"
            )}>
              <Info size={16} className="mr-1.5" />
              À propos
            </Link>
            
            <Link to="/support" className={cn(
              "hidden md:flex items-center text-sm font-medium transition-colors hover:text-primary",
              isActive('/support') ? "text-primary" : "text-muted-foreground"
            )}>
              <HelpCircle size={16} className="mr-1.5" />
              Support
            </Link>

            <Link to="/login">
              <Button variant="ghost" className="hidden sm:inline-flex">Connexion</Button>
              <Button variant="ghost" size="icon" className="sm:hidden">
                <User size={18} />
              </Button>
            </Link>
            
            <Link to="/register">
              <Button variant="default" className="bg-spirit-purple hover:bg-spirit-deep-purple">
                S'inscrire
              </Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

interface ListItemProps extends React.ComponentPropsWithoutRef<"a"> {
  to: string;
  title: string;
  icon?: React.ReactNode;
  isActive?: boolean;
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  ListItemProps
>(({ className, title, children, to, icon, isActive, ...props }, ref) => {
  return (
    <li>
      <Link
        to={to}
        className={cn(
          "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
          isActive && "bg-accent text-accent-foreground font-medium",
          className
        )}
        {...props}
      >
        <div className="flex items-center text-sm font-medium leading-none">
          {icon}
          {title}
        </div>
        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
          {children}
        </p>
      </Link>
    </li>
  );
});
ListItem.displayName = "ListItem";

export default Header;
