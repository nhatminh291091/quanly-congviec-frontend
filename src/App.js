import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ManagePage from './pages/ManagePage';
import ReportsPage from './pages/ReportsPage';
import PlansPage from './pages/PlansPage';
import StatisticsPage from './pages/StatisticsPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
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
