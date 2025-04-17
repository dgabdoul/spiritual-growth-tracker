
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useAssessment, Category } from '@/contexts/AssessmentContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/Header';
import CategoryCard from '@/components/CategoryCard';
import ProgressBar from '@/components/ProgressBar';
import { 
  Brain, Heart, Lightbulb, Users, Coins, PlusCircle, 
  CalendarDays, TrendingUp, LineChart as LineChartIcon,
  History, Printer, Download, UserCheck, Activity, BarChart, Database
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart as RechartsBarChart, Bar } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { supabase } from '@/integrations/supabase/client';

interface UserAssessment {
  id: string;
  assessment_date: string;
  psychology_score: number;
  health_score: number;
  spirituality_score: number;
  relationships_score: number;
  finances_score: number;
  overall_score: number;
}

interface AdminStats {
  total_users: number;
  active_users: number;
  total_assessments: number;
  avg_overall_score: number;
}

const Dashboard: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const { assessmentHistory, startNewAssessment } = useAssessment();
  const navigate = useNavigate();
  const [userAssessments, setUserAssessments] = useState<UserAssessment[]>([]);
  const [adminStats, setAdminStats] = useState<AdminStats>({
    total_users: 0,
    active_users: 0,
    total_assessments: 0,
    avg_overall_score: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('user_assessments')
          .select('*')
          .eq('user_id', user.id)
          .order('assessment_date', { ascending: false });

        if (error) throw error;
        if (data) {
          setUserAssessments(data);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des évaluations:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchAdminStats = async () => {
      if (!isAdmin) return;

      try {
        // Fetch total users count
        const { count: usersCount, error: usersError } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });

        if (usersError) throw usersError;

        // Fetch total assessments count
        const { count: assessmentsCount, error: assessmentsError } = await supabase
          .from('user_assessments')
          .select('*', { count: 'exact', head: true });

        if (assessmentsError) throw assessmentsError;

        // Fetch average overall score
        const { data: avgData, error: avgError } = await supabase
          .from('user_assessments')
          .select('overall_score');

        if (avgError) throw avgError;

        const avgScore = avgData && avgData.length > 0
          ? avgData.reduce((sum: number, item: any) => sum + item.overall_score, 0) / avgData.length
          : 0;

        // Calculate active users (users with at least one assessment)
        const { data: activeUsersData, error: activeUsersError } = await supabase
          .from('user_assessments')
          .select('user_id')
          .limit(1000);

        if (activeUsersError) throw activeUsersError;
        const activeUsers = new Set(activeUsersData?.map(item => item.user_id)).size;

        setAdminStats({
          total_users: usersCount || 0,
          active_users: activeUsers || 0,
          total_assessments: assessmentsCount || 0,
          avg_overall_score: Math.round(avgScore * 10) / 10
        });
      } catch (error) {
        console.error('Erreur lors de la récupération des statistiques admin:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
    if (isAdmin) fetchAdminStats();
  }, [user, isAdmin]);

  const handleStartAssessment = () => {
    startNewAssessment();
    navigate('/assessment');
  };

  const latestAssessment = userAssessments.length > 0 
    ? userAssessments[0]
    : null;

  const lineChartData = userAssessments.slice().reverse().map(assessment => {
    const date = new Date(assessment.assessment_date).toLocaleDateString('fr-FR');
    return {
      date,
      psychology: assessment.psychology_score || 0,
      health: assessment.health_score || 0,
      spirituality: assessment.spirituality_score || 0,
      relationships: assessment.relationships_score || 0,
      finances: assessment.finances_score || 0,
      overall: assessment.overall_score || 0,
    };
  });

  const barChartData = latestAssessment ? [
    { name: 'Psychologie', value: latestAssessment.psychology_score || 0 },
    { name: 'Santé', value: latestAssessment.health_score || 0 },
    { name: 'Spiritualité', value: latestAssessment.spirituality_score || 0 },
    { name: 'Relations', value: latestAssessment.relationships_score || 0 },
    { name: 'Finances', value: latestAssessment.finances_score || 0 },
  ] : [];

  const getCategoryIcon = (category: Category) => {
    switch (category) {
      case 'psychology':
        return <Brain size={24} />;
      case 'health':
        return <Heart size={24} />;
      case 'spirituality':
        return <Lightbulb size={24} />;
      case 'relationships':
        return <Users size={24} />;
      case 'finances':
        return <Coins size={24} />;
    }
  };

  const getStats = () => {
    if (userAssessments.length === 0) return null;

    const totalAssessments = userAssessments.length;
    const latestScore = latestAssessment?.overall_score || 0;
    
    let improvement = 0;
    if (userAssessments.length > 1) {
      const previousAssessment = userAssessments[1];
      improvement = latestScore - (previousAssessment.overall_score || 0);
    }

    return {
      totalAssessments,
      latestScore,
      improvement
    };
  };

  const handlePrint = () => {
    if (!latestAssessment) return;
    
    localStorage.setItem('printAssessment', JSON.stringify({
      id: latestAssessment.id,
      date: latestAssessment.assessment_date,
      scores: {
        psychology: latestAssessment.psychology_score,
        health: latestAssessment.health_score,
        spirituality: latestAssessment.spirituality_score,
        relationships: latestAssessment.relationships_score,
        finances: latestAssessment.finances_score
      },
      overallScore: latestAssessment.overall_score
    }));
    
    const printWindow = window.open('/assessment/print', '_blank');
    if (printWindow) {
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
        }, 500);
      };
    }
  };

  const handleDownload = () => {
    if (!latestAssessment) return;
    
    let csvContent = "Catégorie,Score\n";
    
    csvContent += `Psychologie,${latestAssessment.psychology_score}\n`;
    csvContent += `Santé,${latestAssessment.health_score}\n`;
    csvContent += `Spiritualité,${latestAssessment.spirituality_score}\n`;
    csvContent += `Relations,${latestAssessment.relationships_score}\n`;
    csvContent += `Finances,${latestAssessment.finances_score}\n`;
    
    csvContent += `\nScore Global,${latestAssessment.overall_score}\n`;
    csvContent += `\nDate,${format(new Date(latestAssessment.assessment_date), 'dd/MM/yyyy', { locale: fr })}\n`;
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `evaluation_${format(new Date(latestAssessment.assessment_date), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const stats = getStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-spirit-purple mx-auto"></div>
              <p className="mt-4 text-gray-600">Chargement des données...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // SECTION ADMIN: Affichage des statistiques administratives
  if (isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Tableau de bord administrateur</h1>
              <p className="text-gray-600 mt-1">Statistiques globales de la plateforme SpiritTrack</p>
            </div>
          </div>

          {/* Statistiques globales */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Utilisateurs Totaux
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <UserCheck className="h-6 w-6 text-spirit-purple mr-2" />
                  <span className="text-2xl font-bold">{adminStats.total_users}</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Utilisateurs Actifs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Activity className="h-6 w-6 text-spirit-purple mr-2" />
                  <span className="text-2xl font-bold">{adminStats.active_users}</span>
                  <span className="ml-2 text-sm text-gray-500">
                    ({Math.round((adminStats.active_users / adminStats.total_users) * 100) || 0}%)
                  </span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Évaluations Totales
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Database className="h-6 w-6 text-spirit-purple mr-2" />
                  <span className="text-2xl font-bold">{adminStats.total_assessments}</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Score Moyen Global
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <BarChart className="h-6 w-6 text-spirit-purple mr-2" />
                  <span className="text-2xl font-bold">{adminStats.avg_overall_score}%</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Distribution des utilisateurs</CardTitle>
                <CardDescription>Utilisateurs actifs vs inactifs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart
                      data={[
                        { name: 'Actifs', value: adminStats.active_users },
                        { name: 'Inactifs', value: adminStats.total_users - adminStats.active_users }
                      ]}
                      margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#9b87f5" name="Utilisateurs" radius={[8, 8, 0, 0]} />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Statistiques d'évaluation</CardTitle>
                <CardDescription>Évaluations par utilisateur actif</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart
                      data={[
                        { 
                          name: 'Moy. évaluations / utilisateur', 
                          value: adminStats.active_users > 0 
                            ? Math.round((adminStats.total_assessments / adminStats.active_users) * 10) / 10 
                            : 0 
                        }
                      ]}
                      margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 'dataMax + 1']} />
                      <Tooltip />
                      <Bar dataKey="value" fill="#9b87f5" name="Moyenne" radius={[8, 8, 0, 0]} />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8">
            <Button 
              onClick={() => navigate('/admin/statistics')}
              variant="outline"
              className="flex items-center gap-2"
            >
              <BarChart className="h-4 w-4" />
              Voir les statistiques détaillées
            </Button>
          </div>
        </main>
      </div>
    );
  }

  // SECTION UTILISATEUR: Affichage des données personnelles
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Bienvenue, {user?.email}</h1>
            <p className="text-gray-600 mt-1">Suivez votre évolution spirituelle et personnelle</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={() => navigate('/assessment/history')} 
              variant="outline"
              className="flex items-center gap-2"
            >
              <History className="h-4 w-4" />
              Historique
            </Button>
            <Button onClick={handleStartAssessment} className="bg-spirit-purple hover:bg-spirit-deep-purple">
              <PlusCircle className="mr-2 h-4 w-4" />
              Nouvelle Évaluation
            </Button>
          </div>
        </div>

        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Évaluations Complétées
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <CalendarDays className="h-6 w-6 text-spirit-purple mr-2" />
                  <span className="text-2xl font-bold">{stats.totalAssessments}</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Score Actuel
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <LineChartIcon className="h-6 w-6 text-spirit-purple mr-2" />
                  <span className="text-2xl font-bold">{stats.latestScore}%</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Évolution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <TrendingUp className={`h-6 w-6 mr-2 ${stats.improvement >= 0 ? 'text-green-500' : 'text-red-500'}`} />
                  <span className={`text-2xl font-bold ${stats.improvement >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {stats.improvement > 0 ? '+' : ''}{stats.improvement}%
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {userAssessments.length === 0 && (
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <Lightbulb className="mx-auto h-12 w-12 text-spirit-purple opacity-75" />
                <h3 className="mt-4 text-lg font-semibold">Commencez Votre Parcours</h3>
                <p className="mt-2 text-sm text-gray-600 max-w-sm mx-auto">
                  Faites votre première évaluation pour commencer à suivre votre évolution spirituelle et personnelle.
                </p>
                <Button onClick={handleStartAssessment} className="mt-6 bg-spirit-purple hover:bg-spirit-deep-purple">
                  Commencer l'Évaluation
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {latestAssessment && (
          <>
            <Card className="mb-8">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Résultats de la Dernière Évaluation</CardTitle>
                  <CardDescription>
                    Complétée le {format(new Date(latestAssessment.assessment_date), 'dd MMMM yyyy', { locale: fr })}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" onClick={handlePrint} title="Imprimer le rapport">
                    <Printer className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={handleDownload} title="Télécharger les données">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="w-40 h-40 rounded-full bg-gray-100 flex items-center justify-center border-4 border-spirit-purple">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-spirit-deep-purple">{latestAssessment.overall_score}%</div>
                      <div className="text-sm text-gray-600">Score Global</div>
                    </div>
                  </div>
                  <div className="flex-1 space-y-4">
                    <div>
                      <ProgressBar 
                        value={latestAssessment.psychology_score || 0} 
                        label="Psychologie" 
                        showValue={true}
                        size="md"
                      />
                    </div>
                    <div>
                      <ProgressBar 
                        value={latestAssessment.health_score || 0} 
                        label="Santé" 
                        showValue={true}
                        size="md"
                      />
                    </div>
                    <div>
                      <ProgressBar 
                        value={latestAssessment.spirituality_score || 0} 
                        label="Spiritualité" 
                        showValue={true}
                        size="md"
                      />
                    </div>
                    <div>
                      <ProgressBar 
                        value={latestAssessment.relationships_score || 0} 
                        label="Relations" 
                        showValue={true}
                        size="md"
                      />
                    </div>
                    <div>
                      <ProgressBar 
                        value={latestAssessment.finances_score || 0} 
                        label="Finances" 
                        showValue={true}
                        size="md"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Vue Comparative par Catégorie</CardTitle>
                <CardDescription>Répartition de vos scores actuels</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart 
                      data={barChartData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip formatter={(value) => [`${value}%`, 'Score']} />
                      <Bar dataKey="value" fill="#9b87f5" name="Score (%)" radius={[4, 4, 0, 0]} />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <h2 className="text-2xl font-semibold mb-4">Analyse Détaillée</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <CategoryCard 
                category="psychology"
                title="Psychologie"
                score={latestAssessment.psychology_score || 0}
                description="Santé mentale, gestion du stress et bien-être émotionnel."
                icon={<Brain size={24} />}
                advice="Concentrez-vous sur des pratiques de pleine conscience et des techniques de réduction du stress."
              />
              <CategoryCard 
                category="health"
                title="Santé"
                score={latestAssessment.health_score || 0}
                description="Bien-être physique, nutrition, exercice et repos."
                icon={<Heart size={24} />}
                advice="Maintenez une alimentation équilibrée et une routine d'exercice régulière."
              />
              <CategoryCard 
                category="spirituality"
                title="Spiritualité"
                score={latestAssessment.spirituality_score || 0}
                description="Connexion à votre but, vos valeurs et le sens de la vie."
                icon={<Lightbulb size={24} />}
                advice="Pratiquez la méditation, la réflexion ou la prière quotidiennement."
              />
              <CategoryCard 
                category="relationships"
                title="Relations"
                score={latestAssessment.relationships_score || 0}
                description="Qualité des connexions personnelles et des interactions sociales."
                icon={<Users size={24} />}
                advice="Consacrez du temps à entretenir des relations importantes."
              />
              <CategoryCard 
                category="finances"
                title="Finances"
                score={latestAssessment.finances_score || 0}
                description="Santé financière, planification et stabilité."
                icon={<Coins size={24} />}
                advice="Créez un budget et mettez régulièrement de l'argent de côté."
              />
            </div>
          </>
        )}

        {userAssessments.length > 1 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Évolution dans le Temps</CardTitle>
              <CardDescription>Suivez l'évolution de vos scores</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 w-full">
                <ChartContainer 
                  className="w-full" 
                  config={{
                    overall: { color: "#9b87f5" },
                    psychology: { color: "#FF8042" },
                    health: { color: "#0088FE" },
                    spirituality: { color: "#00C49F" },
                    relationships: { color: "#FFBB28" },
                    finances: { color: "#FF5733" }
                  }}
                >
                  <LineChart
                    data={lineChartData}
                    margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, 100]} />
                    <ChartTooltip 
                      content={<ChartTooltipContent />} 
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      name="Global"
                      dataKey="overall"
                      stroke="#9b87f5"
                      strokeWidth={3}
                      dot={{ r: 6 }}
                      activeDot={{ r: 8 }}
                    />
                    <Line type="monotone" name="Psychologie" dataKey="psychology" stroke="#FF8042" />
                    <Line type="monotone" name="Santé" dataKey="health" stroke="#0088FE" />
                    <Line type="monotone" name="Spiritualité" dataKey="spirituality" stroke="#00C49F" />
                    <Line type="monotone" name="Relations" dataKey="relationships" stroke="#FFBB28" />
                    <Line type="monotone" name="Finances" dataKey="finances" stroke="#FF5733" />
                  </LineChart>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
