
import React, { createContext, useContext } from 'react';
import { AssessmentContextType } from './types';

// Create the context
const AssessmentContext = createContext<AssessmentContextType | undefined>(undefined);

/**
 * Hook for accessing assessment context
 */
export const useAssessment = () => {
  const context = useContext(AssessmentContext);
  if (context === undefined) {
    throw new Error('useAssessment must be used within an AssessmentProvider');
  }
  return context;
};

export { AssessmentContext };
