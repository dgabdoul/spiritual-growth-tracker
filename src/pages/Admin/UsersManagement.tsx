import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Check, UserPlus, X, Edit2, Trash2, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { toast } from '@/components/ui/sonner';
import Header from '@/components/Header';
import { supabase } from '@/integrations/supabase/client';

type User = {
  id: string;
  email: string;
  display_name?: string;
  role: string;
  created_at: string;
  last_sign_in_at?: string;
};

const UsersManagement: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const { toast: uiToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!isAdmin) return;

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*');

        if (error) throw error;
        
        if (data) {
          setUsers(data.map(profile => ({
            id: profile.id,
            email: profile.email || 'Email non disponible',
            display_name: profile.display_name || 'Sans nom',
            role: profile.role || 'user',
            created_at: new Date(profile.created_at).toLocaleDateString('fr-FR'),
            last_sign_in_at: profile.updated_at ? new Date(profile.updated_at).toLocaleDateString('fr-FR') : undefined
          })));
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs:', error);
        toast.error('Erreur lors du chargement des utilisateurs');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [isAdmin]);

  if (!user || !isAdmin) {
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

  const handleAddUser = () => {
    toast.info("Fonctionnalité à venir", {
      description: "La fonctionnalité d'ajout d'utilisateur sera disponible prochainement."
    });
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (error) throw error;

      setUsers(users.filter(user => user.id !== userId));
      toast.success("Utilisateur supprimé", {
        description: "L'utilisateur a été supprimé avec succès."
      });
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'utilisateur:', error);
      toast.error("Erreur", {
        description: "Une erreur s'est produite lors de la suppression de l'utilisateur."
      });
    }
  };

  const handleToggleAdmin = async (userId: string, currentRole: string) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) throw error;

      setUsers(users.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));
      
      toast.success("Droits modifiés", {
        description: "Les droits d'administration ont été mis à jour."
      });
    } catch (error) {
      console.error('Erreur lors de la modification des droits:', error);
      toast.error("Erreur", {
        description: "Une erreur s'est produite lors de la modification des droits."
      });
    }
  };

  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.display_name && user.display_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <main className="flex-1 p-6">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-spirit-purple mx-auto"></div>
              <p className="mt-4 text-gray-600">Chargement des utilisateurs...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 p-6">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Gestion des utilisateurs</h1>
            <Button 
              onClick={handleAddUser} 
              className="bg-spirit-purple hover:bg-spirit-deep-purple"
            >
              <UserPlus className="mr-2 h-4 w-4" /> Ajouter un utilisateur
            </Button>
          </div>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Utilisateurs</CardTitle>
              <CardDescription>
                Gérez les utilisateurs de votre application SpiritTrack.
              </CardDescription>
              <div className="relative mt-2">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher des utilisateurs..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Utilisateur</TableHead>
                    <TableHead>Administrateur</TableHead>
                    <TableHead>Date de création</TableHead>
                    <TableHead>Dernière connexion</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        <div>
                          <div>{user.display_name}</div>
                          <div className="text-sm text-muted-foreground">{user.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant={user.role === 'admin' ? "default" : "outline"}
                          size="sm"
                          className={user.role === 'admin' ? "bg-green-600 hover:bg-green-700" : ""}
                          onClick={() => handleToggleAdmin(user.id, user.role)}
                        >
                          {user.role === 'admin' ? (
                            <>
                              <Check className="mr-1 h-4 w-4" /> Oui
                            </>
                          ) : (
                            <>
                              <X className="mr-1 h-4 w-4" /> Non
                            </>
                          )}
                        </Button>
                      </TableCell>
                      <TableCell>{user.created_at}</TableCell>
                      <TableCell>{user.last_sign_in_at || "Jamais"}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon">
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          {user.email !== 'admin@example.com' && (
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleDeleteUser(user.id)}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="text-sm text-muted-foreground">
                Affichage de {filteredUsers.length} sur {users.length} utilisateurs
              </div>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default UsersManagement;
