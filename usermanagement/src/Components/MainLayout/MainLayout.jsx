import React from 'react';
import Main from '../UserManagement/Main';



const ContentArea = ({ activeMenuItem, isSidebarCollapsed }) => {
  const contentComponents = {
    userwizard: <Main />,
    auditinstrumentlogs: <AuditInstrumentLogsContent />
  };

  return (
    <div className={`content-area ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <div className="content-scrollable">
        {Object.entries(contentComponents).map(([key, component]) => (
          <div 
            key={key}
            className={`content-group ${activeMenuItem === key ? 'active' : 'hidden'}`}
          >
            {activeMenuItem === key ? component : null}
          </div>
        ))}
      </div>
    </div>
  );
};

// Placeholder content components - these would be implemented with actual functionality
const DataExplorerContent = () => (
  <div>
    <h3>Data Explorer</h3>
    <p>Data Explorer content goes here...</p>
  </div>
);

const SearchServerDataContent = () => (
  <div>
    <h3>Search Server Data</h3>
    <p>Search Server Data content goes here...</p>
  </div>
);

const SearchParsedDataContent = () => (
  <div>
    <h3>Search Parsed Data</h3>
    <p>Search Parsed Data content goes here...</p>
  </div>
);

const BaseMasterContent = () => (
  <div>
    <h3>Base Master</h3>
    <p>Base Master content goes here...</p>
  </div>
);

const TagWizardContent = () => (
  <div>
    <h3>Template and Tags</h3>
    <p>Template and Tags content goes here...</p>
  </div>
);

const ParentParserKeyContent = () => (
  <div>
    <h3>Parent Parser Key</h3>
    <p>Parent Parser Key content goes here...</p>
  </div>
);

const FTPConfigContent = () => (
  <div>
    <h3>FTP Configuration</h3>
    <p>FTP Configuration content goes here...</p>
  </div>
);

const FTPRightsContent = () => (
  <div>
    <h3>FTP Rights</h3>
    <p>FTP Rights content goes here...</p>
  </div>
);

const UserWizardContent = () => (
  <div className="user-management-container">
    <div className="sub-menu">
      <div className="sub-menu-item active">User Management</div>
      <div className="sub-menu-item">Password Policy</div>
    </div>
    
    <div className="main-content">
      <div className="content-placeholder">
        <p>No data to display</p>
      </div>
    </div>
  </div>
);

const PasswordPolicyContent = () => (
  <div className="user-management-container">
    <div className="sub-menu">
      <div className="sub-menu-item">User Management</div>
      <div className="sub-menu-item active">Password Policy</div>
    </div>
    
    <div className="main-content">
      <div className="content-placeholder">
        <p>Password Policy content goes here...</p>
      </div>
    </div>
  </div>
);

const SchedulerRightsContent = () => (
  <div>
    <h3>Scheduler Rights</h3>
    <p>Scheduler Rights content goes here...</p>
  </div>
);

const PreferenceContent = () => (
  <div>
    <h3>Preference</h3>
    <p>Preference content goes here...</p>
  </div>
);

const LicenseContent = () => (
  <div>
    <h3>License Information</h3>
    <p>License Information content goes here...</p>
  </div>
);

const WorkflowContent = () => (
  <div>
    <h3>WorkFlow Setup</h3>
    <p>WorkFlow Setup content goes here...</p>
  </div>
);

const AuditTrailConfigurationContent = () => (
  <div>
    <h3>Audit Trail Configuration</h3>
    <p>Audit Trail Configuration content goes here...</p>
  </div>
);

const MaintenanceContent = () => (
  <div>
    <h3>Maintenance</h3>
    <p>Maintenance content goes here...</p>
  </div>
);

const InstrumentLockContent = () => (
  <div>
    <h3>Instrument Lock Settings</h3>
    <p>Instrument Lock Settings content goes here...</p>
  </div>
);

const DataSchedulerContent = () => (
  <div>
    <h3>Data Scheduler</h3>
    <p>Data Scheduler content goes here...</p>
  </div>
);

const ViewEditSchedulerContent = () => (
  <div>
    <h3>View/Edit Scheduler</h3>
    <p>View/Edit Scheduler content goes here...</p>
  </div>
);

const MonitorSchedulerContent = () => (
  <div>
    <h3>Monitor Scheduler</h3>
    <p>Monitor Scheduler content goes here...</p>
  </div>
);

const LocalFileDeleteSchedulerContent = () => (
  <div>
    <h3>Local File Delete Scheduler</h3>
    <p>Local File Delete Scheduler content goes here...</p>
  </div>
);

const ServerFileDeleteSchedulerContent = () => (
  <div>
    <h3>Server File Delete Scheduler</h3>
    <p>Server File Delete Scheduler content goes here...</p>
  </div>
);

const DownloadSchedulerContent = () => (
  <div>
    <h3>Download Scheduler</h3>
    <p>Download Scheduler content goes here...</p>
  </div>
);

const LogiLabELNContent = () => (
  <div>
    <h3>LogiLab ELN</h3>
    <p>LogiLab ELN content goes here...</p>
  </div>
);

const ClientBasedMonitorContent = () => (
  <div>
    <h3>Client Based Monitor</h3>
    <p>Client Based Monitor content goes here...</p>
  </div>
);

const AuditTrailHistoryContent = () => (
  <div>
    <h3>AuditTrail History</h3>
    <p>AuditTrail History content goes here...</p>
  </div>
);

const AuditDownloadLogsContent = () => (
  <div>
    <h3>Download Logs</h3>
    <p>Download Logs content goes here...</p>
  </div>
);

const AuditUploadLogsContent = () => (
  <div>
    <h3>Upload Logs</h3>
    <p>Upload Logs content goes here...</p>
  </div>
);

const AuditRestoreLogsContent = () => (
  <div>
    <h3>Restore Logs</h3>
    <p>Restore Logs content goes here...</p>
  </div>
);

const FTPServerLocalDeleteLogsContent = () => (
  <div>
    <h3>Server & Local File Delete Logs</h3>
    <p>Server & Local File Delete Logs content goes here...</p>
  </div>
);

const SchedulerLogsContent = () => (
  <div>
    <h3>Scheduler Config Logs</h3>
    <p>Scheduler Config Logs content goes here...</p>
  </div>
);

const AuditInstrumentLogsContent = () => (
  <div>
    <h3>Instrument Logs</h3>
    <p>Instrument Logs content goes here...</p>
  </div>
);

export default ContentArea;