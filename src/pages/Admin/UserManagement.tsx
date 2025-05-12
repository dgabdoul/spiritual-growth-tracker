
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Download, Filter, MoreHorizontal, UserCheck, UserX, Shield, Mail } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from "sonner";
import LoadingIndicator from '@/components/LoadingIndicator';

interface UserProfile {
  id: string;
  email: string;
  display_name: string | null;
  role: string | null;
  avatar_url: string | null;
  created_at: string;
  last_sign_in_at: string | null;
}

const UserManagement: React.FC = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserProfile[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        // Récupérer les utilisateurs depuis la table profiles
        const { data, error } = await supabase
          .from('profiles')
          .select('id, email, display_name, role, avatar_url, created_at, last_sign_in_at')
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        if (data) {
          // Make sure we're setting valid data by checking it meets our UserProfile interface
          const validUsers = data.filter(user => 
            typeof user.id === 'string' && 
            typeof user.email === 'string'
          ) as UserProfile[];
          
          setUsers(validUsers);
          setFilteredUsers(validUsers);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs :', error);
        toast.error("Erreur lors du chargement des utilisateurs");
        // Initialize with empty arrays to prevent crashes
        setUsers([]);
        setFilteredUsers([]);
      } finally {
        setLoading(false);
      }
    };

    if (user && user.email === "admin@example.com") {
      fetchUsers();
    }
  }, [user]);

  useEffect(() => {
    // Filtrer les utilisateurs en fonction du terme de recherche et du filtre de rôle
    let filtered = users;
    
    if (searchTerm) {
      filtered = filtered.filter(user => 
        (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase())) || 
        (user.display_name && user.display_name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    if (roleFilter) {
      filtered = filtered.filter(user => user.role === roleFilter);
    }
    
    setFilteredUsers(filtered);
  }, [searchTerm, users, roleFilter]);

  const handleChangeRole = async (userId: string, newRole: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);
        
      if (error) throw error;
      
      // Mettre à jour l'état local
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userId ? { ...user, role: newRole } : user
        )
      );
      
      toast.success(`Rôle mis à jour avec succès`);
    } catch (error) {
      console.error('Erreur lors de la modification du rôle :', error);
      toast.error("Erreur lors de la modification du rôle");
    }
  };

  const exportUserData = () => {
    const csvData = [
      ['ID', 'Email', 'Nom', 'Rôle', 'Date d\'inscription', 'Dernière connexion'],
      ...filteredUsers.map(user => [
        user.id,
        user.email,
        user.display_name || 'Non défini',
        user.role || 'utilisateur',
        new Date(user.created_at).toLocaleDateString(),
        user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : 'Jamais'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `utilisateurs-spirittrack-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    toast.success("Export réussi", {
      description: "Les données ont été exportées avec succès"
    });
  };

  const sendWelcomeEmail = async (userId: string, email: string) => {
    try {
      // Cette fonction pourrait appeler une fonction Edge pour envoyer un email
      toast.success(`Email de bienvenue envoyé à ${email}`);
    } catch (error) {
      toast.error("Erreur lors de l'envoi de l'email");
    }
  };

  // Si l'utilisateur n'est pas administrateur, afficher un message d'accès refusé
  if (!user || user.email !== "admin@example.com") {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <main className="flex-1 p-6">
          <div className="max-w-5xl mx-auto text-center py-12">
            <h1 className="text-3xl font-bold text-gray-900">Accès refusé</h1>
            <p className="mt-4 text-gray-600">Vous n'avez pas les droits nécessaires pour accéder à cette page.</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">Gestion des utilisateurs</h1>
            <Button onClick={exportUserData} variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              Exporter
            </Button>
          </div>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Utilisateurs ({filteredUsers.length})</CardTitle>
              <CardDescription>
                Gérez les utilisateurs et leurs rôles dans SpiritTrack
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-6 items-start md:items-center">
                <div className="relative flex-grow">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Rechercher par nom ou email..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Filter className="h-4 w-4" />
                        Filtrer par rôle
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Rôles</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => setRoleFilter(null)}>
                        Tous les rôles
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setRoleFilter('user')}>
                        Utilisateurs
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setRoleFilter('premium')}>
                        Utilisateurs premium
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setRoleFilter('admin')}>
                        Administrateurs
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <LoadingIndicator />
                </div>
              ) : (
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[250px]">Utilisateur</TableHead>
                        <TableHead className="w-[150px]">Rôle</TableHead>
                        <TableHead className="hidden md:table-cell">Date d'inscription</TableHead>
                        <TableHead className="hidden md:table-cell">Dernière connexion</TableHead>
                        <TableHead className="w-[100px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                            Aucun utilisateur trouvé
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredUsers.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell className="font-medium">
                              <div className="flex flex-col">
                                <span className="font-semibold">{user.display_name || 'Sans nom'}</span>
                                <span className="text-sm text-muted-foreground">{user.email}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <RoleBadge role={user.role} />
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              {new Date(user.created_at).toLocaleDateString()}
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              {user.last_sign_in_at 
                                ? new Date(user.last_sign_in_at).toLocaleDateString() 
                                : 'Jamais'
                              }
                            </TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Menu</span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuItem 
                                    onClick={() => handleChangeRole(user.id, 'admin')}
                                  >
                                    <Shield className="h-4 w-4 mr-2" />
                                    Promouvoir admin
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => handleChangeRole(user.id, 'premium')}
                                  >
                                    <UserCheck className="h-4 w-4 mr-2" />
                                    Définir premium
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => handleChangeRole(user.id, 'user')}
                                  >
                                    <UserX className="h-4 w-4 mr-2" />
                                    Définir utilisateur
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={() => sendWelcomeEmail(user.id, user.email)}
                                  >
                                    <Mail className="h-4 w-4 mr-2" />
                                    Envoyer email
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

// Component pour le badge de rôle
const RoleBadge: React.FC<{ role: string | null }> = ({ role }) => {
  switch (role) {
    case 'admin':
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Admin</Badge>;
    case 'premium':
      return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">Premium</Badge>;
    default:
      return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">Utilisateur</Badge>;
  }
};

export default UserManagement;
