
import React from "react";
import { Navigate } from "react-router-dom";

const Index: React.FC = () => {
  // The issue might be that /landing doesn't exist or there's a problem with the redirect
  // Let's make sure we're redirecting to an existing route
  return <Navigate to="/landing" replace />;
};

export default Index;
