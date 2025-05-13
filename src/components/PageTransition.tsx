
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type PageTransitionProps = {
  children: React.ReactNode;
  noAnimation?: boolean;
};

const PageTransition: React.FC<PageTransitionProps> = ({ children, noAnimation = false }) => {
  // If noAnimation is true, don't add animation
  if (noAnimation) {
    return <>{children}</>;
  }
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={window.location.pathname}
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: 1,
          transition: { 
            duration: 0.2, // Reduced from 0.3
            ease: "easeOut"
          }
        }}
        exit={{ 
          opacity: 0,
          transition: { 
            duration: 0.1, // Reduced from 0.2
            ease: "easeIn"
          }
        }}
        className="w-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default React.memo(PageTransition); // Add memoization to prevent unnecessary re-renders
