
import React, { useEffect, useState } from 'react';
import { Assessment } from '@/contexts/assessment';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Brain, Heart, Lightbulb, Users, Coins } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useAuth } from '@/contexts/AuthContext';

const PrintView: React.FC = () => {
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const { user, profile } = useAuth();

  useEffect(() => {
    // Load assessment from localStorage
    const storedAssessment = localStorage.getItem('printAssessment');
    if (storedAssessment) {
      setAssessment(JSON.parse(storedAssessment));
    }

    // Add A4 portrait format styles
    const style = document.createElement('style');
    style.innerHTML = `
      @page {
        size: A4 portrait;
        margin: 20mm 15mm;
      }
      @media print {
        body {
          width: 210mm;
          height: 297mm;
          margin: 0;
          padding: 0;
        }
      }
    `;
    document.head.appendChild(style);

    // Auto-print when the component loads
    setTimeout(() => {
      window.print();
    }, 500);
    
    return () => {
      document.head.removeChild(style);
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
    <div className="p-8 max-w-4xl mx-auto print:p-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Rapport d'Évaluation Spirituelle</h1>
        <p className="text-gray-600 mt-1">
          Date: {format(new Date(assessment.date), 'dd MMMM yyyy', { locale: fr })}
        </p>
        {user && (
          <p className="text-gray-800 mt-3">
            <span className="font-medium">Client:</span> {profile?.display_name || user?.email || "Utilisateur"}
          </p>
        )}
      </div>

      <Card className="mb-8 print:shadow-none print:border-none">
        <CardHeader>
          <CardTitle>Score Global</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center">
          <div className="w-32 h-32 rounded-full flex items-center justify-center border-4 border-spirit-purple">
            <div className="text-center">
              <div className="text-4xl font-bold text-spirit-deep-purple">{assessment.overallScore}%</div>
              <div className="text-sm text-gray-600 mt-1">
                {Number(assessment.overallScore) >= 80 
                  ? 'Excellent' 
                  : Number(assessment.overallScore) >= 60 
                  ? 'Bon' 
                  : Number(assessment.overallScore) >= 40 
                  ? 'Moyen' 
                  : 'À améliorer'}
              </div>
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
                <TableHead>Évaluation</TableHead>
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
                  <TableCell>
                    {Number(score) >= 80 
                      ? 'Excellent' 
                      : Number(score) >= 60 
                      ? 'Bon' 
                      : Number(score) >= 40 
                      ? 'Moyen' 
                      : 'À améliorer'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="mb-8 print:shadow-none print:border-none">
        <CardHeader>
          <CardTitle>Recommandations</CardTitle>
        </CardHeader>
        <CardContent className="text-sm">
          <ul className="list-disc pl-5 space-y-2">
            {Object.entries(assessment.scores).map(([category, score]) => {
              if (Number(score) < 60) {
                return (
                  <li key={category} className="text-gray-700">
                    <strong>{categoryNames[category]}</strong>: {Number(score) < 40 
                      ? 'Nous vous recommandons de consacrer davantage de temps et d\'attention à ce domaine pour améliorer votre bien-être global.' 
                      : 'Ce domaine présente des opportunités d\'amélioration. Envisagez de mettre en place des habitudes positives pour progresser.'}
                  </li>
                );
              }
              return null;
            })}
            {!Object.values(assessment.scores).some(score => Number(score) < 60) && (
              <li className="text-gray-700">
                <strong>Félicitations !</strong> Vos scores sont bons dans tous les domaines. Continuez à maintenir ces bonnes pratiques pour préserver votre équilibre.
              </li>
            )}
          </ul>
        </CardContent>
      </Card>

      <div className="text-center text-sm text-gray-500 mt-12 print:mt-8">
        <div className="flex items-center justify-center mb-2">
          <div className="w-8 h-1 bg-spirit-purple rounded-full mx-2"></div>
          <p className="font-medium">SpiritTrack</p>
          <div className="w-8 h-1 bg-spirit-purple rounded-full mx-2"></div>
        </div>
        <p>Rapport généré le {format(new Date(), 'dd MMMM yyyy', { locale: fr })}</p>
        <p className="mt-1">www.spirittrack.com</p>
        {user && <p className="mt-1">Préparé pour: {profile?.display_name || user?.email || "Utilisateur"}</p>}
      </div>
    </div>
  );
};

export default PrintView;
