
import React from 'react';
import { motion } from 'framer-motion';

type PageTransitionProps = {
  children: React.ReactNode;
};

const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        transition: { 
          duration: 0.5,
          ease: "easeOut"
        }
      }}
      exit={{ 
        opacity: 0, 
        y: -20,
        transition: { 
          duration: 0.3,
          ease: "easeIn"
        }
      }}
      className="w-full"
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
