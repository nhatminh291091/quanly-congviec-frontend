// 📁 Header.js - giao diện nhiều màu sắc hiện đại
import React from 'react';
import { Bell } from 'lucide-react';

const Header = ({ title, toggleSidebar, sidebarOpen }) => {
  return (
    <header className="flex justify-between items-center px-6 py-4 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-600 text-white shadow-lg">
      <div className="flex items-center gap-4">
        <button onClick={toggleSidebar} className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition">
          ☰
        </button>
        <h1 className="text-xl font-bold tracking-wide">{title}</h1>
      </div>
      <div className="flex items-center gap-4">
        <button className="relative">
          <Bell size={20} />
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
        </button>
        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold">A</div>
      </div>
    </header>
  );
};

export default Header;
