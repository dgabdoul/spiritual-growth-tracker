
import React, { useState, useEffect } from 'react';
import { AssessmentContext } from './AssessmentContext';
import { 
  Assessment, 
  AnswerMap, 
  Category,
  questions
} from './types';
import { 
  calculateCategoryScore, 
  calculateOverallScore, 
  getAdvice 
} from './utils';

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

  const calculateCategoryScoreWithContext = (category: Category): number => {
    return calculateCategoryScore(category, answers);
  };
  
  const calculateOverallScoreWithContext = (): number => {
    return calculateOverallScore(answers);
  };

  const getAdviceWithContext = (category: Category): string => {
    const score = calculateCategoryScoreWithContext(category);
    return getAdvice(category, score);
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
      psychology: calculateCategoryScoreWithContext('psychology'),
      health: calculateCategoryScoreWithContext('health'),
      spirituality: calculateCategoryScoreWithContext('spirituality'),
      relationships: calculateCategoryScoreWithContext('relationships'),
      finances: calculateCategoryScoreWithContext('finances')
    };
    
    const overallScore = calculateOverallScoreWithContext();
    
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
      calculateCategoryScore: calculateCategoryScoreWithContext,
      calculateOverallScore: calculateOverallScoreWithContext,
      getAdvice: getAdviceWithContext
    }}>
      {children}
    </AssessmentContext.Provider>
  );
};
