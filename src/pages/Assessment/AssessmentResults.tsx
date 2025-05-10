
import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/Header';
import { Brain, Heart, Lightbulb, Users, Coins, ChevronRight } from 'lucide-react';
import { useAssessment, Category } from '@/contexts/AssessmentContext';
import ProgressBar from '@/components/ProgressBar';
import PageTransition from '@/components/PageTransition';

const AssessmentResults: React.FC = () => {
  const navigate = useNavigate();
  const { assessmentHistory, calculateCategoryScore, calculateOverallScore, getAdvice } = useAssessment();

  // Get the latest assessment
  const latestAssessment = useMemo(() => {
    return assessmentHistory.length > 0 ? assessmentHistory[assessmentHistory.length - 1] : null;
  }, [assessmentHistory]);

  // If no assessment completed, redirect to assessment start
  if (!latestAssessment) {
    navigate('/assessment');
    return null;
  }

  const overallScore = latestAssessment.overallScore;

  // Category icons
  const categoryIcons: Record<Category, React.ReactNode> = {
    psychology: <Brain className="h-6 w-6" />,
    health: <Heart className="h-6 w-6" />,
    spirituality: <Lightbulb className="h-6 w-6" />,
    relationships: <Users className="h-6 w-6" />,
    finances: <Coins className="h-6 w-6" />
  };

  // Category titles
  const categoryTitles: Record<Category, string> = {
    psychology: 'Mental Wellbeing',
    health: 'Physical Health',
    spirituality: 'Spiritual Growth',
    relationships: 'Social Connections',
    finances: 'Financial Wellness'
  };

  // Get overall health message
  const getOverallHealthMessage = (score: number) => {
    if (score >= 80) {
      return "Excellent! You're thriving across most dimensions of your life.";
    } else if (score >= 60) {
      return "You're doing well! With some focused attention in key areas, you can thrive even more.";
    } else if (score >= 40) {
      return "You're on your growth journey. Focus on the areas that need improvement.";
    } else {
      return "Your assessment indicates opportunities for growth. Consider starting with small changes in key areas.";
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-4xl mx-auto py-10 px-4 sm:px-6">
          <h1 className="text-3xl font-bold text-center mb-2">Your Assessment Results</h1>
          <p className="text-center text-gray-600 mb-10">
            Completed on {new Date(latestAssessment.date).toLocaleDateString()}
          </p>

          {/* Overall Score Card */}
          <Card className="mb-8 overflow-hidden">
            <div className="bg-gradient-to-r from-spirit-purple to-spirit-deep-purple p-6 text-white">
              <h2 className="text-xl font-medium mb-1">Overall Wellbeing Score</h2>
              <div className="flex items-center gap-4">
                <div className="text-5xl font-bold">{overallScore}%</div>
                <div className="text-white/90">{getOverallHealthMessage(overallScore)}</div>
              </div>
            </div>
            <CardContent className="bg-white p-6">
              <div className="flex flex-col gap-4">
                {Object.entries(latestAssessment.scores).map(([category, score]) => (
                  <div key={category} className="flex items-center gap-4">
                    <div className="bg-spirit-soft-purple p-2 rounded-full">
                      {categoryIcons[category as Category]}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">
                          {categoryTitles[category as Category]}
                        </span>
                        <span className="text-sm font-medium">{score}%</span>
                      </div>
                      <ProgressBar 
                        value={score || 0} 
                        size="md"
                        color={
                          score >= 80 ? "bg-green-500" : 
                          score >= 60 ? "bg-spirit-purple" : 
                          score >= 40 ? "bg-amber-500" : "bg-red-500"
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Detailed Category Results */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(Object.keys(latestAssessment.scores) as Category[]).map((category) => {
              const score = latestAssessment.scores[category] || 0;
              const advice = getAdvice(category);
              
              return (
                <Card key={category} className="overflow-hidden">
                  <CardHeader className="bg-spirit-soft-purple flex flex-row gap-4 items-center p-4">
                    <div className="bg-spirit-purple text-white p-3 rounded-full">
                      {categoryIcons[category]}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{categoryTitles[category]}</CardTitle>
                      <CardDescription>{score}% score</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="p-5">
                    <h4 className="font-medium mb-2">Analysis:</h4>
                    <p className="text-gray-700 mb-4">{advice}</p>
                    
                    <h4 className="font-medium mb-2">Recommendations:</h4>
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                      {score < 60 && (
                        <>
                          <li>Consider setting specific goals for improvement</li>
                          <li>Seek resources or support in this area</li>
                        </>
                      )}
                      {category === 'psychology' && (
                        <>
                          <li>Practice daily mindfulness meditation</li>
                          <li>Consider journaling to process emotions</li>
                        </>
                      )}
                      {category === 'health' && (
                        <>
                          <li>Aim for 30 minutes of exercise daily</li>
                          <li>Prioritize 7-8 hours of quality sleep</li>
                        </>
                      )}
                      {category === 'spirituality' && (
                        <>
                          <li>Set aside daily time for reflection</li>
                          <li>Connect with a spiritual community</li>
                        </>
                      )}
                      {category === 'relationships' && (
                        <>
                          <li>Schedule quality time with loved ones</li>
                          <li>Practice active listening and open communication</li>
                        </>
                      )}
                      {category === 'finances' && (
                        <>
                          <li>Create a monthly budget</li>
                          <li>Build an emergency fund</li>
                        </>
                      )}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => navigate('/assessment/recommendations')}
              className="bg-spirit-purple hover:bg-spirit-deep-purple"
            >
              Voir les recommandations personnalisées
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => navigate('/dashboard')}
            >
              Tableau de bord
            </Button>
          </div>
        </main>
      </div>
    </PageTransition>
  );
};

export default AssessmentResults;
