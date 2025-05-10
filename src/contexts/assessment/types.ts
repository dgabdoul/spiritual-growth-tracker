
// Define all types and constants related to assessments

// Define the categories
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

export interface AssessmentContextType {
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
