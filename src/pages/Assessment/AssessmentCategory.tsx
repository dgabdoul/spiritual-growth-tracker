import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import Header from '@/components/Header';
import { ArrowLeft, ArrowRight, Brain, Heart, Lightbulb, Users, Coins, HelpCircle } from 'lucide-react';
import { useAssessment, Category, questions } from '@/contexts/assessment';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import RatingInput from '@/components/RatingInput';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const categoryOrder: Category[] = [
  'psychology',
  'health',
  'spirituality',
  'relationships',
  'finances'
];

const categoryIcons: Record<Category, React.ReactNode> = {
  psychology: <Brain className="h-6 w-6" />,
  health: <Heart className="h-6 w-6" />,
  spirituality: <Lightbulb className="h-6 w-6" />,
  relationships: <Users className="h-6 w-6" />,
  finances: <Coins className="h-6 w-6" />
};

const categoryTitles: Record<Category, string> = {
  psychology: 'Psychologie',
  health: 'Santé',
  spirituality: 'Spiritualité',
  relationships: 'Relations',
  finances: 'Finances'
};

const AssessmentCategory: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const { answers, setAnswer, saveAssessment } = useAssessment();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentCategory = useMemo(() => {
    if (category && categoryOrder.includes(category as Category)) {
      return category as Category;
    }
    return categoryOrder[0];
  }, [category]);

  const currentIndex = categoryOrder.indexOf(currentCategory);
  const progressValue = ((currentIndex + 1) / categoryOrder.length) * 100;

  const categoryQuestions = useMemo(() => {
    return questions.filter(q => q.category === currentCategory);
  }, [currentCategory]);

  const navigateToNextCategory = async () => {
    if (currentIndex < categoryOrder.length - 1) {
      const nextCategory = categoryOrder[currentIndex + 1];
      navigate(`/assessment/${nextCategory}`);
    } else {
      setIsSubmitting(true);
      
      try {
        const scores = {
          psychology: 0,
          health: 0,
          spirituality: 0,
          relationships: 0,
          finances: 0
        };
        
        let totalQuestions = {
          psychology: 0,
          health: 0,
          spirituality: 0,
          relationships: 0,
          finances: 0
        };
        
        Object.entries(answers).forEach(([questionId, rating]) => {
          const question = questions.find(q => q.id === questionId);
          if (question && question.category) {
            scores[question.category] += rating;
            totalQuestions[question.category]++;
          }
        });
        
        const finalScores = {
          psychology_score: Math.round((scores.psychology / (totalQuestions.psychology * 5)) * 100),
          health_score: Math.round((scores.health / (totalQuestions.health * 5)) * 100),
          spirituality_score: Math.round((scores.spirituality / (totalQuestions.spirituality * 5)) * 100),
          relationships_score: Math.round((scores.relationships / (totalQuestions.relationships * 5)) * 100),
          finances_score: Math.round((scores.finances / (totalQuestions.finances * 5)) * 100)
        };
        
        const overallScore = Math.round(
          (finalScores.psychology_score + 
           finalScores.health_score + 
           finalScores.spirituality_score + 
           finalScores.relationships_score + 
           finalScores.finances_score) / 5
        );
        
        if (user) {
          const { error } = await supabase
            .from('user_assessments')
            .insert({
              user_id: user.id,
              ...finalScores,
              overall_score: overallScore
            });
            
          if (error) {
            throw error;
          }
          
          toast.success("Évaluation enregistrée avec succès");
        }
        
        saveAssessment();
        navigate('/assessment/results');
      } catch (error) {
        console.error('Erreur lors de la sauvegarde de l\'évaluation:', error);
        toast.error("Une erreur est survenue lors de la sauvegarde de l'évaluation");
        setIsSubmitting(false);
      }
    }
  };

  const navigateToPreviousCategory = () => {
    if (currentIndex > 0) {
      const prevCategory = categoryOrder[currentIndex - 1];
      navigate(`/assessment/${prevCategory}`);
    } else {
      navigate('/assessment');
    }
  };

  const handleRatingChange = (questionId: string, value: number) => {
    setAnswer(questionId, value);
  };

  const isLastCategory = currentIndex === categoryOrder.length - 1;
  const nextButtonLabel = isLastCategory ? 'Terminer l\'évaluation' : 'Suivant';

  const ratingLegend = [
    { value: 1, label: "Délaissé (très faible)" },
    { value: 2, label: "Paresse / Reprise à zéro" },
    { value: 3, label: "Combat intérieur (efforts irréguliers)" },
    { value: 4, label: "Effort constant" },
    { value: 5, label: "Alhamdoulillah (excellent)" }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="max-w-2xl mx-auto py-10 px-4 sm:px-6">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Étape {currentIndex + 1} sur {categoryOrder.length}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">{progressValue.toFixed(0)}% complété</span>
          </div>
          <Progress value={progressValue} className="h-2 bg-gray-100 dark:bg-gray-800" />
        </div>

        <Card className="shadow-md border-0 overflow-hidden">
          <CardHeader className="border-b bg-white dark:bg-gray-800 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="text-spirit-purple p-2 bg-spirit-soft-purple dark:bg-purple-900/30 rounded-full">
                {categoryIcons[currentCategory]}
              </div>
              <CardTitle className="text-xl font-semibold">
                {categoryTitles[currentCategory]}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6 bg-white dark:bg-gray-800">
            <div className="mb-6 bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg text-sm border border-gray-100 dark:border-gray-700">
              <div className="font-medium mb-2 flex items-center gap-1.5">
                <span>Système de notation</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-5 w-5 rounded-full">
                        <HelpCircle className="h-3 w-3" />
                        <span className="sr-only">Aide sur la notation</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="w-64 p-3 bg-black/90 text-white border-none">
                      <div className="space-y-1 text-xs">
                        {ratingLegend.map(rating => (
                          <div key={rating.value} className="flex items-center gap-1">
                            <span className="font-bold">{rating.value}:</span> {rating.label}
                          </div>
                        ))}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>Délaissé (1)</span>
                <span>Excellent (5)</span>
              </div>
            </div>

            <div className="space-y-10">
              {categoryQuestions.map((question) => (
                <div key={question.id} className="animate-fadeIn">
                  <h3 className="text-base font-medium mb-4 text-gray-800 dark:text-gray-200">{question.text}</h3>
                  <RatingInput
                    value={answers[question.id] || 0}
                    onChange={(value) => handleRatingChange(question.id, value)}
                    max={5}
                  />
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between pt-4 p-6 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-800">
            <Button
              variant="outline"
              onClick={navigateToPreviousCategory}
              className="flex items-center gap-2 border-gray-200 dark:border-gray-700 dark:bg-transparent dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <ArrowLeft size={16} />
              Précédent
            </Button>
            <Button
              onClick={navigateToNextCategory}
              className="bg-spirit-purple hover:bg-spirit-deep-purple flex items-center gap-2 shadow-sm"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Enregistrement..." : nextButtonLabel}
              {!isSubmitting && <ArrowRight size={16} />}
            </Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
};

export default AssessmentCategory;
