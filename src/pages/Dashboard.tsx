
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useAssessment, Category } from '@/contexts/AssessmentContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/Header';
import CategoryCard from '@/components/CategoryCard';
import ProgressBar from '@/components/ProgressBar';
import { Brain, Heart, Lightbulb, Users, Coins, PlusCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

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

  // Prepare data for the chart
  const chartData = assessmentHistory.map(assessment => {
    const date = new Date(assessment.date).toLocaleDateString();
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Welcome and Quick Actions */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome, {user?.email}</h1>
            <p className="text-gray-600 mt-1">Track your spiritual and personal growth journey</p>
          </div>
          <Button onClick={handleStartAssessment} className="bg-spirit-purple hover:bg-spirit-deep-purple">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Assessment
          </Button>
        </div>

        {/* No Assessments Yet */}
        {assessmentHistory.length === 0 && (
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <Lightbulb className="mx-auto h-12 w-12 text-spirit-purple opacity-75" />
                <h3 className="mt-4 text-lg font-semibold">Start Your Journey</h3>
                <p className="mt-2 text-sm text-gray-600 max-w-sm mx-auto">
                  Take your first assessment to begin tracking your spiritual and personal growth.
                </p>
                <Button onClick={handleStartAssessment} className="mt-6 bg-spirit-purple hover:bg-spirit-deep-purple">
                  Start Assessment
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
                <CardTitle>Latest Assessment Overview</CardTitle>
                <CardDescription>
                  Completed on {new Date(latestAssessment.date).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="w-40 h-40 rounded-full bg-gray-100 flex items-center justify-center border-4 border-spirit-purple">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-spirit-deep-purple">{latestAssessment.overallScore}%</div>
                      <div className="text-sm text-gray-600">Overall Score</div>
                    </div>
                  </div>
                  <div className="flex-1 space-y-4">
                    {Object.entries(latestAssessment.scores).map(([category, score]) => (
                      <div key={category}>
                        <ProgressBar 
                          value={score || 0} 
                          label={category.charAt(0).toUpperCase() + category.slice(1)} 
                          showValue={true}
                          size="md"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Category Cards */}
            <h2 className="text-2xl font-semibold mb-4">Detailed Analysis</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <CategoryCard 
                category="psychology"
                title="Psychology"
                score={latestAssessment.scores.psychology || 0}
                description="Mental health, stress management, and emotional wellbeing."
                icon={<Brain size={24} />}
                advice="Focus on mindfulness practices and stress reduction techniques."
              />
              <CategoryCard 
                category="health"
                title="Health"
                score={latestAssessment.scores.health || 0}
                description="Physical wellbeing, nutrition, exercise, and rest."
                icon={<Heart size={24} />}
                advice="Maintain a balanced diet and regular exercise routine."
              />
              <CategoryCard 
                category="spirituality"
                title="Spirituality"
                score={latestAssessment.scores.spirituality || 0}
                description="Connection to purpose, values, and meaning in life."
                icon={<Lightbulb size={24} />}
                advice="Practice meditation, reflection, or prayer daily."
              />
              <CategoryCard 
                category="relationships"
                title="Relationships"
                score={latestAssessment.scores.relationships || 0}
                description="Quality of personal connections and social interactions."
                icon={<Users size={24} />}
                advice="Dedicate time to nurture important relationships."
              />
              <CategoryCard 
                category="finances"
                title="Finances"
                score={latestAssessment.scores.finances || 0}
                description="Financial health, planning, and stability."
                icon={<Coins size={24} />}
                advice="Create a budget and set aside regular savings."
              />
            </div>
          </>
        )}

        {/* Progress Chart */}
        {assessmentHistory.length > 1 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Progress Over Time</CardTitle>
              <CardDescription>Track how your scores have evolved</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={chartData}
                    margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="overall"
                      name="Overall"
                      stroke="#9b87f5"
                      strokeWidth={3}
                      dot={{ r: 6 }}
                      activeDot={{ r: 8 }}
                    />
                    <Line type="monotone" dataKey="psychology" stroke="#FF8042" />
                    <Line type="monotone" dataKey="health" stroke="#0088FE" />
                    <Line type="monotone" dataKey="spirituality" stroke="#00C49F" />
                    <Line type="monotone" dataKey="relationships" stroke="#FFBB28" />
                    <Line type="monotone" dataKey="finances" stroke="#FF5733" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
