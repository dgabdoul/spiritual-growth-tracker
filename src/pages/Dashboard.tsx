
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useAssessment, Category } from '@/contexts/AssessmentContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/Header';
import CategoryCard from '@/components/CategoryCard';
import ProgressBar from '@/components/ProgressBar';
import { Brain, Heart, Lightbulb, Users, Coins, PlusCircle, CalendarDays, TrendingUp, LineChart as LineChartIcon } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { assessmentHistory, startNewAssessment } = useAssessment();
  const navigate = useNavigate();

  // Start a new assessment
  const handleStartAssessment = () => {
    startNewAssessment();
    navigate('/assessment');
  };

  // Get the latest assessment if available
  const latestAssessment = assessmentHistory.length > 0 
    ? assessmentHistory[assessmentHistory.length - 1] 
    : null;

  // Prepare data for the line chart
  const lineChartData = assessmentHistory.map(assessment => {
    const date = new Date(assessment.date).toLocaleDateString('fr-FR');
    return {
      date,
      psychology: assessment.scores.psychology || 0,
      health: assessment.scores.health || 0,
      spirituality: assessment.scores.spirituality || 0,
      relationships: assessment.scores.relationships || 0,
      finances: assessment.scores.finances || 0,
      overall: assessment.overallScore || 0,
    };
  });

  // Prepare data for the bar chart
  const barChartData = latestAssessment ? [
    { name: 'Psychologie', value: latestAssessment.scores.psychology || 0 },
    { name: 'Santé', value: latestAssessment.scores.health || 0 },
    { name: 'Spiritualité', value: latestAssessment.scores.spirituality || 0 },
    { name: 'Relations', value: latestAssessment.scores.relationships || 0 },
    { name: 'Finances', value: latestAssessment.scores.finances || 0 },
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

  // Get stats from assessment history
  const getStats = () => {
    if (assessmentHistory.length === 0) return null;

    const totalAssessments = assessmentHistory.length;
    const latestScore = latestAssessment?.overallScore || 0;
    
    // Calculate improvement if we have more than one assessment
    let improvement = 0;
    if (assessmentHistory.length > 1) {
      const previousAssessment = assessmentHistory[assessmentHistory.length - 2];
      improvement = latestScore - (previousAssessment.overallScore || 0);
    }

    return {
      totalAssessments,
      latestScore,
      improvement
    };
  };

  const stats = getStats();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Welcome and Quick Actions */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Bienvenue, {user?.email}</h1>
            <p className="text-gray-600 mt-1">Suivez votre évolution spirituelle et personnelle</p>
          </div>
          <Button onClick={handleStartAssessment} className="bg-spirit-purple hover:bg-spirit-deep-purple">
            <PlusCircle className="mr-2 h-4 w-4" />
            Nouvelle Évaluation
          </Button>
        </div>

        {/* Statistics overview */}
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

        {/* No Assessments Yet */}
        {assessmentHistory.length === 0 && (
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

        {/* Latest Assessment Results */}
        {latestAssessment && (
          <>
            {/* Overall Score */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Résultats de la Dernière Évaluation</CardTitle>
                <CardDescription>
                  Complétée le {new Date(latestAssessment.date).toLocaleDateString('fr-FR')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="w-40 h-40 rounded-full bg-gray-100 flex items-center justify-center border-4 border-spirit-purple">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-spirit-deep-purple">{latestAssessment.overallScore}%</div>
                      <div className="text-sm text-gray-600">Score Global</div>
                    </div>
                  </div>
                  <div className="flex-1 space-y-4">
                    {Object.entries(latestAssessment.scores).map(([category, score]) => (
                      <div key={category}>
                        <ProgressBar 
                          value={score || 0} 
                          label={category === 'psychology' ? 'Psychologie' : 
                                category === 'health' ? 'Santé' :
                                category === 'spirituality' ? 'Spiritualité' :
                                category === 'relationships' ? 'Relations' : 'Finances'} 
                          showValue={true}
                          size="md"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Bar Chart */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Vue Comparative par Catégorie</CardTitle>
                <CardDescription>Répartition de vos scores actuels</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      data={barChartData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip formatter={(value) => [`${value}%`, 'Score']} />
                      <Bar dataKey="value" fill="#9b87f5" name="Score (%)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Category Cards */}
            <h2 className="text-2xl font-semibold mb-4">Analyse Détaillée</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <CategoryCard 
                category="psychology"
                title="Psychologie"
                score={latestAssessment.scores.psychology || 0}
                description="Santé mentale, gestion du stress et bien-être émotionnel."
                icon={<Brain size={24} />}
                advice="Concentrez-vous sur des pratiques de pleine conscience et des techniques de réduction du stress."
              />
              <CategoryCard 
                category="health"
                title="Santé"
                score={latestAssessment.scores.health || 0}
                description="Bien-être physique, nutrition, exercice et repos."
                icon={<Heart size={24} />}
                advice="Maintenez une alimentation équilibrée et une routine d'exercice régulière."
              />
              <CategoryCard 
                category="spirituality"
                title="Spiritualité"
                score={latestAssessment.scores.spirituality || 0}
                description="Connexion à votre but, vos valeurs et le sens de la vie."
                icon={<Lightbulb size={24} />}
                advice="Pratiquez la méditation, la réflexion ou la prière quotidiennement."
              />
              <CategoryCard 
                category="relationships"
                title="Relations"
                score={latestAssessment.scores.relationships || 0}
                description="Qualité des connexions personnelles et des interactions sociales."
                icon={<Users size={24} />}
                advice="Consacrez du temps à entretenir des relations importantes."
              />
              <CategoryCard 
                category="finances"
                title="Finances"
                score={latestAssessment.scores.finances || 0}
                description="Santé financière, planification et stabilité."
                icon={<Coins size={24} />}
                advice="Créez un budget et mettez régulièrement de l'argent de côté."
              />
            </div>
          </>
        )}

        {/* Progress Chart */}
        {assessmentHistory.length > 1 && (
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
