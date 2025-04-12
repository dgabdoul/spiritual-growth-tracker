
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import Header from '@/components/Header';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useAssessment, Category, questions } from '@/contexts/AssessmentContext';
import RatingInput from '@/components/RatingInput';

const categoryOrder: Category[] = [
  'psychology',
  'health',
  'spirituality',
  'relationships',
  'finances'
];

const categoryIcons: Record<Category, React.ReactNode> = {
  psychology: '🧠',
  health: '❤️',
  spirituality: '✨',
  relationships: '👥',
  finances: '💰'
};

const categoryTitles: Record<Category, string> = {
  psychology: 'Mental Wellbeing',
  health: 'Physical Health',
  spirituality: 'Spiritual Growth',
  relationships: 'Social Connections',
  finances: 'Financial Wellness'
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
  const nextButtonLabel = isLastCategory ? 'Complete Assessment' : 'Next';

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-2xl mx-auto py-10 px-4 sm:px-6">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Step {currentIndex + 1} of {categoryOrder.length}
            </span>
            <span className="text-sm text-gray-500">{progressValue}% complete</span>
          </div>
          <Progress value={progressValue} className="h-2" />
        </div>

        <Card className="shadow">
          <CardHeader className="border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="text-3xl">{categoryIcons[currentCategory]}</div>
              <CardTitle className="text-xl">{categoryTitles[currentCategory]}</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-8">
              {categoryQuestions.map((question) => (
                <div key={question.id} className="animate-fadeIn">
                  <h3 className="text-lg font-medium mb-3">{question.text}</h3>
                  <RatingInput
                    value={answers[question.id] || 0}
                    onChange={(value) => handleRatingChange(question.id, value)}
                    max={5}
                  />
                  <div className="flex justify-between text-sm text-gray-500 mt-1">
                    <span>Strongly disagree</span>
                    <span>Strongly agree</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between pt-4 border-t border-gray-100">
            <Button
              variant="outline"
              onClick={navigateToPreviousCategory}
              className="flex items-center gap-2"
            >
              <ArrowLeft size={16} />
              Previous
            </Button>
            <Button
              onClick={navigateToNextCategory}
              className="bg-spirit-purple hover:bg-spirit-deep-purple flex items-center gap-2"
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
