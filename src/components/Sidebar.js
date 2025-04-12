import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FileText, BarChart3, FileBarChart, CalendarCheck
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();

  const menu = [
    { name: 'Quản lý công việc', path: '/', icon: <FileText size={20} /> },
    { name: 'Thống kê', path: '/thong-ke', icon: <BarChart3 size={20} /> },
    { name: 'Báo cáo', path: '/bao-cao', icon: <FileBarChart size={20} /> },
    { name: 'Kế hoạch tháng tới', path: '/ke-hoach', icon: <CalendarCheck size={20} /> }
  ];

  return (
    <div
      className="group fixed top-0 left-0 h-full z-10 bg-gradient-to-b from-indigo-500 to-purple-500 text-white 
        transition-all duration-300 ease-in-out w-[60px] hover:w-[230px] shadow-lg overflow-hidden"
    >
      <div className="p-4 text-center">
        <span className="block text-sm font-semibold">🌈 Thanh điều khiển</span>
      </div>

      <ul className="flex flex-col gap-2 mt-6 px-2">
        {menu.map((item, idx) => (
          <Link key={idx} to={item.path}>
            <li
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200
                ${location.pathname === item.path ? 'bg-indigo-700' : 'hover:bg-indigo-600'}`}
            >
              <span className="min-w-[20px]">{item.icon}</span>
              <span className="whitespace-nowrap opacity-0 group-hover:opacity-100 group-hover:ml-1 transition-all duration-300">
                {item.name}
              </span>
            </li>
          </Link>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
