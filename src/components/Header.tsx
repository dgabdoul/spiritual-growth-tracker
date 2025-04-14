
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from '@/lib/utils';
import { LogOut, User, BarChart3, Users, Settings, HelpCircle, Info, Home } from 'lucide-react';

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="w-full py-3 px-6 sm:px-12 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-gradient">
          SpiritTrack
        </Link>

        {user ? (
          <div className="flex items-center gap-4">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent hover:bg-gray-50">Applications</NavigationMenuTrigger>
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
                      <ListItem to="/assessment" title="Évaluation" icon={<BarChart3 className="h-4 w-4 mr-2" />}>
                        Commencez une nouvelle évaluation spirituelle
                      </ListItem>
                      <ListItem to="/assessment/history" title="Historique" icon={<BarChart3 className="h-4 w-4 mr-2" />}>
                        Consultez vos évaluations passées
                      </ListItem>
                      <ListItem to="/support" title="Support" icon={<HelpCircle className="h-4 w-4 mr-2" />}>
                        Contactez notre équipe de support technique
                      </ListItem>
                      {user.email === "admin@example.com" && (
                        <ListItem to="/admin" title="Administration" icon={<Settings className="h-4 w-4 mr-2" />}>
                          Accédez aux outils d'administration
                        </ListItem>
                      )}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent hover:bg-gray-50">Informations</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4">
                      <ListItem
                        to="/landing"
                        title="Accueil"
                        icon={<Home className="h-4 w-4 mr-2" />}
                      >
                        Découvrez notre plateforme et nos services
                      </ListItem>
                      <ListItem
                        to="/about"
                        title="À propos"
                        icon={<Info className="h-4 w-4 mr-2" />}
                      >
                        En savoir plus sur notre mission et notre équipe
                      </ListItem>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                {user.email === "admin@example.com" && (
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="bg-transparent hover:bg-gray-50">Administration</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[400px] gap-3 p-4">
                        <ListItem
                          to="/admin/users"
                          title="Gestion des utilisateurs"
                          icon={<Users className="h-4 w-4 mr-2" />}
                        >
                          Gérez les utilisateurs et leurs accès
                        </ListItem>
                        <ListItem
                          to="/admin/statistics"
                          title="Statistiques"
                          icon={<BarChart3 className="h-4 w-4 mr-2" />}
                        >
                          Consultez les statistiques d'utilisation
                        </ListItem>
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                )}
              </NavigationMenuList>
            </NavigationMenu>
            
            <Link to="/assessment">
              <Button variant="default" className="bg-spirit-purple hover:bg-spirit-deep-purple">
                Nouvelle Évaluation
              </Button>
            </Link>

            <Link to="/support">
              <Button variant="outline">
                <HelpCircle size={18} className="mr-2" />
                Support
              </Button>
            </Link>
            
            <Button variant="ghost" onClick={() => logout()} className="text-gray-600">
              <LogOut size={18} />
              <span className="hidden sm:inline ml-2">Déconnexion</span>
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Link to="/landing">
              <Button variant="ghost">
                <Home size={18} className="mr-2" />
                Accueil
              </Button>
            </Link>
            <Link to="/about">
              <Button variant="ghost">
                <Info size={18} className="mr-2" />
                À propos
              </Button>
            </Link>
            <Link to="/support">
              <Button variant="outline">
                <HelpCircle size={18} className="mr-2" />
                Support
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="ghost">Connexion</Button>
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

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & { to: string; icon?: React.ReactNode }
>(({ className, title, children, to, icon, ...props }, ref) => {
  return (
    <li>
      <Link
        to={to}
        className={cn(
          "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
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
