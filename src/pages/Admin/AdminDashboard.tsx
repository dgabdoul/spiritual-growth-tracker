
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Header from '@/components/Header';
import PageTransition from '@/components/PageTransition';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Link } from 'react-router-dom';
import { Users, Mail, CreditCard, ArrowUpRight, Bell, Settings, PieChart, Activity, TrendingUp } from 'lucide-react';

const AdminDashboard = () => {
  const { isAdmin } = useAuth();

  // Demo data for charts
  const userActivityData = [
    { month: 'Jan', utilisateurs: 10, evaluations: 12 },
    { month: 'Fév', utilisateurs: 15, evaluations: 18 },
    { month: 'Mar', utilisateurs: 20, evaluations: 25 },
    { month: 'Avr', utilisateurs: 35, evaluations: 40 },
    { month: 'Mai', utilisateurs: 50, evaluations: 60 },
    { month: 'Juin', utilisateurs: 65, evaluations: 75 },
  ];

  const revenueData = [
    { name: 'Jan', revenue: 2500 },
    { name: 'Fév', revenue: 3200 },
    { name: 'Mar', revenue: 2800 },
    { name: 'Avr', revenue: 5500 },
    { name: 'Mai', revenue: 4800 },
    { name: 'Juin', revenue: 6300 },
  ];

  const recentActivities = [
    { id: 1, user: 'Thomas L.', action: 'Nouvelle évaluation', time: 'Il y a 23 min' },
    { id: 2, user: 'Marie K.', action: 'Inscription', time: 'Il y a 2h' },
    { id: 3, user: 'Jean D.', action: 'Paiement reçu', time: 'Il y a 3h' },
    { id: 4, user: 'Sophie M.', action: 'Contact support', time: 'Hier' },
    { id: 5, user: 'Paul R.', action: 'Accès premium', time: 'Hier' },
  ];

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
        <main className="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full">
          <div className="flex flex-col space-y-6">
            <div className="flex justify-between items-center mb-2">
              <h1 className="text-3xl font-bold text-gray-900">Tableau de bord administrateur</h1>
              <div className="flex items-center space-x-2">
                <Bell className="h-5 w-5 text-gray-500 hover:text-spirit-purple cursor-pointer" />
                <Settings className="h-5 w-5 text-gray-500 hover:text-spirit-purple cursor-pointer" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <DashboardCard 
                title="Utilisateurs" 
                value="128" 
                change="+12%" 
                icon={<Users className="h-5 w-5 text-spirit-purple" />} 
                linkTo="/admin/users"
              />
              <DashboardCard 
                title="Campagnes Email" 
                value="24" 
                change="+3" 
                icon={<Mail className="h-5 w-5 text-spirit-purple" />} 
                linkTo="/admin/email-campaigns"
              />
              <DashboardCard 
                title="Revenus" 
                value="5,280 €" 
                change="+18%" 
                icon={<CreditCard className="h-5 w-5 text-spirit-purple" />} 
                linkTo="/admin/statistics"
              />
              <DashboardCard 
                title="Évaluations" 
                value="438" 
                change="+21%" 
                icon={<Activity className="h-5 w-5 text-spirit-purple" />} 
                linkTo="/admin/statistics"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="col-span-1 lg:col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">Revenu mensuel</CardTitle>
                  <CardDescription>Évolution des revenus sur les 6 derniers mois</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={revenueData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="revenue" stroke="#9b87f5" activeDot={{ r: 8 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="col-span-1">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">Activité récente</CardTitle>
                  <CardDescription>Dernières actions des utilisateurs</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivities.map(activity => (
                      <div key={activity.id} className="flex justify-between items-center border-b border-gray-100 pb-3 last:border-0">
                        <div>
                          <p className="text-sm font-medium">{activity.user}</p>
                          <p className="text-xs text-gray-500">{activity.action}</p>
                        </div>
                        <span className="text-xs text-gray-500">{activity.time}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Activité utilisateurs</CardTitle>
                <CardDescription>Évolution du nombre d'utilisateurs et d'évaluations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={userActivityData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="utilisateurs" fill="#9b87f5" />
                      <Bar dataKey="evaluations" fill="#7E69AB" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Modules</CardTitle>
                  <CardDescription>Accès rapide aux modules d'administration</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <AdminModuleCard 
                      title="Gestion utilisateurs" 
                      description="Gérer les utilisateurs et les rôles" 
                      icon={<Users className="h-12 w-12 text-spirit-purple" />} 
                      linkTo="/admin/users" 
                    />
                    <AdminModuleCard 
                      title="Statistiques" 
                      description="Analyser les performances" 
                      icon={<PieChart className="h-12 w-12 text-spirit-purple" />} 
                      linkTo="/admin/statistics" 
                    />
                    <AdminModuleCard 
                      title="Campagnes email" 
                      description="Gérer les emails marketing" 
                      icon={<Mail className="h-12 w-12 text-spirit-purple" />} 
                      linkTo="/admin/email-campaigns" 
                    />
                    <AdminModuleCard 
                      title="Intégrations" 
                      description="Configurer les API externes" 
                      icon={<Settings className="h-12 w-12 text-spirit-purple" />} 
                      linkTo="/admin/integrations" 
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Performance Globale</CardTitle>
                  <CardDescription>Indicateurs clés de performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Taux de conversion</span>
                        <span className="text-sm font-bold">23%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="bg-spirit-purple h-full rounded-full" style={{ width: "23%" }}></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Engagement utilisateur</span>
                        <span className="text-sm font-bold">68%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="bg-spirit-purple h-full rounded-full" style={{ width: "68%" }}></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Satisfaction</span>
                        <span className="text-sm font-bold">92%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="bg-spirit-purple h-full rounded-full" style={{ width: "92%" }}></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Rétention</span>
                        <span className="text-sm font-bold">78%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="bg-spirit-purple h-full rounded-full" style={{ width: "78%" }}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </PageTransition>
  );
};

const DashboardCard = ({ title, value, change, icon, linkTo }: { title: string, value: string, change: string, icon: React.ReactNode, linkTo: string }) => {
  return (
    <Link to={linkTo} className="block transition duration-200 hover:scale-[1.02]">
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className="text-sm text-gray-500">{title}</p>
              <div className="text-2xl font-bold">{value}</div>
              <p className="text-xs text-green-500 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" /> {change}
              </p>
            </div>
            <div className="bg-gray-100 p-2 rounded-md">
              {icon}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

const AdminModuleCard = ({ title, description, icon, linkTo }: { title: string, description: string, icon: React.ReactNode, linkTo: string }) => {
  return (
    <Link to={linkTo} className="block">
      <Card className="hover:shadow-md transition duration-200 hover:border-spirit-purple/50 h-full">
        <CardContent className="p-6 flex flex-col items-center text-center h-full">
          <div className="bg-spirit-purple/10 p-3 rounded-full mb-4">
            {icon}
          </div>
          <h3 className="font-medium">{title}</h3>
          <p className="text-sm text-gray-500">{description}</p>
          <div className="mt-auto pt-4 flex items-center text-spirit-purple text-sm">
            <span>Accéder</span>
            <ArrowUpRight className="h-3 w-3 ml-1" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default AdminDashboard;
