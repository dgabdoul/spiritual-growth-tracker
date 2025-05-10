
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Header from '@/components/Header';
import { Brain, Heart, Lightbulb, Users, Coins, ChevronRight, ArrowLeft, Loader2 } from 'lucide-react';
import { useAssessment } from '@/contexts/AssessmentContext';
import PageTransition from '@/components/PageTransition';
import { fetchRecommendation, CategoryRecommendation } from '@/services/recommendationService';

const RecommendationPage: React.FC = () => {
  const navigate = useNavigate();
  const { assessmentHistory } = useAssessment();
  const [recommendations, setRecommendations] = useState<CategoryRecommendation[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Get the latest assessment
  const latestAssessment = assessmentHistory.length > 0 ? assessmentHistory[assessmentHistory.length - 1] : null;

  useEffect(() => {
    if (!latestAssessment) {
      navigate('/assessment');
      return;
    }

    const getRecommendations = async () => {
      try {
        setLoading(true);
        const data = await fetchRecommendation(latestAssessment);
        setRecommendations(data);
      } catch (err) {
        setError('Erreur lors de la génération des recommandations.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getRecommendations();
  }, [latestAssessment, navigate]);

  // Category icons
  const categoryIcons: Record<string, React.ReactNode> = {
    psychology: <Brain className="h-6 w-6" />,
    health: <Heart className="h-6 w-6" />,
    spirituality: <Lightbulb className="h-6 w-6" />,
    relationships: <Users className="h-6 w-6" />,
    finances: <Coins className="h-6 w-6" />
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-4xl mx-auto py-10 px-4 sm:px-6">
          <div className="mb-6">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/assessment/results')}
              className="mb-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour aux résultats
            </Button>
            
            <h1 className="text-3xl font-bold text-center mb-2">Recommandations personnalisées</h1>
            <p className="text-center text-gray-600 mb-10">
              Basées sur votre évaluation du {latestAssessment && new Date(latestAssessment.date).toLocaleDateString()}
            </p>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="h-12 w-12 text-spirit-purple animate-spin mb-4" />
              <p className="text-gray-600">Génération des recommandations en cours...</p>
            </div>
          ) : error ? (
            <Alert variant="destructive" className="mb-6">
              <AlertTitle>Erreur</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : recommendations && recommendations.length > 0 ? (
            <div className="space-y-8">
              {recommendations.map((rec) => (
                <Card key={rec.category} className="overflow-hidden">
                  <CardHeader className="bg-spirit-soft-purple flex flex-row gap-4 items-center p-6">
                    <div className="bg-spirit-purple text-white p-3 rounded-full">
                      {categoryIcons[rec.category]}
                    </div>
                    <div>
                      <CardTitle className="text-xl">{rec.title}</CardTitle>
                      <CardDescription>
                        Score: {latestAssessment?.scores[rec.category]}%
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-medium text-lg mb-2">Conseil</h3>
                        <p className="text-gray-700">{rec.advice}</p>
                      </div>
                      
                      {rec.quranVerse && (
                        <div className="bg-spirit-soft-purple/30 p-4 rounded-lg">
                          <h3 className="font-medium text-lg mb-2">Verset du Coran</h3>
                          <p className="text-gray-700 italic">{rec.quranVerse}</p>
                        </div>
                      )}
                      
                      {rec.hadith && (
                        <div className="bg-spirit-soft-purple/20 p-4 rounded-lg">
                          <h3 className="font-medium text-lg mb-2">Hadith</h3>
                          <p className="text-gray-700 italic">{rec.hadith}</p>
                        </div>
                      )}
                      
                      <div>
                        <h3 className="font-medium text-lg mb-3">Actions recommandées</h3>
                        <ul className="space-y-2">
                          {rec.actions.map((action, idx) => (
                            <li key={idx} className="flex items-start">
                              <span className="bg-spirit-purple text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5">
                                {idx + 1}
                              </span>
                              <span className="text-gray-700">{action}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500">Aucune recommandation disponible. Veuillez compléter une évaluation.</p>
              <Button 
                onClick={() => navigate('/assessment')}
                className="mt-4 bg-spirit-purple hover:bg-spirit-deep-purple"
              >
                Commencer une évaluation
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => navigate('/dashboard')}
              className="bg-spirit-purple hover:bg-spirit-deep-purple"
            >
              Tableau de bord
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => navigate('/assessment')}
            >
              Nouvelle évaluation
            </Button>
          </div>
        </main>
      </div>
    </PageTransition>
  );
};

export default RecommendationPage;
