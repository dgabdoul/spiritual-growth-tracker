import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Brain, Heart, Lightbulb, Users, Coins, TrendingUp } from 'lucide-react';
import React from 'react';

export interface Assessment {
  id: string;
  assessment_date: string;
  psychology_score: number;
  health_score: number;
  spirituality_score: number;
  relationships_score: number;
  finances_score: number;
  overall_score: number;
}

export const calculateAverageScores = (data: Assessment[]) => {
  if (data.length === 0) return {
    psychology: 0,
    health: 0,
    spirituality: 0,
    relationships: 0,
    finances: 0,
    overall: 0
  };
  
  const sums = data.reduce((acc, assessment) => {
    return {
      psychology: acc.psychology + assessment.psychology_score,
      health: acc.health + assessment.health_score,
      spirituality: acc.spirituality + assessment.spirituality_score,
      relationships: acc.relationships + assessment.relationships_score,
      finances: acc.finances + assessment.finances_score,
      overall: acc.overall + assessment.overall_score
    };
  }, { psychology: 0, health: 0, spirituality: 0, relationships: 0, finances: 0, overall: 0 });

  return {
    psychology: Math.round(sums.psychology / data.length),
    health: Math.round(sums.health / data.length),
    spirituality: Math.round(sums.spirituality / data.length),
    relationships: Math.round(sums.relationships / data.length),
    finances: Math.round(sums.finances / data.length),
    overall: Math.round(sums.overall / data.length)
  };
};

export const getProgressionData = (assessments: Assessment[]) => {
  return assessments.map(item => ({
    date: format(new Date(item.assessment_date), 'dd/MM/yy', { locale: fr }),
    psychologie: item.psychology_score,
    santé: item.health_score,
    spiritualité: item.spirituality_score,
    relations: item.relationships_score,
    finances: item.finances_score,
    global: item.overall_score
  })).reverse();
};

export const getCategoryData = (assessments: Assessment[]) => {
  if (assessments.length === 0) return [];
  
  const latest = assessments[0];
  return [
    { name: 'Psychologie', value: latest.psychology_score, color: '#8884d8' },
    { name: 'Santé', value: latest.health_score, color: '#82ca9d' },
    { name: 'Spiritualité', value: latest.spirituality_score, color: '#ffc658' },
    { name: 'Relations', value: latest.relationships_score, color: '#a4de6c' },
    { name: 'Finances', value: latest.finances_score, color: '#d0ed57' },
  ];
};

export const getTrendData = (assessments: Assessment[], selectedCategory: string) => {
  if (assessments.length <= 1) return [];
  
  const sorted = [...assessments].sort((a, b) => 
    new Date(a.assessment_date).getTime() - new Date(b.assessment_date).getTime()
  );
  
  return sorted.map((item) => {
    const date = format(new Date(item.assessment_date), 'dd/MM/yy', { locale: fr });
    
    switch (selectedCategory) {
      case 'psychology':
        return { date, score: item.psychology_score };
      case 'health':
        return { date, score: item.health_score };
      case 'spirituality':
        return { date, score: item.spirituality_score };
      case 'relationships':
        return { date, score: item.relationships_score };
      case 'finances':
        return { date, score: item.finances_score };
      default:
        return { date, score: item.overall_score };
    }
  });
};

export const getCategoryColor = (category: string): string => {
  switch (category) {
    case 'psychology': return '#8884d8';
    case 'health': return '#82ca9d';
    case 'spirituality': return '#ffc658';
    case 'relationships': return '#a4de6c';
    case 'finances': return '#d0ed57';
    default: return '#9b87f5';
  }
};

export const getCategoryIcon = (category: string): React.ReactNode => {
  switch (category) {
    case 'psychology': return <Brain className="h-6 w-6" />;
    case 'health': return <Heart className="h-6 w-6" />;
    case 'spirituality': return <Lightbulb className="h-6 w-6" />;
    case 'relationships': return <Users className="h-6 w-6" />;
    case 'finances': return <Coins className="h-6 w-6" />;
    default: return <TrendingUp className="h-6 w-6" />;
  }
};

export const getCategoryTitle = (category: string): string => {
  switch (category) {
    case 'psychology': return 'Psychologie';
    case 'health': return 'Santé';
    case 'spirituality': return 'Spiritualité';
    case 'relationships': return 'Relations';
    case 'finances': return 'Finances';
    default: return 'Score Global';
  }
};
