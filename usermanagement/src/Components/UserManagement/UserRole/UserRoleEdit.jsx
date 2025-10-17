import React, { useState, useEffect, useRef } from 'react'
import CustomPopup from '../../Common/PopupScreens/Editpage/CustomPopup'
import AuditTrailPopup from '../../Common/PopupScreens/Audittrail/AuditTrailPopup'
import { postAPI } from '../../../Services/apicall';
import { CF_encrypt } from '../../Common/EncrptDecrpt/encryption';
import { CF_sessionSet, CF_sessionGet } from '../../Common/CookieSessionStorage/CookieFun';
import { useAuth } from '../../Common/Context/AuthContext';

const UserRoleEdit = ({ isOpen, onClose, selectedGroup, onSave, onRefresh, mode = 'add' }) => {
   const [activeTab, setActiveTab] = useState('usergroup');
    const [sortStatus, setSortStatus] = useState('none');
    const [gridData, setGridData] = useState([]);
      const [getApplist, setgetApplist] = useState([]);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [showAuditTrailPopup, setShowAuditTrailPopup] = useState(false);
    const [pendingGroupData, setPendingGroupData] = useState(null);
      const [newGroupData, setNewGroupData] = useState( {
        "sGroupname": "",
        "sCreatedBy": "",
        "sUserStatus": "Active",
        "sApplicationCodes": []
    },);
    const [showAppDropdown, setShowAppDropdown] = useState(false);
    const dropdownRef = useRef(null);
    const inputRef = useRef(null);
    
    const { user } = useAuth();

  // Function to create AuditTrailValues with time capture and store in session/cookies
  const createAuditTrailValues = (auditData) => {
    const currentTime = new Date();
    const timeString = currentTime.toISOString();
    const localTimeString = currentTime.toLocaleString();
    
    const auditTrailValues = {
      "sUserName": auditData.sUserName || user?.username,
      "sUserPassword": auditData.sUserPassword , // Use provided password or mask
      "sReasonNo": auditData.sReasonNo,
      "sReasonName": auditData.sReasonName ,
      "sComments": auditData.sComments,
      "sUserDomainName": user?.domain,
      "sTimestamp": timeString,
      "sLocalTime": localTimeString,
      "sActionTime": currentTime.getTime().toString()
    };

    // Store in session storage and cookies
    try {
      CF_sessionSet('AuditTrailValues', JSON.stringify(auditTrailValues), 0);
      // Also store individual timestamp values
      CF_sessionSet('sTimestamp', timeString, 0);
      CF_sessionSet('sLocalTime', localTimeString, 0);
      CF_sessionSet('sActionTime', currentTime.getTime().toString(), 0);
      
      console.log('AuditTrailValues stored with time capture:', auditTrailValues);
    } catch (error) {
      console.error('Error storing AuditTrailValues:', error);
    }

    return auditTrailValues;
  };

  // Update form data when selectedGroup changes (for edit mode)
  useEffect(() => {
    debugger
           getAllApplications()
    if (mode === 'edit' && selectedGroup) {
      // Handle both array and comma-separated string formats
      let appCodes = [];
      if (selectedGroup.sApplicationCodes) {
        if (Array.isArray(selectedGroup.sApplicationCodes)) {
          appCodes = selectedGroup.sApplicationCodes;
        } else if (typeof selectedGroup.sApplicationCodes === 'string') {
          appCodes = selectedGroup.sApplicationCodes.split(',').map(s => s.trim()).filter(s => s);
        }
      }
      
      setNewGroupData({
        "id": selectedGroup.id,
        "name": selectedGroup.name || selectedGroup.L01UserGroupName || '',
        "sGroupname": selectedGroup.name || selectedGroup.L01UserGroupName || '',
        "sCreatedBy": selectedGroup.gCreatedBy || "",
        "sUserStatus": selectedGroup.status || selectedGroup.gStatus || 'Active',
        "status": selectedGroup.status || selectedGroup.gStatus || 'Active',
        "sApplicationCodes": appCodes
      });
    } else if (mode === 'add') {
   
      setNewGroupData({
        "id": null,
        "name": "",
        "sGroupname": '',
        "sCreatedBy": "",
        "sUserStatus": 'Active',
        "status": "Active",
        "sApplicationCodes": []
      });
    }

  }, [selectedGroup, mode, isOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showAppDropdown && 
          !event.target.closest('.app-dropdown-container') && 
          dropdownRef.current && 
          !dropdownRef.current.contains(event.target)) {
        setShowAppDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showAppDropdown]);

    const handleClosePopup = () => {
    if (onClose) {
      onClose();
    }
    // Reset form data when closing
    setNewGroupData({
         "sGroupname": "",
        "sCreatedBy": "",
        "sUserStatus": "Active",
        "status": "Active",
        "sApplicationCodes": []
    });
    setShowAppDropdown(false);
  };
  const handleInputChange = (field, value) => {
    setNewGroupData(prev => ({
      ...prev,
      [field]: value,
      // Update both name and sGroupname when name field changes
      ...(field === 'name' && { sGroupname: value }),
      // Update both status and sUserStatus when status field changes
      ...(field === 'sApplicationCodes' && { sUserStatus: value })
    }));
  };

  // Handle application checkbox selection
  const handleAppCheckboxChange = (appCode) => {
    setNewGroupData(prev => {
      const currentApps = prev.sApplicationCodes || [];
      const isSelected = currentApps.includes(appCode);
      
      if (isSelected) {
        // Remove from selection
        return {
          ...prev,
          sApplicationCodes: currentApps.filter(code => code !== appCode)
        };
      } else {
        // Add to selection
        return {
          ...prev,
          sApplicationCodes: [...currentApps, appCode]
        };
      }
    });
  };

  // Toggle dropdown visibility
  const toggleAppDropdown = () => {
    setShowAppDropdown(prev => {
      if (!prev) {
        // Position dropdown when opening
        setTimeout(() => {
          if (inputRef.current && dropdownRef.current) {
            const inputRect = inputRef.current.getBoundingClientRect();
            const dropdown = dropdownRef.current;
            
            dropdown.style.top = `${inputRect.bottom + window.scrollY + 2}px`;
            dropdown.style.left = `${inputRect.left + window.scrollX}px`;
            dropdown.style.width = `${inputRect.width}px`;
          }
        }, 0);
      }
      return !prev;
    });
  };
  

  const handleSaveGroup = async () => {
    // Validate form
    if (!newGroupData.name.trim()) {
      alert('Please enter a group name');
      return;
    }

    // Validate at least one application is selected
    if (!newGroupData.sApplicationCodes || newGroupData.sApplicationCodes.length === 0) {
      alert('Please select at least one application');
      return;
    }

    // Prepare data for save - convert array to comma-separated string if needed
    const groupData = {
      ...newGroupData,
      // Keep as array or convert to string based on API requirement
      // If API expects comma-separated string, uncomment below line:
      // sApplicationCodes: newGroupData.sApplicationCodes.join(',')
    };

    // Store the group data and show audit trail popup
    setPendingGroupData(groupData);
    setShowAuditTrailPopup(true);
  };

  // Handle audit trail form submission
  const handleAuditTrailSubmit = async (auditData) => {
    try {
      debugger
      const groupData = pendingGroupData;
      
      if (mode === "add") {
        // Create AuditTrailValues with user-provided data
        const auditTrailValues = createAuditTrailValues(auditData);
        
        let data = {
          "grpSave": {
            "sGroupname": groupData.sGroupname,
            "sCreatedBy": "",
            "sUserStatus": groupData.sUserStatus,
            "sApplicationCodes": Array.isArray(groupData.sApplicationCodes) 
              ? groupData.sApplicationCodes.join(',') 
              : groupData.sApplicationCodes
          },
          "AuditTrailValues": auditTrailValues,
          "appname": "SDMS",
          "ActiveUserDetails": {
            "sUsername": user?.username,
            "sCategories": user?.categories,
            "sSiteCode": user?.site ,
            "sUserID": user.userdetails.sUserID ,
            "sUserDomainName": user?.domain ,
            "sUserGroupID": selectedGroup.L01UserGroupID,
            "sTimeZoneID": user?.timezone ,
            "sSessionID": user.userdetails.sSessionID ,
            "sUserStatus": "",
            "sApplicationCodes": "UserManagement",
            "sdbtype": user?.sdbtype ,
            "sTenantID": user?.sTenantID
          }
        };
        await CreateUserRole(data);
      } else {
        // Create AuditTrailValues with user-provided data
        const auditTrailValues = createAuditTrailValues(auditData);
        
        let data = {
          "grpSave": {
            "sGroupname": groupData.sGroupname,
            "sCreatedBy": selectedGroup.gCreatedBy,
            "sUserStatus": selectedGroup.gStatus,
            "sUserGroupID": selectedGroup.L01UserGroupID,
            "sApplicationCodes": Array.isArray(groupData.sApplicationCodes) 
              ? groupData.sApplicationCodes.join(',') 
              : groupData.sApplicationCodes
          },
          "AuditTrailValues": auditTrailValues,
          "appname": "SDMS",
          "ActiveUserDetails": {
            "sUsername": user?.username ,
            "sCategories": user?.categories ,
            "sSiteCode": user?.site ,
            "sUserID": user.userdetails.sUserID ,
            "sUserDomainName": user?.domain ,
            "sUserGroupID": selectedGroup.L01UserGroupID,
            "sTimeZoneID": user?.timezone ,
            "sSessionID": user.userdetails.sSessionID ,
            "sUserStatus": "",
            "sApplicationCodes": "UserManagement",
            "sdbtype": user?.sdbtype ,
            "sTenantID": user?.sTenantID || ""
          }
        };
        await UpdateUserRole(data);
      }

      // Close audit trail popup
      setShowAuditTrailPopup(false);
      setPendingGroupData(null);

      // Refresh grid data if refresh function is provided
      if (onRefresh) {
        onRefresh();
      }

      // Close main popup and reset form
      handleClosePopup();
    } catch (error) {
      console.error('Error saving group:', error);
      alert('Error saving group. Please try again.');
    }
  };

  // Handle audit trail popup close
  const handleAuditTrailClose = () => {
    setShowAuditTrailPopup(false);
    setPendingGroupData(null);
  };
     async function CreateUserRole(req) {
      try {
        debugger
         let Req = JSON.stringify(req);
         var objdata = { "passObj": CF_encrypt(Req) };
         var rows = await postAPI(objdata, "User/UserGroupSaveBtnclick", true);
         const row = JSON.parse(rows);
         
         if (row.Resp.Sts == "1") {
                onRefresh();
           if(row.Resp.desc.oResObj != undefined){
        
             //alert('Role created successfully!');
           } else {
           }
         } else {
         }
       } catch (error) {
         console.error("Error creating role:", error);
       }
     };
     async function UpdateUserRole(req) {
      try {
        debugger
         let Req = JSON.stringify(req);
         var objdata = { "passObj": CF_encrypt(Req) };
         var rows = await postAPI(objdata, "User/UserGroupUpdateBtnclick", true);
         const row = JSON.parse(rows);
         debugger
         if (row.Resp.Sts == "1") {
                onRefresh();
           if(row.Resp.desc.oResObj != undefined){
    
         //    alert('Role updated successfully!');
           } else {
            //  alert('Failed to update role: ' + (row.Resp.desc.Rtn || 'Unknown error'));
            //  throw new Error('API returned failure status');
           }
         } else {
          //  alert('Failed to update role: ' + (row.Resp.Msg || 'Unknown error'));
          //  throw new Error('API returned error status');
         }
       } catch (error) {
         console.error("Error updating role:", error);
        //  throw error;
       }
     };
        async function getAllApplications() {
      try {
        debugger
         let Req ="";
         var rows = await postAPI(Req, "User/loadapplist", true);
         const row = JSON.parse(rows);
         debugger
         if (row.Resp.Sts == "1") {
           if(row.Resp.desc != undefined){
    setgetApplist(row.Resp.desc)
         //    alert('Role updated successfully!');
           } else {
            //  alert('Failed to update role: ' + (row.Resp.desc.Rtn || 'Unknown error'));
            //  throw new Error('API returned failure status');
            setgetApplist([])
           }
         } else {
          
          //  alert('Failed to update role: ' + (row.Resp.Msg || 'Unknown error'));
          //  throw new Error('API returned error status');
         }
       } catch (error) {
         console.error("Error updating role:", error);
        //  throw error;
       }
     };
    const handlepopcolse=()=>{}
  return (
    <>
      <CustomPopup
        isOpen={isOpen || isPopupOpen}
        onClose={handlepopcolse}
        title={mode === 'edit' ? 'Edit Role' : 'Add New Role'}
        content={
          <div>
            <form>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>
                  User Role <span style={{ color: 'red' }}>*</span>
                </label>
                <input
                  type="text"
                  value={newGroupData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter User Role"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: 'none',
                    borderBottom: '2px solid #ddd',
                    borderRadius: '0',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                    transition: 'border-bottom-color 0.2s ease',
                    outline: 'none',
                    backgroundColor: 'transparent'
                  }}
                  onFocus={(e) => e.target.style.borderBottomColor = '#007bff'}
                  onBlur={(e) => e.target.style.borderBottomColor = '#ddd'}
                />
              </div>
                 <div style={{ marginBottom: '20px', position: 'relative' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>
                  Application Name <span style={{ color: 'red' }}>*</span>
                </label>
                
                {/* Custom Multi-Select with Checkboxes */}
                <div className="app-dropdown-container" style={{ position: 'relative' }}>
                  {/* Display Selected Items */}
                  <div
                    ref={inputRef}
                    onClick={toggleAppDropdown}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: 'none',
                    borderBottom: '2px solid #ddd',
                    borderRadius: '0',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                      cursor: 'pointer',
                    backgroundColor: 'transparent',
                      minHeight: '42px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '5px'
                    }}
                  >
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', flex: 1 }}>
                      {newGroupData.sApplicationCodes && newGroupData.sApplicationCodes.length > 0 ? (
                        newGroupData.sApplicationCodes.map((appCode) => {
                          const app = getApplist.find(a => a.appcode === appCode);
                          return (
                            <span
                              key={appCode}
                              style={{
                                backgroundColor: '#007bff',
                                color: 'white',
                                padding: '4px 8px',
                                borderRadius: '3px',
                                fontSize: '12px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '5px'
                              }}
                            >
                              {app?.appname || appCode}
                              <span
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAppCheckboxChange(appCode);
                                }}
                                style={{
                                  cursor: 'pointer',
                                  fontWeight: 'bold',
                                  fontSize: '14px'
                                }}
                              >
                                ×
                              </span>
                            </span>
                          );
                        })
                      ) : (
                        <span style={{ color: '#999' }}>Select applications...</span>
                      )}
                    </div>
                    <span style={{ color: '#666', fontSize: '12px' }}>▼</span>
                  </div>

                  {/* Dropdown with Checkboxes */}
                  {showAppDropdown && (
                    <div
                      ref={dropdownRef}
                      style={{
                        position: 'fixed',
                        backgroundColor: 'white',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        maxHeight: '250px',
                        overflowY: 'auto',
                        zIndex: 9999,
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                        minWidth: '300px'
                      }}
                    >
                      {getApplist && getApplist.length > 0 ? (
                        getApplist.map((app, idx) => {
                          const isSelected = newGroupData.sApplicationCodes && 
                                           newGroupData.sApplicationCodes.includes(app.appcode);
                          return (
                            <div
                              key={idx}
                              onClick={() => handleAppCheckboxChange(app.appcode)}
                              style={{
                                padding: '10px 12px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                borderBottom: idx < getApplist.length - 1 ? '1px solid #f0f0f0' : 'none',
                                backgroundColor: isSelected ? '#f0f8ff' : 'transparent',
                                transition: 'background-color 0.2s ease'
                              }}
                              onMouseEnter={(e) => {
                                if (!isSelected) {
                                  e.target.style.backgroundColor = '#f8f9fa';
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (!isSelected) {
                                  e.target.style.backgroundColor = 'transparent';
                                }
                              }}
                            >
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => {}} // Handled by parent onClick
                                style={{
                                  width: '16px',
                                  height: '16px',
                                  cursor: 'pointer'
                                }}
                              />
                              <span style={{ fontSize: '14px', color: '#333' }}>
                                {app.appname}
                              </span>
                            </div>
                          );
                        })
                      ) : (
                        <div style={{ padding: '12px', color: '#999', textAlign: 'center' }}>
                          No applications found
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              {/* <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>
                  Status
                </label>
                <select
                  value={newGroupData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: 'none',
                    borderBottom: '2px solid #ddd',
                    borderRadius: '0',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                    transition: 'border-bottom-color 0.2s ease',
                    outline: 'none',
                    backgroundColor: 'transparent',
                    cursor: 'pointer'
                  }}
                  onFocus={(e) => e.target.style.borderBottomColor = '#007bff'}
                  onBlur={(e) => e.target.style.borderBottomColor = '#ddd'}
                >
                  <option value="Active">Active</option>
                  <option value="Deactive">Deactive</option>
                </select>
              </div> */}
            </form>
            
            {/* Bottom Action Buttons Section */}
            <div style={{ 
              borderTop: '1px solid #e9ecef', 
              paddingTop: '20px', 
              marginTop: '20px' 
            }}>
              <div style={{ 
                display: 'flex', 
                gap: '10px', 
                justifyContent: 'flex-end' 
              }}>
                <button
                  type="button"
                  onClick={handleClosePopup}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: 'white',
                    color: '#333',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#f8f9fa';
                    e.target.style.borderColor = '#007bff';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'white';
                    e.target.style.borderColor = '#ddd';
                  }}
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={handleSaveGroup}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#0056b3';
                    e.target.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#007bff';
                    e.target.style.transform = 'translateY(0)';
                  }}
                >
                  <i className="fa fa-check" style={{ fontSize: '12px' }}></i>
                  {mode === 'edit' ? 'Submit' : 'Submit'}
                </button>
              </div>
            </div>
          </div>
        }
      />
      
      {/* Audit Trail Popup */}
      <AuditTrailPopup
        isOpen={showAuditTrailPopup}
        onClose={handleAuditTrailClose}
        onSubmit={handleAuditTrailSubmit}
        mode={mode}
      />
    </>
  )
}

export default UserRoleEdit