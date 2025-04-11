import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const SidebarIcon = ({ icon: Icon, label, to, collapsed, active }) => (
  <li className={`my-1 ${active ? 'bg-indigo-100 text-indigo-900 font-semibold' : 'hover:bg-indigo-50'} rounded-md`}>
    <Link to={to} className="flex items-center gap-3 px-4 py-2 transition-colors">
      <Icon />
      {!collapsed && <span>{label}</span>}
    </Link>
  </li>
);

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <div className={`flex flex-col h-screen bg-gradient-to-b from-indigo-50 to-blue-100 shadow-md transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'}`}>
      <div className="flex items-center justify-between px-4 py-3 border-b border-indigo-200">
        <h1 className="text-lg font-bold text-indigo-700">{collapsed ? 'QL' : 'Quản Lý'}</h1>
        <button onClick={() => setCollapsed(!collapsed)} className="text-indigo-600 hover:text-indigo-800">
          {collapsed ? '→' : '←'}
        </button>
      </div>

      <ul className="flex-1 px-2 pt-4 space-y-1">
        <SidebarIcon to="/dashboard" icon={DashboardIcon} label="Dashboard" collapsed={collapsed} active={location.pathname === '/dashboard'} />
        <SidebarIcon to="/manage" icon={TasksIcon} label="Quản lý" collapsed={collapsed} active={location.pathname === '/manage'} />
        <SidebarIcon to="/reports" icon={ReportIcon} label="Báo cáo" collapsed={collapsed} active={location.pathname === '/reports'} />
        <SidebarIcon to="/plans" icon={PlanIcon} label="Kế hoạch" collapsed={collapsed} active={location.pathname === '/plans'} />
        <SidebarIcon to="/statistics" icon={StatsIcon} label="Thống kê" collapsed={collapsed} active={location.pathname === '/statistics'} />
      </ul>
    </div>
  );
};

const DashboardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="9" /><rect x="14" y="3" width="7" height="5" /><rect x="14" y="12" width="7" height="9" /><rect x="3" y="16" width="7" height="5" />
  </svg>
);
const TasksIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
  </svg>
);
const ReportIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
  </svg>
);
const PlanIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);
const StatsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /><line x1="3" y1="20" x2="21" y2="20" />
  </svg>
);

export default Sidebar;
