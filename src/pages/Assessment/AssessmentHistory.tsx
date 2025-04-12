
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAssessment, Assessment } from '@/contexts/AssessmentContext';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ChevronLeft, Eye, Printer, Download } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const AssessmentHistory: React.FC = () => {
  const navigate = useNavigate();
  const { assessmentHistory } = useAssessment();
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null);

  const handleViewDetails = (assessment: Assessment) => {
    setSelectedAssessment(assessment);
    // Alternative: navigate to a detail view
    // navigate(`/assessment/history/${assessment.id}`);
  };

  const handlePrint = (assessment: Assessment) => {
    // Store the assessment to print in localStorage
    localStorage.setItem('printAssessment', JSON.stringify(assessment));
    
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
    
    Object.entries(assessment.scores).forEach(([category, score]) => {
      const categoryName = 
        category === 'psychology' ? 'Psychologie' :
        category === 'health' ? 'Santé' :
        category === 'spirituality' ? 'Spiritualité' :
        category === 'relationships' ? 'Relations' : 'Finances';
        
      csvContent += `${categoryName},${score}\n`;
    });
    
    csvContent += `\nScore Global,${assessment.overallScore}\n`;
    csvContent += `\nDate,${new Date(assessment.date).toLocaleDateString('fr-FR')}\n`;
    
    // Create and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `evaluation_${format(new Date(assessment.date), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
            {assessmentHistory.length === 0 ? (
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
                    {assessmentHistory.slice().reverse().map((assessment) => (
                      <TableRow key={assessment.id}>
                        <TableCell className="font-medium">
                          {format(new Date(assessment.date), 'dd MMMM yyyy', { locale: fr })}
                        </TableCell>
                        <TableCell className="font-bold text-spirit-purple">
                          {assessment.overallScore}%
                        </TableCell>
                        <TableCell>{assessment.scores.psychology}%</TableCell>
                        <TableCell>{assessment.scores.health}%</TableCell>
                        <TableCell>{assessment.scores.spirituality}%</TableCell>
                        <TableCell>{assessment.scores.relationships}%</TableCell>
                        <TableCell>{assessment.scores.finances}%</TableCell>
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
                Détails de l'évaluation du {format(new Date(selectedAssessment.date), 'dd MMMM yyyy', { locale: fr })}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-2">Score global</h3>
                  <div className="text-4xl font-bold text-spirit-deep-purple">{selectedAssessment.overallScore}%</div>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Scores par catégorie</h3>
                  <ul className="space-y-2">
                    <li className="flex justify-between">
                      <span>Psychologie</span>
                      <span className="font-medium">{selectedAssessment.scores.psychology}%</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Santé</span>
                      <span className="font-medium">{selectedAssessment.scores.health}%</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Spiritualité</span>
                      <span className="font-medium">{selectedAssessment.scores.spirituality}%</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Relations</span>
                      <span className="font-medium">{selectedAssessment.scores.relationships}%</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Finances</span>
                      <span className="font-medium">{selectedAssessment.scores.finances}%</span>
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
