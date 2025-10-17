import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../Common/Context/AuthContext';
import { useNavigate } from 'react-router-dom';

const TopMenu = ({ onSidebarToggle, isSidebarCollapsed }) => {
  const [showLogoutMenu, setShowLogoutMenu] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const handleLogoutMenuToggle = () => {
    setShowLogoutMenu(!showLogoutMenu);
  };

  const handleLogout = () => {
    logout();
    navigate('/Login');
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowLogoutMenu(false);
      }
    };

    if (showLogoutMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showLogoutMenu]);

  const handleEditProfile = () => {
    console.log('Edit Profile clicked');
  };

  const handleChangePassword = () => {
    console.log('Change Password clicked');
  };

  const handleApplicationLock = () => {
    console.log('Application Lock clicked');
  };

  const handleUpdateLicense = () => {
    console.log('Update License clicked');
  };

  const handleSwaggerApi = () => {
    console.log('Swagger API clicked');
  };

  const handleApplicationInfo = () => {
    console.log('Application Info clicked');
  };

  return (
    <div className="top-menu-container">
      <div className="top-menu-content">
        <div className="top-left-section">
          <button className="sidebar-toggle-btn" onClick={onSidebarToggle}>
          <i className="fa fa-angle-double-right"></i> 
          </button>
          <div className="page-title">User Management</div>
        </div>
        
        <div className="system-info-section">
          <div className="info-item">
            <span className="info-label">Time Zone:</span>
            <span className="info-value">{user?.timezone || ''}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Domain:</span>
            <span className="info-value">{user?.domain || ''}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Site:</span>
            <span className="info-value">{user?.site || ''}</span>
          </div>
          <div className="user-section" ref={dropdownRef}>
          <div className="user-info">
            <span className="username">{user?.username || ''}</span>
            <i className="fa fa-angle-down dropdown-arrow" onClick={handleLogoutMenuToggle}></i>
          </div>
          
          {showLogoutMenu && (
            <div className="user-dropdown">
              <div className="dropdown-item" onClick={handleEditProfile}>
                <i className="fa fa-user"></i>
                <span>Edit Profile</span>
              </div>
              <div className="dropdown-item" onClick={handleChangePassword}>
                <i className="fa fa-key"></i>
                <span>Change Password</span>
              </div>
              <div className="dropdown-item" onClick={handleApplicationLock}>
                <i className="fa fa-lock"></i>
                <span>Screen Lock</span>
              </div>
              <div className="dropdown-item" onClick={handleSwaggerApi}>
                <i className="fa fa-rocket"></i>
                <span>API</span>
              </div>
              <div className="dropdown-item" onClick={handleApplicationInfo}>
                <i className="fa fa-info"></i>
                <span>About</span>
              </div>
              <div className="dropdown-item" onClick={handleLogout}>
                <i className="fa fa-sign-out"></i>
                <span>Logout</span>
              </div>
            </div>
          )}
        </div>
        </div>
        
  
      </div>
    </div>
  );
};

export default TopMenu;