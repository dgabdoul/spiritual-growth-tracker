
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import { AuthProvider } from './contexts/AuthContext';
import Statistics from './pages/Admin/Statistics';
import UserManagement from './pages/Admin/UserManagement';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/admin/statistics" element={<Statistics />} />
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="*" element={<div>Page Not Found</div>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
