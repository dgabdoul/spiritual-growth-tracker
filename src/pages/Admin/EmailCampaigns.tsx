
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/sonner';
import Header from '@/components/Header';
import PageTransition from '@/components/PageTransition';
import { Mail, Send, Users, Edit2, Trash2, Clock, PlusCircle, ListFilter, Search } from 'lucide-react';

const EmailCampaigns: React.FC = () => {
  const { isAdmin } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState('all');

  // Demo data for email campaigns
  const campaigns = [
    {
      id: 1,
      name: 'Bienvenue aux nouveaux utilisateurs',
      subject: 'Bienvenue dans SpiritTrack !',
      status: 'active',
      sentCount: 158,
      openRate: '68%',
      createdAt: '12/04/2025',
      lastSent: '10/05/2025',
    },
    {
      id: 2,
      name: 'Rappel d\'évaluation mensuelle',
      subject: 'Ne manquez pas votre évaluation de mai',
      status: 'scheduled',
      sentCount: 0,
      openRate: '-',
      createdAt: '05/05/2025',
      lastSent: 'Programmé pour 20/05/2025',
    },
    {
      id: 3,
      name: 'Nouvelles fonctionnalités',
      subject: 'Découvrez les nouvelles fonctionnalités !',
      status: 'draft',
      sentCount: 0,
      openRate: '-',
      createdAt: '08/05/2025',
      lastSent: '-',
    },
    {
      id: 4,
      name: 'Newsletter mensuelle - Avril',
      subject: 'Votre newsletter mensuelle SpiritTrack',
      status: 'completed',
      sentCount: 412,
      openRate: '72%',
      createdAt: '01/04/2025',
      lastSent: '02/04/2025',
    },
    {
      id: 5,
      name: 'Offre spéciale abonnement premium',
      subject: '50% de réduction sur l\'abonnement premium !',
      status: 'completed',
      sentCount: 589,
      openRate: '84%',
      createdAt: '25/03/2025',
      lastSent: '26/03/2025',
    },
  ];

  const handleCreateCampaign = () => {
    toast.info("Fonctionnalité à venir", {
      description: "La création de campagnes email sera disponible prochainement."
    });
  };

  const handleDeleteCampaign = (id: number) => {
    toast.success("Campagne supprimée", {
      description: `La campagne #${id} a été supprimée avec succès.`
    });
  };

  const handleEditCampaign = (id: number) => {
    toast.info("Fonctionnalité à venir", {
      description: "L'édition de campagnes email sera disponible prochainement."
    });
  };

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           campaign.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = selectedTab === 'all' || campaign.status === selectedTab;
    
    return matchesSearch && matchesTab;
  });

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'active':
        return <Badge variant="default" className="bg-green-500">Active</Badge>;
      case 'scheduled':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">Programmée</Badge>;
      case 'draft':
        return <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-300">Brouillon</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-gray-100 text-gray-500 border-gray-300">Terminée</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (!isAdmin) {
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
    <PageTransition>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <main className="flex-1 p-4 md:p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              <h1 className="text-3xl font-bold text-gray-900">Campagnes Email</h1>
              <Button 
                onClick={handleCreateCampaign} 
                className="bg-spirit-purple hover:bg-spirit-deep-purple"
              >
                <PlusCircle className="mr-2 h-4 w-4" /> Nouvelle campagne
              </Button>
            </div>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Gérer les campagnes</CardTitle>
                <CardDescription>
                  Créez et gérez vos campagnes email pour communiquer avec vos utilisateurs.
                </CardDescription>
                <div className="flex flex-col sm:flex-row gap-4 mt-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Rechercher des campagnes..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Tabs defaultValue="all" className="w-[400px]" onValueChange={(value) => setSelectedTab(value)}>
                    <TabsList className="grid grid-cols-4">
                      <TabsTrigger value="all">Tout</TabsTrigger>
                      <TabsTrigger value="active">Actif</TabsTrigger>
                      <TabsTrigger value="scheduled">Programmé</TabsTrigger>
                      <TabsTrigger value="draft">Brouillon</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Campagne</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Envois</TableHead>
                      <TableHead>Taux d'ouverture</TableHead>
                      <TableHead>Date de création</TableHead>
                      <TableHead>Dernier envoi</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCampaigns.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-10">
                          <div className="flex flex-col items-center justify-center text-gray-500">
                            <Mail className="h-12 w-12 mb-2 opacity-30" />
                            <p>Aucune campagne trouvée</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredCampaigns.map((campaign) => (
                        <TableRow key={campaign.id}>
                          <TableCell className="font-medium">
                            <div>
                              <div className="font-medium">{campaign.name}</div>
                              <div className="text-xs text-muted-foreground mt-1">{campaign.subject}</div>
                            </div>
                          </TableCell>
                          <TableCell>{getStatusBadge(campaign.status)}</TableCell>
                          <TableCell>{campaign.sentCount}</TableCell>
                          <TableCell>{campaign.openRate}</TableCell>
                          <TableCell>{campaign.createdAt}</TableCell>
                          <TableCell>{campaign.lastSent}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="icon" onClick={() => handleEditCampaign(campaign.id)}>
                                <Edit2 className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handleDeleteCampaign(campaign.id)}>
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="text-sm text-muted-foreground">
                  Affichage de {filteredCampaigns.length} sur {campaigns.length} campagnes
                </div>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Créer une nouvelle campagne</CardTitle>
                <CardDescription>
                  Configurez votre campagne email et sélectionnez votre audience
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="campaign-name" className="text-sm font-medium">Nom de la campagne</label>
                    <Input id="campaign-name" placeholder="Ex: Newsletter Juin 2025" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="campaign-subject" className="text-sm font-medium">Objet de l'email</label>
                    <Input id="campaign-subject" placeholder="Ex: Découvrez les nouveautés de SpiritTrack" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="campaign-audience" className="text-sm font-medium">Audience</label>
                  <div className="flex items-center border rounded-md p-3 bg-gray-50">
                    <Users className="h-5 w-5 text-gray-500 mr-2" />
                    <span className="text-sm">Tous les utilisateurs (<b>128</b>)</span>
                    <Button variant="ghost" size="sm" className="ml-auto">
                      <ListFilter className="h-4 w-4 mr-1" /> Filtrer
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="campaign-content" className="text-sm font-medium">Contenu de l'email</label>
                  <Textarea id="campaign-content" placeholder="Écrivez le contenu de votre email ici..." className="min-h-[200px]" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="campaign-date" className="text-sm font-medium">Date d'envoi</label>
                    <div className="flex items-center border rounded-md p-3 bg-gray-50">
                      <Clock className="h-5 w-5 text-gray-500 mr-2" />
                      <span className="text-sm">Maintenant</span>
                      <Button variant="ghost" size="sm" className="ml-auto">
                        Programmer
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button variant="outline">Enregistrer comme brouillon</Button>
                <Button className="bg-spirit-purple hover:bg-spirit-deep-purple" onClick={handleCreateCampaign}>
                  <Send className="mr-2 h-4 w-4" /> Envoyer la campagne
                </Button>
              </CardFooter>
            </Card>
          </div>
        </main>
      </div>
    </PageTransition>
  );
};

export default EmailCampaigns;
