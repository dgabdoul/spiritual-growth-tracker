
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, Heart, Lightbulb, Users, Coins, TrendingUp } from 'lucide-react';
import CategoryDetailCard from './CategoryDetailCard';
import CategoryBarChart from './CategoryBarChart';
import { Assessment } from '@/utils/assessmentUtils';
import { getCategoryColor, getCategoryIcon, getCategoryTitle, getTrendData } from '@/utils/assessmentUtils';

interface CategoryAnalysisSectionProps {
  assessments: Assessment[];
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  averageScores: {
    psychology: number;
    health: number;
    spirituality: number;
    relationships: number;
    finances: number;
    overall: number;
  };
}

const CategoryAnalysisSection: React.FC<CategoryAnalysisSectionProps> = ({
  assessments,
  selectedCategory,
  setSelectedCategory,
  averageScores
}) => {
  const getLatestScore = () => {
    if (assessments.length === 0) return 0;
    
    return selectedCategory === 'overall' 
      ? assessments[0].overall_score
      : assessments[0][`${selectedCategory}_score` as keyof Assessment];
  };

  const getScoreDifference = () => {
    if (assessments.length <= 1) return undefined;
    
    const latest = selectedCategory === 'overall' 
      ? assessments[0].overall_score
      : assessments[0][`${selectedCategory}_score` as keyof Assessment];
    
    const previous = selectedCategory === 'overall' 
      ? assessments[1].overall_score
      : assessments[1][`${selectedCategory}_score` as keyof Assessment];
    
    return Number(latest) - Number(previous);
  };

  return (
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
          <CategoryDetailCard
            title={getCategoryTitle(selectedCategory)}
            icon={getCategoryIcon(selectedCategory)}
            averageScore={selectedCategory === 'overall' 
              ? averageScores.overall 
              : averageScores[selectedCategory as keyof typeof averageScores]}
            latestScore={getLatestScore()}
            diff={getScoreDifference()}
          />

          <div className="w-full md:w-2/3">
            <CategoryBarChart
              data={getTrendData(assessments, selectedCategory)}
              categoryTitle={getCategoryTitle(selectedCategory)}
              categoryColor={getCategoryColor(selectedCategory)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoryAnalysisSection;
