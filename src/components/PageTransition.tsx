
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

type PageTransitionProps = {
  children: React.ReactNode;
  noAnimation?: boolean;
};

const PageTransition: React.FC<PageTransitionProps> = ({ children, noAnimation = false }) => {
  // Si noAnimation est true, ne pas ajouter d'animation
  if (noAnimation) {
    return <>{children}</>;
  }
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ 
        opacity: 1,
        transition: { 
          duration: 0.3,
          ease: "easeOut"
        }
      }}
      exit={{ 
        opacity: 0,
        transition: { 
          duration: 0.2,
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
