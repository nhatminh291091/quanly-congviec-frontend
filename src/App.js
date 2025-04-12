// 📄 App.js - Giao diện tổng thể
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import Sidebar from './components/Sidebar';

function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-purple-100">
        <Sidebar />
        <main className="flex-1 p-6 overflow-y-auto">
          <Routes>
            <Route path="/dashboard" element={<DashboardPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
