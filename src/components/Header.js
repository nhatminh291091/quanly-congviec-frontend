import React, { useContext } from 'react';
import AuthContext from '../contexts/AuthContext';

const Header = ({ title }) => {
  const { user } = useContext(AuthContext);
  
  return (
    <header className="header">
      <h1 className="header-title">{title}</h1>
      <div className="header-actions">
        <div className="notification-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
        </div>
        <div className="user-profile">
          <span className="user-name">{user?.name || 'Người dùng'}</span>
          <div className="avatar">
            {user?.name?.charAt(0) || 'U'}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
