
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Check, UserPlus, X, Edit2, Trash2, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';

type User = {
  id: string;
  email: string;
  displayName?: string;
  isAdmin: boolean;
  createdAt: string;
  lastLogin?: string;
};

const UsersManagement: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<User[]>([
    {
      id: 'user-123',
      email: 'admin@example.com',
      displayName: 'Admin',
      isAdmin: true,
      createdAt: '2023-03-15',
      lastLogin: '2023-04-12'
    },
    {
      id: 'user-456',
      email: 'jean.dupont@example.com',
      displayName: 'Jean Dupont',
      isAdmin: false,
      createdAt: '2023-03-18',
      lastLogin: '2023-04-10'
    },
    {
      id: 'user-789',
      email: 'marie.martin@example.com',
      displayName: 'Marie Martin',
      isAdmin: false,
      createdAt: '2023-03-25',
      lastLogin: '2023-04-08'
    },
    {
      id: 'user-101',
      email: 'pierre.dubois@example.com',
      displayName: 'Pierre Dubois',
      isAdmin: false,
      createdAt: '2023-04-01',
      lastLogin: '2023-04-05'
    }
  ]);

  // Si l'utilisateur n'est pas admin, rediriger
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

  const handleAddUser = () => {
    toast({
      title: "Fonctionnalité à venir",
      description: "La fonctionnalité d'ajout d'utilisateur sera disponible prochainement.",
    });
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter(user => user.id !== userId));
    toast({
      title: "Utilisateur supprimé",
      description: "L'utilisateur a été supprimé avec succès.",
    });
  };

  const handleToggleAdmin = (userId: string) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, isAdmin: !user.isAdmin } : user
    ));
    toast({
      title: "Droits modifiés",
      description: "Les droits d'administration ont été mis à jour.",
    });
  };

  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.displayName && user.displayName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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
                          <div>{user.displayName || "Sans nom"}</div>
                          <div className="text-sm text-muted-foreground">{user.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant={user.isAdmin ? "default" : "outline"}
                          size="sm"
                          className={user.isAdmin ? "bg-green-600 hover:bg-green-700" : ""}
                          onClick={() => handleToggleAdmin(user.id)}
                        >
                          {user.isAdmin ? (
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
                      <TableCell>{user.createdAt}</TableCell>
                      <TableCell>{user.lastLogin || "Jamais"}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon">
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          {user.id !== 'user-123' && (
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
