
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { TrendingUp, Calendar, Users } from 'lucide-react';
import ProgressionChart from '@/components/ProgressionChart';
import KpiSummaryCard from '@/components/kpi-dashboard/KpiSummaryCard';
import CategoryPieChart from '@/components/kpi-dashboard/CategoryPieChart';
import CategoryAnalysisSection from '@/components/kpi-dashboard/CategoryAnalysisSection';
import { 
  Assessment, 
  calculateAverageScores, 
  getProgressionData, 
  getCategoryData 
} from '@/utils/assessmentUtils';

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
          setAverageScores(calculateAverageScores(data));
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
              <KpiSummaryCard
                title="Score Global"
                value={`${averageScores.overall}%`}
                description="Score moyen sur toutes les évaluations"
                icon={<TrendingUp className="h-5 w-5 text-spirit-purple" />}
              />

              {/* Most Recent Date Card */}
              <KpiSummaryCard
                title="Dernière Évaluation"
                value={
                  assessments.length > 0 
                    ? format(new Date(assessments[0].assessment_date), 'dd MMMM yyyy', { locale: fr })
                    : '-'
                }
                description="Date de votre dernière évaluation"
                icon={<Calendar className="h-5 w-5 text-spirit-purple" />}
              />

              {/* Total Assessments Card */}
              <KpiSummaryCard
                title="Nombre d'évaluations"
                value={assessments.length}
                description="Total des évaluations effectuées"
                icon={<Users className="h-5 w-5 text-spirit-purple" />}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="md:col-span-2">
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="text-lg font-semibold mb-4">Progression au fil du temps</h3>
                    <p className="text-sm text-gray-500 mb-4">Évolution de vos scores sur toutes les évaluations</p>
                    <ProgressionChart data={assessments} height={350} />
                  </CardContent>
                </Card>
              </div>

              <CategoryPieChart data={getCategoryData(assessments)} />
            </div>

            <CategoryAnalysisSection 
              assessments={assessments}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              averageScores={averageScores}
            />
          </>
        )}
      </main>
    </div>
  );
};

export default KpiDashboard;
