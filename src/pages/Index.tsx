
import React from "react";
import { Navigate } from "react-router-dom";

const Index: React.FC = () => {
  // Redirection explicite vers la page d'accueil
  return <Navigate to="/landing" replace />;
};

export default Index;
