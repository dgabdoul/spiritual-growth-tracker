
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ChevronLeft, Eye, Printer, Download } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { supabase } from '@/integrations/supabase/client';

interface Assessment {
  id: string;
  assessment_date: string;
  psychology_score: number;
  health_score: number;
  spirituality_score: number;
  relationships_score: number;
  finances_score: number;
  overall_score: number;
}

const AssessmentHistory: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserAssessments = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('user_assessments')
          .select('*')
          .eq('user_id', user.id)
          .order('assessment_date', { ascending: false });

        if (error) throw error;
        if (data) {
          setAssessments(data);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des évaluations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAssessments();
  }, [user]);

  const handleViewDetails = (assessment: Assessment) => {
    setSelectedAssessment(assessment);
  };

  const handlePrint = (assessment: Assessment) => {
    // Store the assessment to print in localStorage
    localStorage.setItem('printAssessment', JSON.stringify({
      id: assessment.id,
      date: assessment.assessment_date,
      scores: {
        psychology: assessment.psychology_score,
        health: assessment.health_score,
        spirituality: assessment.spirituality_score,
        relationships: assessment.relationships_score,
        finances: assessment.finances_score
      },
      overallScore: assessment.overall_score
    }));
    
    // Open print view in new tab
    const printWindow = window.open('/assessment/print', '_blank');
    if (printWindow) {
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
        }, 500);
      };
    }
  };

  const handleDownload = (assessment: Assessment) => {
    // Create CSV content
    let csvContent = "Catégorie,Score\n";
    
    csvContent += `Psychologie,${assessment.psychology_score}\n`;
    csvContent += `Santé,${assessment.health_score}\n`;
    csvContent += `Spiritualité,${assessment.spirituality_score}\n`;
    csvContent += `Relations,${assessment.relationships_score}\n`;
    csvContent += `Finances,${assessment.finances_score}\n`;
    
    csvContent += `\nScore Global,${assessment.overall_score}\n`;
    csvContent += `\nDate,${format(new Date(assessment.assessment_date), 'dd/MM/yyyy', { locale: fr })}\n`;
    
    // Create and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `evaluation_${format(new Date(assessment.assessment_date), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-spirit-purple mx-auto"></div>
              <p className="mt-4 text-gray-600">Chargement de l'historique...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Historique des évaluations</h1>
            <p className="text-gray-600 mt-1">Consultez toutes vos évaluations précédentes</p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-1"
          >
            <ChevronLeft className="h-4 w-4" />
            Retour au tableau de bord
          </Button>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Vos évaluations</CardTitle>
          </CardHeader>
          <CardContent>
            {assessments.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-gray-500">Vous n'avez pas encore réalisé d'évaluation.</p>
                <Button 
                  onClick={() => navigate('/assessment')}
                  className="mt-4 bg-spirit-purple hover:bg-spirit-deep-purple"
                >
                  Commencer une évaluation
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Score Global</TableHead>
                      <TableHead>Psychologie</TableHead>
                      <TableHead>Santé</TableHead>
                      <TableHead>Spiritualité</TableHead>
                      <TableHead>Relations</TableHead>
                      <TableHead>Finances</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {assessments.map((assessment) => (
                      <TableRow key={assessment.id}>
                        <TableCell className="font-medium">
                          {format(new Date(assessment.assessment_date), 'dd MMMM yyyy', { locale: fr })}
                        </TableCell>
                        <TableCell className="font-bold text-spirit-purple">
                          {assessment.overall_score}%
                        </TableCell>
                        <TableCell>{assessment.psychology_score}%</TableCell>
                        <TableCell>{assessment.health_score}%</TableCell>
                        <TableCell>{assessment.spirituality_score}%</TableCell>
                        <TableCell>{assessment.relationships_score}%</TableCell>
                        <TableCell>{assessment.finances_score}%</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="icon" 
                              onClick={() => handleViewDetails(assessment)}
                              title="Voir les détails"
                            >
                              <Eye size={16} />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="icon" 
                              onClick={() => handlePrint(assessment)}
                              title="Imprimer le rapport"
                            >
                              <Printer size={16} />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="icon" 
                              onClick={() => handleDownload(assessment)}
                              title="Télécharger les données"
                            >
                              <Download size={16} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {selectedAssessment && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>
                Détails de l'évaluation du {format(new Date(selectedAssessment.assessment_date), 'dd MMMM yyyy', { locale: fr })}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-2">Score global</h3>
                  <div className="text-4xl font-bold text-spirit-deep-purple">{selectedAssessment.overall_score}%</div>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Scores par catégorie</h3>
                  <ul className="space-y-2">
                    <li className="flex justify-between">
                      <span>Psychologie</span>
                      <span className="font-medium">{selectedAssessment.psychology_score}%</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Santé</span>
                      <span className="font-medium">{selectedAssessment.health_score}%</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Spiritualité</span>
                      <span className="font-medium">{selectedAssessment.spirituality_score}%</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Relations</span>
                      <span className="font-medium">{selectedAssessment.relationships_score}%</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Finances</span>
                      <span className="font-medium">{selectedAssessment.finances_score}%</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-6 flex justify-center gap-4">
                <Button
                  variant="outline"
                  onClick={() => handlePrint(selectedAssessment)}
                  className="flex items-center gap-1"
                >
                  <Printer className="h-4 w-4" />
                  Imprimer ce rapport
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleDownload(selectedAssessment)}
                  className="flex items-center gap-1"
                >
                  <Download className="h-4 w-4" />
                  Télécharger les données
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default AssessmentHistory;
