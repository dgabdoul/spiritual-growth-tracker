import React, { createContext, useContext, useState, useEffect } from "react";

// Define the categories and their questions
export type Category = 'psychology' | 'health' | 'spirituality' | 'relationships' | 'finances';

export interface Question {
  id: string;
  text: string;
  category: Category;
}

export type AnswerMap = {
  [questionId: string]: number;
};

export interface Assessment {
  id: string;
  date: string;
  answers: AnswerMap;
  scores: {
    [key in Category]?: number;
  };
  overallScore: number;
}

interface AssessmentContextType {
  currentAssessment: Assessment | null;
  answers: AnswerMap;
  setAnswer: (questionId: string, value: number) => void;
  saveAssessment: () => void;
  startNewAssessment: () => void;
  assessmentHistory: Assessment[];
  calculateCategoryScore: (category: Category) => number;
  calculateOverallScore: () => number;
  getAdvice: (category: Category) => string;
}

// Updated questions based on provided criteria
export const questions: Question[] = [
  // Psychology
  { id: 'psy1', text: 'Persévérance', category: 'psychology' },
  { id: 'psy2', text: 'Silence et maîtrise de la colère', category: 'psychology' },
  { id: 'psy3', text: 'Se mêler de ses affaires (Éviter l\'ingérence)', category: 'psychology' },
  { id: 'psy4', text: 'Réfléchir avant de parler', category: 'psychology' },
  { id: 'psy5', text: 'Être satisfait de ce qu\'on a (Contentement)', category: 'psychology' },
  
  // Health
  { id: 'hea1', text: 'Boire en 3 temps (Selon la Sunna)', category: 'health' },
  { id: 'hea2', text: 'Manger peu (Modération alimentaire)', category: 'health' },
  { id: 'hea3', text: 'Se coucher sur le côté droit', category: 'health' },
  { id: 'hea4', text: 'Consommation du miel (Santé naturelle)', category: 'health' },
  { id: 'hea5', text: 'Faire du sport / Sortir de son milieu (Activité physique)', category: 'health' },
  
  // Spirituality
  { id: 'spi1', text: 'Lecture du Coran (Quotidienne)', category: 'spirituality' },
  { id: 'spi2', text: 'Prières nocturnes (Tahajjud/Qiyam)', category: 'spirituality' },
  { id: 'spi3', text: 'Jeûne régulier (Sunnah/Mustahabb)', category: 'spirituality' },
  { id: 'spi4', text: 'Repentir quotidien (Istighfar)', category: 'spirituality' },
  { id: 'spi5', text: 'Pratique de méditation (Dhikr/Tafakkur)', category: 'spirituality' },
  { id: 'spi6', text: 'Connexion esprit-âme (Équilibre intérieur)', category: 'spirituality' },
  
  // Relationships
  { id: 'rel1', text: 'Sourire', category: 'relationships' },
  { id: 'rel2', text: 'Offrir des cadeaux', category: 'relationships' },
  { id: 'rel3', text: 'Empathie et générosité', category: 'relationships' },
  { id: 'rel4', text: 'Visiter ses proches malades', category: 'relationships' },
  { id: 'rel5', text: 'Répondre aux invitations', category: 'relationships' },
  { id: 'rel6', text: 'Cacher les défauts des autres', category: 'relationships' },
  
  // Finances
  { id: 'fin1', text: 'Se lever tôt (Productivité)', category: 'finances' },
  { id: 'fin2', text: 'Dépenser dans le bien (Charité, investissements utiles)', category: 'finances' },
  { id: 'fin3', text: 'Être reconnaissant (Pour les biens matériels)', category: 'finances' },
  { id: 'fin4', text: 'Invoquer contre la pauvreté (Douas spécifiques)', category: 'finances' },
  { id: 'fin5', text: 'Protection des liens parentaux (Dépenses familiales justes)', category: 'finances' }
];

// Create the context
const AssessmentContext = createContext<AssessmentContextType | undefined>(undefined);

