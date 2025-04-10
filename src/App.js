import React from 'react';
import LandingPage from './pages/LandingPage';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import ManagePage from './pages/ManagePage';
import ReportsPage from './pages/ReportsPage';
import PlansPage from './pages/PlansPage';
import StatisticsPage from './pages/StatisticsPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
 	<Route path="/login" element={<LoginPage />} />
        <Route path="/manage" element={<ManagePage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/plans" element={<PlansPage />} />
        <Route path="/statistics" element={<StatisticsPage />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
