import React, { useState, useEffect, useRef } from 'react';
import LeftMenu from './Components/MainLayout/LeftMenu';
import TopMenu from './Components/MainLayout/TopMenu';
import ContentArea from './Components/MainLayout/MainLayout';
import TimeoutPopup from './Components/Common/PopupScreens/Timeout/TimeoutPopup';
import { useAuth } from './Components/Common/Context/AuthContext';
import { CF_encrypt } from './Components/Common/EncrptDecrpt/encryption';
import { postAPI } from './Services/apicall';


const Home = () => {
  const [activeMenuGroup, setActiveMenuGroup] = useState('users');
  const [activeMenuItem, setActiveMenuItem] = useState('userwizard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [showRightMenu, setShowRightMenu] = useState(true);
  const [showTimeoutPopup, setShowTimeoutPopup] = useState(false);
  
  const { user, login } = useAuth();
  const timeoutRef = useRef(null);
  const lastActivityRef = useRef(Date.now());

  const handleMenuGroupClick = (menuGroup) => {
    setActiveMenuGroup(menuGroup);
    // Set default menu item based on group
    if (menuGroup === 'users') {
      setActiveMenuItem('userwizard');
    } else {
      setActiveMenuItem(menuGroup);
    }
  };

  const handleSidebarToggle = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleMenuItemClick = (menuItem) => {
    setActiveMenuItem(menuItem);
  };

  const handleRightMenuClose = () => {
    setShowRightMenu(false);
  };

  const handleTextOverlayClose = () => {
    setIsSidebarCollapsed(true);
  };

  // Activity tracking functions
  const resetTimeout = () => {
    lastActivityRef.current = Date.now();
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Set timeout for 45 seconds
    timeoutRef.current = setTimeout(() => {
      setShowTimeoutPopup(true);
    }, 120000); // 45 seconds
  };

  const handleActivity = () => {
    resetTimeout();
  };

  // Login function for timeout popup
  const handleTimeoutLogin = async (username, password) => {
    try {
      const loginData = {
        "ApplicationCode": "UserManagement",
        "loginObj": {
          "sUsername": username,
          "sPassword": password,
          "sDomainName": user?.domain || 'SDMS',
          "sCategories": user?.categories || 'DB',
          "sSiteCode": user?.site || '',
          "sClientMachineName": "Windows 10",
          "bScreenLock": false
        },
        "sLoginFrom": "UserManagement",
        "sAvailableLicenseURL": "http://AGL66:8095/LicenseAPI/License/getAvailableLicenseCount"
      };

      const objdata = { "passObj": CF_encrypt(JSON.stringify(loginData)) };
      const rows = await postAPI(objdata, "Login/Login", true);
      const row = JSON.parse(rows);

      if (row.Resp.Sts === "1") {
        const userData = row.Resp.desc.oResObj || row.Resp.desc;
        if (userData && userData.bStatus !== false) {
          // Update auth context with new session
          const sessionData = {
            ...user,
            loginTime: new Date().toISOString(),
            userData: userData,
            loginObj: loginData.loginObj
          };
          login(sessionData);
          return true;
        } else {
          throw new Error(userData?.sInformation || 'Login failed');
        }
      } else {
        throw new Error(row.Resp.Msg || 'Login failed');
      }
    } catch (error) {
      console.error('Timeout login failed:', error);
      throw error;
    }
  };

  // Setup activity tracking
  useEffect(() => {
    // Initial timeout setup
    resetTimeout();

    // Activity event listeners
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    events.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    // Cleanup
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Reset timeout when popup is closed
  const handleTimeoutPopupClose = () => {
    setShowTimeoutPopup(false);
    resetTimeout();
  };

  return (
    <div className="home-container">
   
      <div className="main-content-wrapper">
        <LeftMenu 
          activeMenuGroup={activeMenuGroup} 
          onMenuGroupClick={handleMenuGroupClick}
          isCollapsed={isSidebarCollapsed}
          onTextOverlayClose={handleTextOverlayClose}
        />
  
        
        <div className="right-content-area">
          <TopMenu 
            onSidebarToggle={handleSidebarToggle}
            isSidebarCollapsed={isSidebarCollapsed}
          />
          
          <ContentArea 
            activeMenuItem={activeMenuItem}
            isSidebarCollapsed={isSidebarCollapsed}
          />
        </div>
      </div>
     
      {/* Floating Chat Button */}
      <div className="floating-chat">
        <i className="fa fa-comment"></i>
      </div>

      {/* Timeout Popup */}
      {showTimeoutPopup && (
        <TimeoutPopup 
          onClose={handleTimeoutPopupClose}
          onLogin={handleTimeoutLogin}
        />
      )}
  
    </div>
  );
};

export default Home;
