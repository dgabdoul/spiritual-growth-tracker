
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/Header';
import { Brain, Heart, Lightbulb, Users, Coins } from 'lucide-react';
import { useAssessment } from '@/contexts/AssessmentContext';

const AssessmentStart: React.FC = () => {
  const { startNewAssessment } = useAssessment();
  const navigate = useNavigate();

  const handleStart = () => {
    startNewAssessment();
    navigate('/assessment/psychology');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-4xl mx-auto py-10 px-4 sm:px-6">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-gradient">Holistic Assessment</CardTitle>
            <CardDescription className="text-lg">
              Evaluate your growth across 5 key life dimensions
            </CardDescription>
          </CardHeader>
          <CardContent className="py-6">
            <div className="text-center mb-8">
              <p className="text-gray-700">
                This assessment will help you identify areas of strength and opportunities for growth across the five dimensions of wellbeing. Rate each statement from 1 (strongly disagree) to 5 (strongly agree).
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
                <Brain className="text-spirit-purple h-10 w-10 mb-4" />
                <h3 className="font-medium mb-1">Psychology</h3>
                <p className="text-gray-500 text-sm">4 questions</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
                <Heart className="text-spirit-purple h-10 w-10 mb-4" />
                <h3 className="font-medium mb-1">Health</h3>
                <p className="text-gray-500 text-sm">4 questions</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
                <Lightbulb className="text-spirit-purple h-10 w-10 mb-4" />
                <h3 className="font-medium mb-1">Spirituality</h3>
                <p className="text-gray-500 text-sm">4 questions</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
                <Users className="text-spirit-purple h-10 w-10 mb-4" />
                <h3 className="font-medium mb-1">Relationships</h3>
                <p className="text-gray-500 text-sm">4 questions</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
                <Coins className="text-spirit-purple h-10 w-10 mb-4" />
                <h3 className="font-medium mb-1">Finances</h3>
                <p className="text-gray-500 text-sm">4 questions</p>
              </div>
            </div>

            <div className="bg-gray-100 p-4 rounded-md">
              <h4 className="font-medium mb-2 flex items-center">
                <Lightbulb className="inline mr-2 h-5 w-5 text-amber-600" /> 
                Tips for an accurate assessment:
              </h4>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                <li>Answer honestly based on your current situation, not how you wish things were</li>
                <li>Consider your general patterns over the past month, not just recent events</li>
                <li>Take your time to reflect on each question</li>
              </ul>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center pb-6">
            <Button size="lg" className="bg-spirit-purple hover:bg-spirit-deep-purple" onClick={handleStart}>
              Begin Assessment
            </Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
};

export default AssessmentStart;
