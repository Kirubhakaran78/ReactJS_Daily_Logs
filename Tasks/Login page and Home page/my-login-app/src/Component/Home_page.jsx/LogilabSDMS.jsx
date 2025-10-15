import React, { useState } from 'react';

const LogilabSDMS = () => {
  const [activeTab, setActiveTab] = useState('serverData');
  const [activeSidebar, setActiveSidebar] = useState(null);

  const sidebarItems = [
    { 
      icon: '🏠', 
      label: 'Home', 
      id: 'home',
      submenu: ['Dashboard', 'Overview', 'Quick Access']
    },
    { 
      icon: '📁', 
      label: 'Files', 
      id: 'files',
      submenu: ['Data Explorer', 'Search Server Data', 'File Manager', 'Recent Files']
    },
    { 
      icon: '👥', 
      label: 'Users', 
      id: 'users',
      submenu: ['User Management', 'Roles & Permissions', 'User Groups']
    },
    { 
      icon: '📄', 
      label: 'Documents', 
      id: 'documents',
      submenu: ['All Documents', 'Templates', 'Archives']
    },
    { 
      icon: '👤', 
      label: 'Profile', 
      id: 'profile',
      submenu: ['My Profile', 'Settings', 'Preferences']
    },
    { 
      icon: '⚙️', 
      label: 'Settings', 
      id: 'settings',
      submenu: ['General Settings', 'System Config', 'Advanced']
    }
  ];

  const handleSidebarItemClick = (id) => {
    if (activeSidebar === id) {
      setActiveSidebar(null);
    } else {
      setActiveSidebar(id);
    }
  };

  const activeItem = sidebarItems.find(item => item.id === activeSidebar);

  return (
    <div style={styles.container}>
      {/* Main Sidebar - Icon Bar */}
      <div style={styles.sidebar}>
        {sidebarItems.map((item) => (
          <div
            key={item.id}
            onClick={() => handleSidebarItemClick(item.id)}
            style={{
              ...styles.sidebarItem,
              backgroundColor: activeSidebar === item.id ? '#2563eb' : 'transparent'
            }}
            onMouseEnter={(e) => {
              if (activeSidebar !== item.id) {
                e.currentTarget.style.backgroundColor = '#1e40af';
              }
            }}
            onMouseLeave={(e) => {
              if (activeSidebar !== item.id) {
                e.currentTarget.style.backgroundColor = 'transparent';
              }
            }}
          >
            <span style={styles.sidebarIcon}>{item.icon}</span>
          </div>
        ))}
      </div>

      {/* Secondary Sidebar - Submenu */}
      {activeSidebar && (
        <div style={styles.secondarySidebar}>
          <div style={styles.secondarySidebarHeader}>
            <span style={styles.secondarySidebarTitle}>
              {activeItem?.label}
            </span>
            <button 
              style={styles.closeButton}
              onClick={() => setActiveSidebar(null)}
            >
              ×
            </button>
          </div>
          <div style={styles.submenuContainer}>
            {activeItem?.submenu.map((submenuItem, index) => (
              <div
                key={index}
                style={styles.submenuItem}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                {submenuItem}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div style={styles.mainContent}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerLeft}>
            <div style={styles.logo}>L</div>
            <div>
              <div style={styles.logoTitle}>Logilab</div>
              <div style={styles.logoSubtitle}>SDMS</div>
            </div>
          </div>
          <div style={styles.headerRight}>
            <span style={styles.headerInfo}>Time Zone: Asia/Kolkata (UTC+05:30)</span>
            <span style={styles.headerInfo}>Domain: SDMS</span>
            <span style={styles.headerInfo}>Site: chennai</span>
            <div style={styles.userInfo}>
              <div style={styles.userName}>Administrator</div>
              <div style={styles.userRole}>Administrator</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={styles.tabsContainer}>
          <div style={styles.tabs}>
            <button
              style={{
                ...styles.tab,
                ...(activeTab === 'serverData' ? styles.activeTab : {})
              }}
              onClick={() => setActiveTab('serverData')}
            >
              Server Data
            </button>
            <button
              style={{
                ...styles.tab,
                ...(activeTab === 'templateView' ? styles.activeTab : {})
              }}
              onClick={() => setActiveTab('templateView')}
            >
              Template View
            </button>
            <button
              style={{
                ...styles.tab,
                ...(activeTab === 'dataLogger' ? styles.activeTab : {})
              }}
              onClick={() => setActiveTab('dataLogger')}
            >
              Data Logger
            </button>
          </div>
        </div>

        {/* Filter Section */}
        <div style={styles.filterSection}>
          <div style={styles.filterRow}>
            <div style={styles.filterGroup}>
              <label style={styles.label}>Storage Group</label>
              <select style={styles.select}>
                <option>File01</option>
              </select>
            </div>
            <div style={styles.filterGroup}>
              <label style={styles.label}>Client</label>
              <select style={styles.select}>
                <option>All</option>
              </select>
            </div>
            <div style={styles.filterGroup}>
              <label style={styles.label}>Instrument</label>
              <select style={styles.select}>
                <option>All</option>
              </select>
            </div>
            <div style={styles.filterGroup}>
              <label style={styles.label}>Task Status</label>
              <select style={styles.select}>
                <option>All</option>
              </select>
            </div>
          </div>

          <div style={styles.filterRow}>
            <div style={styles.filterGroup}>
              <label style={styles.label}>Records Duration</label>
              <select style={styles.select}>
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
                <option>Last 90 Days</option>
              </select>
            </div>
            <div style={styles.filterGroup}>
              <label style={styles.checkboxContainer}>
                <input type="checkbox" style={styles.checkbox} />
                <span style={styles.checkboxLabel}>Hide Empty Folder</span>
              </label>
            </div>
            <div style={styles.filterGroup}>
              <label style={styles.label}>Workflow Status</label>
              <select style={styles.select}>
                <option>All</option>
              </select>
            </div>
            <div style={styles.filterGroup}></div>
          </div>

          {/* Action Buttons */}
          <div style={styles.buttonRow}>
            <button style={{...styles.button, ...styles.primaryButton}}>
              🔍 Filter
            </button>
            <button style={{...styles.button, ...styles.secondaryButton}}>
              ↻ Reset
            </button>
            <button style={{...styles.button, ...styles.infoButton}}>
              ⟳ Refresh
            </button>
            <button style={{...styles.button, ...styles.secondaryButton}}>
              ⚙️ Configuration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    height: '100vh',
    backgroundColor: '#f5f5f5',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
  },
  sidebar: {
    width: '60px',
    backgroundColor: '#1e3a8a',
    display: 'flex',
    flexDirection: 'column',
    padding: '10px 0'
  },
  sidebarItem: {
    padding: '15px',
    color: 'white',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.2s',
    position: 'relative'
  },
  sidebarIcon: {
    fontSize: '24px'
  },
  secondarySidebar: {
    width: '220px',
    backgroundColor: 'white',
    borderRight: '1px solid #e5e7eb',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '2px 0 8px rgba(0,0,0,0.1)',
    animation: 'slideIn 0.3s ease-out'
  },
  secondarySidebarHeader: {
    padding: '16px',
    borderBottom: '1px solid #e5e7eb',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f9fafb'
  },
  secondarySidebarTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#111827'
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '24px',
    color: '#6b7280',
    cursor: 'pointer',
    padding: '0',
    width: '24px',
    height: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '4px',
    transition: 'background-color 0.2s'
  },
  submenuContainer: {
    padding: '8px 0'
  },
  submenuItem: {
    padding: '12px 20px',
    fontSize: '14px',
    color: '#374151',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    borderLeft: '3px solid transparent'
  },
  mainContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    backgroundColor: 'white'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 20px',
    borderBottom: '1px solid #e5e7eb',
    backgroundColor: 'white'
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  logo: {
    width: '40px',
    height: '40px',
    backgroundColor: '#3b82f6',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: 'bold',
    fontSize: '20px'
  },
  logoTitle: {
    fontWeight: 'bold',
    fontSize: '18px',
    color: '#111827'
  },
  logoSubtitle: {
    fontSize: '11px',
    color: '#6b7280'
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px'
  },
  headerInfo: {
    fontSize: '13px',
    color: '#6b7280'
  },
  userInfo: {
    backgroundColor: '#e5e7eb',
    padding: '8px 12px',
    borderRadius: '6px'
  },
  userName: {
    fontWeight: '600',
    fontSize: '13px',
    color: '#111827'
  },
  userRole: {
    fontSize: '11px',
    color: '#6b7280'
  },
  tabsContainer: {
    backgroundColor: 'white',
    borderBottom: '1px solid #e5e7eb',
    padding: '0 20px'
  },
  tabs: {
    display: 'flex',
    gap: '0'
  },
  tab: {
    padding: '12px 20px',
    backgroundColor: 'transparent',
    border: 'none',
    borderBottom: '2px solid transparent',
    color: '#6b7280',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontWeight: 'normal'
  },
  activeTab: {
    color: '#3b82f6',
    borderBottom: '2px solid #3b82f6',
    fontWeight: '600'
  },
  filterSection: {
    backgroundColor: 'white',
    padding: '20px',
    margin: '20px',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  },
  filterRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '15px',
    marginBottom: '15px'
  },
  filterGroup: {
    display: 'flex',
    flexDirection: 'column'
  },
  label: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '6px'
  },
  select: {
    padding: '6px 10px',
    fontSize: '13px',
    border: '1px solid #d1d5db',
    borderRadius: '4px',
    backgroundColor: 'white',
    color: '#111827',
    cursor: 'pointer'
  },
  checkboxContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginTop: '28px',
    cursor: 'pointer'
  },
  checkbox: {
    width: '16px',
    height: '16px',
    cursor: 'pointer'
  },
  checkboxLabel: {
    fontSize: '13px',
    color: '#374151'
  },
  buttonRow: {
    display: 'flex',
    gap: '10px',
    marginTop: '15px'
  },
  button: {
    padding: '8px 16px',
    fontSize: '13px',
    border: '1px solid',
    borderRadius: '4px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    transition: 'all 0.2s',
    fontWeight: '500'
  },
  primaryButton: {
    backgroundColor: 'white',
    borderColor: '#3b82f6',
    color: '#3b82f6'
  },
  secondaryButton: {
    backgroundColor: 'white',
    borderColor: '#d1d5db',
    color: '#6b7280'
  },
  infoButton: {
    backgroundColor: 'white',
    borderColor: '#06b6d4',
    color: '#06b6d4'
  }
};

export default LogilabSDMS;