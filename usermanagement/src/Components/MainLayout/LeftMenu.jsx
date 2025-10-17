import React, { useState } from 'react';

const LeftMenu = ({ activeMenuGroup, onMenuGroupClick, isCollapsed, onTextOverlayClose, onSubmenuClick }) => {
  const [activeSubmenu, setActiveSubmenu] = useState(null);

  const handleSubmenuClick = (submenuId) => {
    setActiveSubmenu(submenuId);
    if (onSubmenuClick) {
      onSubmenuClick(submenuId);
    }
  };

  const handleMenuGroupClick = (groupId) => {
    // Reset submenu selection when switching groups
    setActiveSubmenu(null);
    onMenuGroupClick(groupId);
    
    // Auto-select first submenu item if available
    const currentGroup = menuGroups.find(group => group.id === groupId);
    if (currentGroup && currentGroup.submenu.length > 0) {
      const firstSubmenu = currentGroup.submenu[0];
      setActiveSubmenu(firstSubmenu.id);
      if (onSubmenuClick) {
        onSubmenuClick(firstSubmenu.id);
      }
    }
  };

  const menuGroups = [
    { 
      id: 'users', 
      icon: 'fa fa-user', 
      name: 'Users Management',
      submenu: [
        { id: 'usergroup', name: 'User Management' },

        { id: 'passwordpolicy', name: 'Password Policy' }
      ] 
    },
    { 
      id: 'preferences', 
      icon: 'fa fa-cog', 
      name: 'Preferences',
      submenu: [] 
    }
  ];

  return (
    <div className="left-menu-container">
      {/* Side Menu */}
      <div className="menu-items">
        {menuGroups.map((group) => (
          <div 
            key={group.id}
            className={`menu-item ${activeMenuGroup === group.id ? 'active' : ''}`}
            onClick={() => handleMenuGroupClick(group.id)}
            title={group.name}
          >
            <i className={group.icon}></i>
            {activeMenuGroup === group.id && <div className="active-indicator"></div>}
          </div>
        ))}
      </div>
      
      {/* Profile Section */}
      <div className="bottom-section">
        <div className="profile-icon">
          <i className="fa fa-user"></i>
        </div>
      </div>
      
      {/* Text Overlay Panel */}
      {!isCollapsed && (
        <div className="text-overlay-panel">
          <button 
            className="text-overlay-close-btn"
            onClick={onTextOverlayClose}
            title="Close text overlay"
          >
            <i className="fa fa-angle-double-left"></i> 
          </button>

          <div className="overlay-content">
            {menuGroups.map((group) => (
              <div 
                key={group.id}
                className={`overlay-item ${activeMenuGroup === group.id ? 'active' : ''}`}
              >
                {/* Show ONLY submenu when active */}
                {activeMenuGroup === group.id && group.submenu.length > 0 && (
                  <div style={{marginTop:'10px'}}>
                    {group.submenu.map((sub) => (
                      <div 
                        key={sub.id} 
                        className={`submenu-item ${activeSubmenu === sub.id ? 'active' : ''}`}
                        style={{
                          marginTop:'15px',
                          padding: '8px',
                          cursor: 'pointer',
                          borderRadius: '4px',
                          transition: 'all 0.3s ease',
                          color: activeSubmenu === sub.id ? '#0049B0' : '#333333',
                          backgroundColor: activeSubmenu === sub.id ? '#E5E8EC' : 'transparent'
                        }}
                        onClick={() => handleSubmenuClick(sub.id)}
                      >
                        {sub.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LeftMenu;
