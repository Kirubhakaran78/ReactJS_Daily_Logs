import React from 'react';

const RightMenu = ({ activeMenuGroup, activeMenuItem, onMenuItemClick, showRightMenu, onClose }) => {
  const menuItems = {
    ftpdataview: [
      { id: 'dataexplorer', name: 'Data Explorer', multilingual: 'dataexplorer' },
      { id: 'searchserverdata', name: 'Search Server Data', multilingual: 'searchserverdata' },
      { id: 'searchparseddata', name: 'Search Parsed Data', multilingual: 'searchparseddata', hidden: true }
    ],
    basemaster: [
      { id: 'basemaster', name: 'Base Master', multilingual: 'basemaster' },
      { id: 'tagwizard', name: 'Template and Tags', multilingual: 'templateandtags' },
      { id: 'parentparserkey', name: 'Parent Parser Key', multilingual: 'parentparserkey' }
    ],
    ftp: [
      { id: 'ftpconfig', name: 'FTP Configuration', multilingual: 'configuration' },
      { id: 'FTPrights', name: 'FTP Rights', multilingual: 'rights' }
    ],
    users: [
      { id: 'userwizard', name: 'User Management', multilingual: 'usermanagement' },
      { id: 'passwordpolicy', name: 'Password Policy', multilingual: 'passwordpolicy' },
      { id: 'schedulerrights', name: 'Scheduler Rights', multilingual: 'schedulerrights', hide: 'user-rights-hide' }
    ],
    preferences: [
      { id: 'preference', name: 'Preference', multilingual: 'preferences' },
      { id: 'license', name: 'License Information', multilingual: 'licenseinformation' },
      { id: 'workflow', name: 'WorkFlow Setup', multilingual: 'workflowsetup' },
      { id: 'audittrailconfiguration', name: 'Audit Trail Configuration', multilingual: 'audittrailconfiguration' },
      { id: 'maintenance', name: 'Maintenance', multilingual: 'maintenance' }
    ],
    lock: [
      { id: 'instrumentlock', name: 'Instrument Lock Settings', multilingual: 'instrumentlocksettings' }
    ],
    scheduler: [
      { id: 'datascheduler', name: 'Data Scheduler', multilingual: 'datascheduler' },
      { id: 'vieweditscheduler', name: 'View/Edit Scheduler', multilingual: 'vieweditscheduler' },
      { id: 'monitorscheduler', name: 'Monitor Scheduler', multilingual: 'monitorscheduler' },
      { id: 'localfiledeletescheduler', name: 'Local File Delete Scheduler', multilingual: 'localfiledeletescheduler' },
      { id: 'serverfiledeletescheduler', name: 'Server File Delete Scheduler', multilingual: 'serverfiledeletescheduler' },
      { id: 'downloadscheduler', name: 'Download Scheduler', multilingual: 'downloadscheduler' },
      { id: 'logilabeln', name: 'LogiLab ELN', multilingual: 'logilabeln', hidden: true },
      { id: 'clientbasedmonitor', name: 'Client Based Monitor', multilingual: 'clientbasedmonitor' }
    ],
    audittrail: [
      { id: 'audittrailhistory', name: 'AuditTrail History', multilingual: 'audittrailhistory' },
      { id: 'auditdownloadlogs', name: 'Download Logs', multilingual: 'downloadlogs' },
      { id: 'audituploadlogs', name: 'Upload Logs', multilingual: 'uploadlogs' },
      { id: 'auditrestorelogs', name: 'Restore Logs', multilingual: 'restorelogs' },
      { id: 'ftpserverlocaldeletelogs', name: 'Server & Local File Delete Logs', multilingual: 'serverlocalfiledeletelogs' },
      { id: 'schedulerlogs', name: 'Scheduler Config Logs', multilingual: 'schedulerconfiglogs' },
      { id: 'auditinstrumentlogs', name: 'Instrument Logs', multilingual: 'instrumentlogs' }
    ]
  };

  const getMenuTitle = (groupName) => {
    const titles = {
      ftpdataview: 'FTP Data View',
      basemaster: 'Masters',
      ftp: 'FTP',
      users: 'User Management',
      preferences: 'Settings',
      lock: 'Lock Setting',
      scheduler: 'Scheduler',
      audittrail: 'Logs History'
    };
    return titles[groupName] || groupName;
  };

  const currentMenuItems = menuItems[activeMenuGroup] || [];

  return (
    <div 
      id="rightmenuitem" 
      className="leftmenuitem space-prl pull-left" 
      style={{
        width: '16%', 
        left: '4.5%', 
        top: '0px', 
        zIndex: 999, 
        position: 'absolute', 
        overflow: 'auto', 
        display: showRightMenu ? 'block' : 'none'
      }}
    >
      <div 
        id={`${activeMenuGroup}_menu_child`}
        className={`child_menu_group ${activeMenuGroup ? '' : 'dp-none'}`}
      >
        <li className="rightmenu_header">
          <span multilingual={activeMenuGroup}>{getMenuTitle(activeMenuGroup)}</span>
          <button 
            className="rightmenu-close-btn"
            onClick={onClose}
            title="Close menu"
          >
            ×
          </button>
        </li>
        <ul>
          {currentMenuItems.map((item) => (
            <li 
              key={item.id}
              id={`${item.id}_childmenu_item`}
              className={activeMenuItem === item.id ? 'circle-active' : 'de-circle-active'}
              onClick={() => onMenuItemClick(item.id)}
              style={{display: item.hidden ? 'none' : 'block'}}
            >
              <span multilingual={item.multilingual}>{item.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RightMenu;
