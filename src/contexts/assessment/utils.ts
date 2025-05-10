
import { Category, AnswerMap, questions } from './types';

/**
 * Calculate the score for a specific category based on the provided answers
 */
export const calculateCategoryScore = (category: Category, answers: AnswerMap): number => {
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

/**
 * Calculate the overall score based on all answers
 */
export const calculateOverallScore = (answers: AnswerMap): number => {
  const totalQuestions = Object.keys(answers).length;
  if (totalQuestions === 0) return 0;
  
  const totalScore = Object.values(answers).reduce((sum, score) => sum + score, 0);
  return Math.round((totalScore / (totalQuestions * 5)) * 100);
};

/**
 * Get advice based on the category score
 */
export const getAdvice = (category: Category, score: number): string => {
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
