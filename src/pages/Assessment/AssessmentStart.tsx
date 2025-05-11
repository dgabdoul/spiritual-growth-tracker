import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/Header';
import { Brain, Heart, Lightbulb, Users, Coins } from 'lucide-react';
import { useAssessment, questions } from '@/contexts/assessment';
import { useAuth } from '@/contexts/AuthContext';
import PageTransition from '@/components/PageTransition';

const AssessmentStart: React.FC = () => {
  const { startNewAssessment } = useAssessment();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Verify if user is logged in
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Count questions for each category
  const psychologyQuestions = questions.filter(q => q.category === 'psychology').length;
  const healthQuestions = questions.filter(q => q.category === 'health').length;
  const spiritualityQuestions = questions.filter(q => q.category === 'spirituality').length;
  const relationshipsQuestions = questions.filter(q => q.category === 'relationships').length;
  const financesQuestions = questions.filter(q => q.category === 'finances').length;

  const handleStart = () => {
    startNewAssessment();
    navigate('/assessment/psychology');
  };

  // Si pas d'utilisateur, retourner null pour que la redirection se fasse silencieusement
  if (!user) {
    return null;
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-4xl mx-auto py-10 px-4 sm:px-6">
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold text-gradient">Carnet de Suivi Spirituel</CardTitle>
              <CardDescription className="text-lg">
                Évaluez votre progression à travers 5 dimensions essentielles
              </CardDescription>
            </CardHeader>
            <CardContent className="py-6">
              <div className="text-center mb-8">
                <p className="text-gray-700">
                  Cette évaluation vous aidera à identifier vos forces et opportunités d'amélioration à travers cinq dimensions de bien-être. Notez chaque critère de 1 (très faible) à 5 (excellent).
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
                  <Brain className="text-spirit-purple h-10 w-10 mb-4" />
                  <h3 className="font-medium mb-1">Psychologie</h3>
                  <p className="text-gray-500 text-sm">{psychologyQuestions} critères</p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
                  <Heart className="text-spirit-purple h-10 w-10 mb-4" />
                  <h3 className="font-medium mb-1">Santé</h3>
                  <p className="text-gray-500 text-sm">{healthQuestions} critères</p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
                  <Lightbulb className="text-spirit-purple h-10 w-10 mb-4" />
                  <h3 className="font-medium mb-1">Spiritualité</h3>
                  <p className="text-gray-500 text-sm">{spiritualityQuestions} critères</p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
                  <Users className="text-spirit-purple h-10 w-10 mb-4" />
                  <h3 className="font-medium mb-1">Relations</h3>
                  <p className="text-gray-500 text-sm">{relationshipsQuestions} critères</p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
                  <Coins className="text-spirit-purple h-10 w-10 mb-4" />
                  <h3 className="font-medium mb-1">Finances</h3>
                  <p className="text-gray-500 text-sm">{financesQuestions} critères</p>
                </div>
              </div>

              <div className="bg-gray-100 p-4 rounded-md">
                <h4 className="font-medium mb-2 flex items-center">
                  <Lightbulb className="inline mr-2 h-5 w-5 text-amber-600" /> 
                  Légende de notation (1 à 5) :
                </h4>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li><strong>1</strong> = Délaissé (très faible)</li>
                  <li><strong>2</strong> = Paresse / Reprise à zéro</li>
                  <li><strong>3</strong> = Combat intérieur (efforts irréguliers)</li>
                  <li><strong>4</strong> = Effort constant</li>
                  <li><strong>5</strong> = Alhamdoulillah (excellent)</li>
                </ul>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center pb-6">
              <Button size="lg" className="bg-spirit-purple hover:bg-spirit-deep-purple" onClick={handleStart}>
                Commencer l'Évaluation
              </Button>
            </CardFooter>
          </Card>
        </main>
      </div>
    </PageTransition>
  );
};

export default AssessmentStart;
