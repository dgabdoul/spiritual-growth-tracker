import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, Heart, Lightbulb, Users, Coins, TrendingUp, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent
} from '@/components/ui/chart';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Assessment {
  id: string;
  assessment_date: string;
  psychology_score: number;
  health_score: number;
  spirituality_score: number;
  relationships_score: number;
  finances_score: number;
  overall_score: number;
}

const KpiDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('overall');
  const [averageScores, setAverageScores] = useState({
    psychology: 0,
    health: 0,
    spirituality: 0,
    relationships: 0,
    finances: 0,
    overall: 0
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchAssessments = async () => {
      try {
        const { data, error } = await supabase
          .from('user_assessments')
          .select('*')
          .eq('user_id', user.id)
          .order('assessment_date', { ascending: false });

        if (error) throw error;
        if (data) {
          setAssessments(data);
          calculateAverageScores(data);
        }
      } catch (error) {
        console.error('Error fetching assessments:', error);
        toast({
          variant: "destructive",
          title: "Erreur de chargement",
          description: "Impossible de charger vos évaluations.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAssessments();
  }, [user, navigate]);

  const calculateAverageScores = (data: Assessment[]) => {
    if (data.length === 0) return;
    
    const sums = data.reduce((acc, assessment) => {
      return {
        psychology: acc.psychology + assessment.psychology_score,
        health: acc.health + assessment.health_score,
        spirituality: acc.spirituality + assessment.spirituality_score,
        relationships: acc.relationships + assessment.relationships_score,
        finances: acc.finances + assessment.finances_score,
        overall: acc.overall + assessment.overall_score
      };
    }, { psychology: 0, health: 0, spirituality: 0, relationships: 0, finances: 0, overall: 0 });

    setAverageScores({
      psychology: Math.round(sums.psychology / data.length),
      health: Math.round(sums.health / data.length),
      spirituality: Math.round(sums.spirituality / data.length),
      relationships: Math.round(sums.relationships / data.length),
      finances: Math.round(sums.finances / data.length),
      overall: Math.round(sums.overall / data.length)
    });
  };

  const getProgressionData = () => {
    return assessments.map(item => ({
      date: format(new Date(item.assessment_date), 'dd/MM/yy', { locale: fr }),
      psychologie: item.psychology_score,
      santé: item.health_score,
      spiritualité: item.spirituality_score,
      relations: item.relationships_score,
      finances: item.finances_score,
      global: item.overall_score
    })).reverse();
  };

  const getCategoryData = () => {
    if (assessments.length === 0) return [];
    
    const latest = assessments[0];
    return [
      { name: 'Psychologie', value: latest.psychology_score, color: '#8884d8' },
      { name: 'Santé', value: latest.health_score, color: '#82ca9d' },
      { name: 'Spiritualité', value: latest.spirituality_score, color: '#ffc658' },
      { name: 'Relations', value: latest.relationships_score, color: '#a4de6c' },
      { name: 'Finances', value: latest.finances_score, color: '#d0ed57' },
    ];
  };

  const getTrendData = () => {
    if (assessments.length <= 1) return [];
    
    const sorted = [...assessments].sort((a, b) => 
      new Date(a.assessment_date).getTime() - new Date(b.assessment_date).getTime()
    );
    
    return sorted.map((item, index) => {
      const date = format(new Date(item.assessment_date), 'dd/MM/yy', { locale: fr });
      
      switch (selectedCategory) {
        case 'psychology':
          return { date, score: item.psychology_score };
        case 'health':
          return { date, score: item.health_score };
        case 'spirituality':
          return { date, score: item.spirituality_score };
        case 'relationships':
          return { date, score: item.relationships_score };
        case 'finances':
          return { date, score: item.finances_score };
        default:
          return { date, score: item.overall_score };
      }
    });
  };

  const getCategoryColor = (category: string): string => {
    switch (category) {
      case 'psychology': return '#8884d8';
      case 'health': return '#82ca9d';
      case 'spirituality': return '#ffc658';
      case 'relationships': return '#a4de6c';
      case 'finances': return '#d0ed57';
      default: return '#9b87f5';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'psychology': return <Brain className="h-6 w-6" />;
      case 'health': return <Heart className="h-6 w-6" />;
      case 'spirituality': return <Lightbulb className="h-6 w-6" />;
      case 'relationships': return <Users className="h-6 w-6" />;
      case 'finances': return <Coins className="h-6 w-6" />;
      default: return <TrendingUp className="h-6 w-6" />;
    }
  };

  const getCategoryTitle = (category: string): string => {
    switch (category) {
      case 'psychology': return 'Psychologie';
      case 'health': return 'Santé';
      case 'spirituality': return 'Spiritualité';
      case 'relationships': return 'Relations';
      case 'finances': return 'Finances';
      default: return 'Score Global';
    }
  };

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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Tableau de bord des KPIs</h1>
          <Button 
            variant="outline" 
            onClick={() => navigate('/assessment')}
          >
            Nouvelle évaluation
          </Button>
        </div>

        {assessments.length === 0 ? (
          <Card className="text-center py-16">
            <CardContent>
              <h3 className="text-xl font-semibold mb-4">Aucune évaluation trouvée</h3>
              <p className="text-gray-500 mb-6">Vous n'avez pas encore réalisé d'évaluation pour visualiser vos KPIs.</p>
              <Button onClick={() => navigate('/assessment')}>
                Commencer une évaluation
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {/* Overall Score Card */}
              <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">Score Global</CardTitle>
                    <div className="bg-spirit-purple/10 p-2 rounded-full">
                      <TrendingUp className="h-5 w-5 text-spirit-purple" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{averageScores.overall}%</div>
                  <p className="text-sm text-gray-500 mt-1">Score moyen sur toutes les évaluations</p>
                </CardContent>
              </Card>

              {/* Most Recent Date Card */}
              <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">Dernière Évaluation</CardTitle>
                    <div className="bg-spirit-purple/10 p-2 rounded-full">
                      <Calendar className="h-5 w-5 text-spirit-purple" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-medium">
                    {assessments.length > 0 
                      ? format(new Date(assessments[0].assessment_date), 'dd MMMM yyyy', { locale: fr })
                      : '-'}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Date de votre dernière évaluation</p>
                </CardContent>
              </Card>

              {/* Total Assessments Card */}
              <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">Nombre d'évaluations</CardTitle>
                    <div className="bg-spirit-purple/10 p-2 rounded-full">
                      <Users className="h-5 w-5 text-spirit-purple" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{assessments.length}</div>
                  <p className="text-sm text-gray-500 mt-1">Total des évaluations effectuées</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Progression au fil du temps</CardTitle>
                  <CardDescription>Évolution de vos scores sur toutes les évaluations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[350px]">
                    <ChartContainer
                      config={{
                        global: { color: '#9b87f5' },
                        psychologie: { color: '#8884d8' },
                        santé: { color: '#82ca9d' },
                        spiritualité: { color: '#ffc658' },
                        relations: { color: '#a4de6c' },
                        finances: { color: '#d0ed57' },
                      }}
                    >
                      <LineChart data={getProgressionData()}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis domain={[0, 100]} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <ChartLegend content={<ChartLegendContent />} />
                        <Line type="monotone" dataKey="global" stroke="#9b87f5" activeDot={{ r: 8 }} strokeWidth={2} />
                        <Line type="monotone" dataKey="psychologie" stroke="#8884d8" strokeWidth={1} />
                        <Line type="monotone" dataKey="santé" stroke="#82ca9d" strokeWidth={1} />
                        <Line type="monotone" dataKey="spiritualité" stroke="#ffc658" strokeWidth={1} />
                        <Line type="monotone" dataKey="relations" stroke="#a4de6c" strokeWidth={1} />
                        <Line type="monotone" dataKey="finances" stroke="#d0ed57" strokeWidth={1} />
                      </LineChart>
                    </ChartContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Répartition par catégorie</CardTitle>
                  <CardDescription>Dernière évaluation</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={getCategoryData()}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, value }) => `${name}: ${value}%`}
                        >
                          {getCategoryData().map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => `${value}%`} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Analyse par catégorie</CardTitle>
                <CardDescription>Sélectionnez une catégorie pour voir son évolution</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="overall" value={selectedCategory} onValueChange={setSelectedCategory} className="mb-6">
                  <TabsList className="grid grid-cols-3 md:grid-cols-6 gap-2">
                    <TabsTrigger value="overall" className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      <span className="hidden md:inline">Global</span>
                    </TabsTrigger>
                    <TabsTrigger value="psychology" className="flex items-center gap-2">
                      <Brain className="h-4 w-4" />
                      <span className="hidden md:inline">Psychologie</span>
                    </TabsTrigger>
                    <TabsTrigger value="health" className="flex items-center gap-2">
                      <Heart className="h-4 w-4" />
                      <span className="hidden md:inline">Santé</span>
                    </TabsTrigger>
                    <TabsTrigger value="spirituality" className="flex items-center gap-2">
                      <Lightbulb className="h-4 w-4" />
                      <span className="hidden md:inline">Spiritualité</span>
                    </TabsTrigger>
                    <TabsTrigger value="relationships" className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span className="hidden md:inline">Relations</span>
                    </TabsTrigger>
                    <TabsTrigger value="finances" className="flex items-center gap-2">
                      <Coins className="h-4 w-4" />
                      <span className="hidden md:inline">Finances</span>
                    </TabsTrigger>
                  </TabsList>
                </Tabs>

                <div className="flex flex-col md:flex-row gap-6">
                  <Card className="w-full md:w-1/3">
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-3">
                        <div className="bg-spirit-purple/10 p-2 rounded-full">
                          {getCategoryIcon(selectedCategory)}
                        </div>
                        <div>
                          <CardTitle className="text-lg">{getCategoryTitle(selectedCategory)}</CardTitle>
                          <CardDescription>Tendance et moyenne</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col gap-6">
                        <div>
                          <span className="text-sm text-gray-500">Score moyen</span>
                          <div className="text-3xl font-bold">
                            {(selectedCategory === 'overall' 
                              ? averageScores.overall 
                              : averageScores[selectedCategory as keyof typeof averageScores])}%
                          </div>
                        </div>

                        <div>
                          <span className="text-sm text-gray-500">Dernier score</span>
                          <div className="text-2xl font-medium">
                            {assessments.length > 0 ? (
                              selectedCategory === 'overall' 
                                ? assessments[0].overall_score
                                : assessments[0][`${selectedCategory}_score` as keyof Assessment]
                            ) : 0}%
                          </div>
                        </div>

                        <div>
                          <span className="text-sm text-gray-500">Progression</span>
                          <div className="text-xl font-medium">
                            {assessments.length > 1 ? (
                              <div className="flex items-center gap-2">
                                {(() => {
                                  const latest = selectedCategory === 'overall' 
                                    ? assessments[0].overall_score
                                    : assessments[0][`${selectedCategory}_score` as keyof Assessment];
                                  const previous = selectedCategory === 'overall' 
                                    ? assessments[1].overall_score
                                    : assessments[1][`${selectedCategory}_score` as keyof Assessment];
                                  const diff = Number(latest) - Number(previous);
                                  return (
                                    <>
                                      {diff > 0 ? (
                                        <TrendingUp className="text-green-600" />
                                      ) : diff < 0 ? (
                                        <TrendingUp className="text-red-600 rotate-180" />
                                      ) : (
                                        <Separator className="w-4 h-0.5" />
                                      )}
                                      <span className={diff > 0 ? 'text-green-600' : diff < 0 ? 'text-red-600' : ''}>
                                        {diff > 0 ? '+' : ''}{diff}%
                                      </span>
                                    </>
                                  );
                                })()}
                              </div>
                            ) : (
                              "Pas assez de données"
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="w-full md:w-2/3">
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={getTrendData()}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis domain={[0, 100]} />
                          <Tooltip formatter={(value) => `${value}%`} />
                          <Legend />
                          <Bar 
                            dataKey="score" 
                            name={getCategoryTitle(selectedCategory)} 
                            fill={getCategoryColor(selectedCategory)} 
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </main>
    </div>
  );
};

export default KpiDashboard;
