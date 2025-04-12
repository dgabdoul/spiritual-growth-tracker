
import React, { useEffect, useState } from 'react';
import { Assessment } from '@/contexts/AssessmentContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Brain, Heart, Lightbulb, Users, Coins } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const PrintView: React.FC = () => {
  const [assessment, setAssessment] = useState<Assessment | null>(null);

  useEffect(() => {
    // Load assessment from localStorage
    const storedAssessment = localStorage.getItem('printAssessment');
    if (storedAssessment) {
      setAssessment(JSON.parse(storedAssessment));
    }

    // Auto-print when the component loads
    window.onload = () => {
      setTimeout(() => {
        window.print();
      }, 500);
    };
  }, []);

  if (!assessment) {
    return <div className="p-12 text-center">Chargement du rapport...</div>;
  }

  const categoryIcons: Record<string, React.ReactNode> = {
    psychology: <Brain className="h-5 w-5" />,
    health: <Heart className="h-5 w-5" />,
    spirituality: <Lightbulb className="h-5 w-5" />,
    relationships: <Users className="h-5 w-5" />,
    finances: <Coins className="h-5 w-5" />
  };

  const categoryNames: Record<string, string> = {
    psychology: 'Psychologie',
    health: 'Santé',
    spirituality: 'Spiritualité',
    relationships: 'Relations',
    finances: 'Finances'
  };

  return (
    <div className="p-8 max-w-4xl mx-auto print:p-0">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Rapport d'Évaluation Spirituelle</h1>
        <p className="text-gray-600 mt-2">
          Date: {format(new Date(assessment.date), 'dd MMMM yyyy', { locale: fr })}
        </p>
      </div>

      <Card className="mb-8 print:shadow-none print:border-none">
        <CardHeader>
          <CardTitle>Score Global</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center">
          <div className="w-32 h-32 rounded-full flex items-center justify-center border-4 border-spirit-purple">
            <div className="text-center">
              <div className="text-4xl font-bold text-spirit-deep-purple">{assessment.overallScore}%</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-8 print:shadow-none print:border-none">
        <CardHeader>
          <CardTitle>Scores par Catégorie</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Catégorie</TableHead>
                <TableHead className="text-right">Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(assessment.scores).map(([category, score]) => (
                <TableRow key={category}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="bg-spirit-soft-purple p-1 rounded-full flex items-center justify-center">
                        {categoryIcons[category]}
                      </span>
                      <span>{categoryNames[category]}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-medium">{score}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="text-center text-sm text-gray-500 mt-12 print:mt-8">
        <p>Rapport généré par Spirit Track</p>
        <p className="mt-1">www.spirittrack.com</p>
      </div>
    </div>
  );
};

export default PrintView;
