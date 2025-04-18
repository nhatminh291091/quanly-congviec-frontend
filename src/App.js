import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import DashboardPage from './pages/DashboardPage';
import KeHoachPage from './pages/KeHoachPage';
import BaoCaoPage from './pages/BaoCaoPage';
function App() {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  return (
    <Router>
      <div className="min-h-screen flex bg-gradient-to-br from-blue-50 to-purple-100 transition-all duration-300">
        <Sidebar onToggle={setSidebarExpanded} sidebarExpanded={sidebarExpanded} />
        <main
          className="p-6 transition-all duration-300"
          style={{ marginLeft: sidebarExpanded ? 220 : 60 }}
        >
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/ke-hoach" element={<KeHoachPage />} />
            <Route pathh="/bao-cao/:id" element={<BaoCaoPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
