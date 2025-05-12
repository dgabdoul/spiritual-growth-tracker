import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import Header from '@/components/Header';
import { Brain, Heart, Lightbulb, Users, Coins, TrendingUp, UserCog } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Statistics: React.FC = () => {
  const { user } = useAuth();

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

  const categoryStats = [
    { name: 'Psychologie', value: 68, icon: <Brain className="h-4 w-4" />, color: '#9b87f5' },
    { name: 'Santé', value: 72, icon: <Heart className="h-4 w-4" />, color: '#E5DEFF' },
    { name: 'Spiritualité', value: 84, icon: <Lightbulb className="h-4 w-4" />, color: '#7E69AB' },
    { name: 'Relations', value: 65, icon: <Users className="h-4 w-4" />, color: '#D6BCFA' },
    { name: 'Finances', value: 53, icon: <Coins className="h-4 w-4" />, color: '#8E9196' },
  ];

  const userActivity = [
    { month: 'Jan', utilisateurs: 10, evaluations: 12 },
    { month: 'Fév', utilisateurs: 15, evaluations: 18 },
    { month: 'Mar', utilisateurs: 20, evaluations: 25 },
    { month: 'Avr', utilisateurs: 35, evaluations: 40 },
    { month: 'Mai', utilisateurs: 50, evaluations: 60 },
    { month: 'Juin', utilisateurs: 65, evaluations: 75 },
  ];

  const scoreDistribution = [
    { score: '0-20', utilisateurs: 5 },
    { score: '21-40', utilisateurs: 12 },
    { score: '41-60', utilisateurs: 25 },
    { score: '61-80', utilisateurs: 18 },
    { score: '81-100', utilisateurs: 8 },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 p-6">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">Statistiques</h1>
            <div className="flex items-center gap-4">
              <Link to="/admin/users">
                <Button variant="outline" className="flex items-center gap-2">
                  <UserCog className="h-4 w-4" />
                  Gestion des utilisateurs
                </Button>
              </Link>
              <div className="text-sm text-gray-500">Mise à jour: 12/04/2025</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Users className="mr-2 h-5 w-5 text-spirit-purple" />
                  Utilisateurs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">128</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-500 font-medium flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" /> +12% par rapport au mois dernier
                  </span>
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Brain className="mr-2 h-5 w-5 text-spirit-purple" />
                  Évaluations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">438</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-500 font-medium flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" /> +21% par rapport au mois dernier
                  </span>
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Lightbulb className="mr-2 h-5 w-5 text-spirit-purple" />
                  Score moyen
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">67%</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-500 font-medium flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" /> +3% par rapport au mois dernier
                  </span>
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Scores par catégorie</CardTitle>
                <CardDescription>
                  Scores moyens par catégorie pour toutes les évaluations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer className="h-80" config={{
                  Psychologie: { color: '#9b87f5' },
                  Santé: { color: '#E5DEFF' },
                  Spiritualité: { color: '#7E69AB' },
                  Relations: { color: '#D6BCFA' },
                  Finances: { color: '#8E9196' },
                }}>
                  <BarChart data={categoryStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="rounded-lg border bg-background p-2 shadow-sm">
                              <div className="grid grid-cols-2 gap-2">
                                <div className="flex items-center">
                                  {payload[0].payload.icon}
                                  <span className="ml-1 font-semibold">{payload[0].name}</span>
                                </div>
                                <div className="text-right font-medium">
                                  {payload[0].value}%
                                </div>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="value" name="Score">
                      {categoryStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Distribution des scores</CardTitle>
                <CardDescription>
                  Répartition des utilisateurs par tranches de score
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer className="h-80" config={{
                  "0-20": { color: '#FF6384' },
                  "21-40": { color: '#FFCE56' },
                  "41-60": { color: '#36A2EB' },
                  "61-80": { color: '#4BC0C0' },
                  "81-100": { color: '#9966FF' },
                }}>
                  <PieChart>
                    <Pie
                      data={scoreDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="utilisateurs"
                      nameKey="score"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {scoreDistribution.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={['#FF6384', '#FFCE56', '#36A2EB', '#4BC0C0', '#9966FF'][index % 5]} 
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Activité utilisateurs</CardTitle>
              <CardDescription>
                Évolution du nombre d'utilisateurs et d'évaluations au cours des 6 derniers mois
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer className="h-80" config={{
                utilisateurs: { color: '#9b87f5' },
                evaluations: { color: '#7E69AB' },
              }}>
                <BarChart data={userActivity}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar dataKey="utilisateurs" name="Utilisateurs" fill="#9b87f5" />
                  <Bar dataKey="evaluations" name="Évaluations" fill="#7E69AB" />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Statistics;
