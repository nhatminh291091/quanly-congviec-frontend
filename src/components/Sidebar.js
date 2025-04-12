import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Quản lý công việc', icon: '📋' },
    { path: '/thong-ke', label: 'Thống kê', icon: '📊' },
    { path: '/bao-cao', label: 'Báo cáo', icon: '📑' },
    { path: '/ke-hoach', label: 'Kế hoạch tháng tới', icon: '🗓️' },
  ];

  return (
    <div className="group fixed top-0 left-0 h-full transition-all duration-300 z-10 bg-gradient-to-b from-indigo-500 to-purple-500 text-white w-[60px] hover:w-[220px] overflow-hidden shadow-lg">
      <div className="p-4 text-center whitespace-nowrap">
        <span className="text-sm font-semibold block">🌈 Thanh điều khiển</span>
      </div>

      <ul className="flex flex-col gap-2 mt-4">
        {navItems.map((item, index) => (
          <Link key={index} to={item.path}>
            <li
              className={`flex items-center gap-2 px-4 py-2 hover:bg-indigo-700 cursor-pointer transition-all ${
                location.pathname === item.path ? 'bg-indigo-800' : ''
              }`}
            >
              <span>{item.icon}</span>
              <span className="group-hover:inline hidden whitespace-nowrap">{item.label}</span>
            </li>
          </Link>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