export const AssessmentProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [currentAssessment, setCurrentAssessment] = useState<Assessment | null>(null);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [assessmentHistory, setAssessmentHistory] = useState<Assessment[]>([]);

  // Load saved assessments from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('spiritTrackHistory');
    if (savedHistory) {
      setAssessmentHistory(JSON.parse(savedHistory));
    }
    
    const inProgressAssessment = localStorage.getItem('spiritTrackCurrentAssessment');
    if (inProgressAssessment) {
      const saved = JSON.parse(inProgressAssessment);
      setCurrentAssessment(saved);
      setAnswers(saved.answers || {});
    }
  }, []);

  const setAnswer = (questionId: string, value: number) => {
    const updatedAnswers = { ...answers, [questionId]: value };
    setAnswers(updatedAnswers);
    
    // Save progress to localStorage
    if (currentAssessment) {
      const updatedAssessment = {
        ...currentAssessment,
        answers: updatedAnswers
      };
      setCurrentAssessment(updatedAssessment);
      localStorage.setItem('spiritTrackCurrentAssessment', JSON.stringify(updatedAssessment));
    }
  };

  const calculateCategoryScore = (category: Category): number => {
    const categoryQuestions = questions.filter(q => q.category === category);
    let total = 0;
    let answeredCount = 0;
    
    categoryQuestions.forEach(question => {
      if (answers[question.id]) {
        total += answers[question.id];
        answeredCount++;
      }
    });
    
    return answeredCount > 0 ? Math.round((total / (answeredCount * 5)) * 100) : 0;
  };
  
  const calculateOverallScore = (): number => {
    const totalQuestions = Object.keys(answers).length;
    if (totalQuestions === 0) return 0;
    
    const totalScore = Object.values(answers).reduce((sum, score) => sum + score, 0);
    return Math.round((totalScore / (totalQuestions * 5)) * 100);
  };

  const getAdvice = (category: Category): string => {
    const score = calculateCategoryScore(category);
    
    if (score >= 80) {
      return "Excellent! Keep maintaining your current practices.";
    } else if (score >= 60) {
      return "Good progress! Consider small improvements for even better results.";
    } else if (score >= 40) {
      return "You're on the right path. Focus on consistent improvement in this area.";
    } else {
      return "This area needs attention. Consider seeking resources and support.";
    }
  };

  const startNewAssessment = () => {
    const newAssessment: Assessment = {
      id: `assessment-${Date.now()}`,
      date: new Date().toISOString(),
      answers: {},
      scores: {},
      overallScore: 0
    };
    
    setCurrentAssessment(newAssessment);
    setAnswers({});
    localStorage.setItem('spiritTrackCurrentAssessment', JSON.stringify(newAssessment));
  };

  const saveAssessment = () => {
    if (!currentAssessment) return;
    
    // Calculate scores for each category
    const categoryScores = {
      psychology: calculateCategoryScore('psychology'),
      health: calculateCategoryScore('health'),
      spirituality: calculateCategoryScore('spirituality'),
      relationships: calculateCategoryScore('relationships'),
      finances: calculateCategoryScore('finances')
    };
    
    const overallScore = calculateOverallScore();
    
    const completedAssessment: Assessment = {
      ...currentAssessment,
      scores: categoryScores,
      overallScore,
      date: new Date().toISOString()
    };
    
    // Add to history
    const updatedHistory = [...assessmentHistory, completedAssessment];
    setAssessmentHistory(updatedHistory);
    
    // Save to localStorage
    localStorage.setItem('spiritTrackHistory', JSON.stringify(updatedHistory));
    
    // Clear current assessment
    localStorage.removeItem('spiritTrackCurrentAssessment');
    setCurrentAssessment(null);
    setAnswers({});
  };

  return (
    <AssessmentContext.Provider value={{
      currentAssessment,
      answers,
      setAnswer,
      saveAssessment,
      startNewAssessment,
      assessmentHistory,
      calculateCategoryScore,
      calculateOverallScore,
      getAdvice
    }}>
      {children}
    </AssessmentContext.Provider>
  );
};

export const useAssessment = () => {
  const context = useContext(AssessmentContext);
  if (context === undefined) {
    throw new Error('useAssessment must be used within an AssessmentProvider');
  }
  return context;
};
