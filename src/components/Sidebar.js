// 📁 Sidebar.js - giao diện hiện đại, nhiều màu sắc
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, BarChart2, FileText } from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { path: '/dashboard', label: 'Quản lý công việc', icon: <Home size={18} /> },
    { path: '/statistics', label: 'Thống kê', icon: <BarChart2 size={18} /> },
    { path: '/reports', label: 'Báo cáo', icon: <FileText size={18} /> },
  ];

  return (
    <div className="w-64 min-h-screen bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500 text-white shadow-xl">
      <div className="px-6 py-4 text-2xl font-extrabold tracking-wide">🌈 Thanh điều khiển</div>
      <nav className="mt-6 space-y-2">
        {navItems.map((item, idx) => (
          <NavLink
            key={idx}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center px-6 py-3 gap-3 rounded-lg transition duration-200 ${
                isActive
                  ? 'bg-white text-indigo-600 font-bold shadow-md'
                  : 'hover:bg-white/20'
              }`
            }
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
