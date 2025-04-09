import React, { useState, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

// Icons
const DashboardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="9"></rect>
    <rect x="14" y="3" width="7" height="5"></rect>
    <rect x="14" y="12" width="7" height="9"></rect>
    <rect x="3" y="16" width="7" height="5"></rect>
  </svg>
);

const TasksIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 11l3 3L22 4"></path>
    <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"></path>
  </svg>
);

const ReportIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
    <polyline points="10 9 9 9 8 9"></polyline>
  </svg>
);

const PlanIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

const StatsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10"></line>
    <line x1="12" y1="20" x2="12" y2="4"></line>
    <line x1="6" y1="20" x2="6" y2="14"></line>
    <line x1="3" y1="20" x2="21" y2="20"></line>
  </svg>
);

const LogoutIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"></path>
    <polyline points="16 17 21 12 16 7"></polyline>
    <line x1="21" y1="12" x2="9" y2="12"></line>
  </svg>
);

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path;
  };
  
  const isManager = user && user.role === 'manager';
  
  return (
    <div className={`sidebar ${collapsed ? 'sidebar-collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="logo">
          {collapsed ? 'QL' : 'Quản Lý Công Việc'}
        </div>
        <button 
          className="btn btn-icon sidebar-toggle" 
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? '→' : '←'}
        </button>
      </div>
      
      <div className="sidebar-user">
        {!collapsed && (
          <>
            <div className="user-avatar">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="user-info">
              <div className="user-name">{user?.name || 'User'}</div>
              <div className="user-role">{isManager ? 'Quản lý' : 'Chuyên viên'}</div>
            </div>
          </>
        )}
      </div>
      
      <nav className="sidebar-nav">
        <ul>
          <li className={isActive('/dashboard') ? 'active' : ''}>
            <Link to="/dashboard">
              <DashboardIcon />
              {!collapsed && <span>Dashboard</span>}
            </Link>
          </li>
          
          {isManager && (
            <li className={isActive('/manage') ? 'active' : ''}>
              <Link to="/manage">
                <TasksIcon />
                {!collapsed && <span>Quản lý</span>}
              </Link>
            </li>
          )}
          
          <li className={isActive('/reports') ? 'active' : ''}>
            <Link to="/reports">
              <ReportIcon />
              {!collapsed && <span>Báo cáo</span>}
            </Link>
          </li>
          
          <li className={isActive('/plans') ? 'active' : ''}>
            <Link to="/plans">
              <PlanIcon />
              {!collapsed && <span>Kế hoạch</span>}
            </Link>
          </li>
          
          {isManager && (
            <li className={isActive('/statistics') ? 'active' : ''}>
              <Link to="/statistics">
                <StatsIcon />
                {!collapsed && <span>Thống kê</span>}
              </Link>
            </li>
          )}
        </ul>
      </nav>
      
      <div className="sidebar-footer">
        <button className="btn btn-icon logout-btn" onClick={logout}>
          <LogoutIcon />
          {!collapsed && <span>Đăng xuất</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
