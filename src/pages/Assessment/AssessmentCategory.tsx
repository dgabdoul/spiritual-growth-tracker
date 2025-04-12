
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import Header from '@/components/Header';
import { ArrowLeft, ArrowRight, Brain, Heart, Lightbulb, Users, Coins, HelpCircle } from 'lucide-react';
import { useAssessment, Category, questions } from '@/contexts/AssessmentContext';
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Make sure category is valid
  const currentCategory = useMemo(() => {
    if (category && categoryOrder.includes(category as Category)) {
      return category as Category;
    }
    return categoryOrder[0];
  }, [category]);

  // Get category index for progress
  const currentIndex = categoryOrder.indexOf(currentCategory);
  const progressValue = ((currentIndex + 1) / categoryOrder.length) * 100;

  // Filter questions by category
  const categoryQuestions = useMemo(() => {
    return questions.filter(q => q.category === currentCategory);
  }, [currentCategory]);

  // Handle navigation
  const navigateToNextCategory = () => {
    if (currentIndex < categoryOrder.length - 1) {
      const nextCategory = categoryOrder[currentIndex + 1];
      navigate(`/assessment/${nextCategory}`);
    } else {
      setIsSubmitting(true);
      saveAssessment();
      navigate('/assessment/results');
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

  // Handle input changes
  const handleRatingChange = (questionId: string, value: number) => {
    setAnswer(questionId, value);
  };

  // Determine button label
  const isLastCategory = currentIndex === categoryOrder.length - 1;
  const nextButtonLabel = isLastCategory ? 'Terminer l\'évaluation' : 'Suivant';

  // Legend for ratings
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
              {nextButtonLabel}
              <ArrowRight size={16} />
            </Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
};

export default AssessmentCategory;
