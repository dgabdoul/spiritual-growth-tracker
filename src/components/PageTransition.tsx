
import React from 'react';
import { motion } from 'framer-motion';

type PageTransitionProps = {
  children: React.ReactNode;
  noAnimation?: boolean;
};

const PageTransition: React.FC<PageTransitionProps> = ({ children, noAnimation = false }) => {
  // Si noAnimation est vrai, ne pas ajouter d'animation
  if (noAnimation) {
    return <>{children}</>;
  }
  
  return (
    <motion.div
      key={window.location.pathname}
      initial={{ opacity: 0 }}
      animate={{ 
        opacity: 1,
        transition: { 
          duration: 0.15, // Réduit de 0.2 à 0.15 pour une animation plus rapide
          ease: "easeOut"
        }
      }}
      exit={{ 
        opacity: 0,
        transition: { 
          duration: 0.1, // Maintenir 0.1 pour une sortie rapide
          ease: "easeIn"
        }
      }}
      className="w-full"
    >
      {children}
    </motion.div>
  );
};

// Utiliser React.memo pour éviter les re-rendus inutiles
export default React.memo(PageTransition);
