import React, { useState, useEffect, useRef } from 'react'
import CustomPopup from '../../Common/PopupScreens/Editpage/CustomPopup'
import AuditTrailPopup from '../../Common/PopupScreens/Audittrail/AuditTrailPopup'
import WarningPopup from '../../Common/PopupScreens/WarningPopup/WarningPopup'
import { postAPI } from '../../../Services/apicall';
import { CF_encrypt } from '../../Common/EncrptDecrpt/encryption';
import { CF_sessionSet, CF_sessionGet, getCookienormal } from '../../Common/CookieSessionStorage/CookieFun';
import { useAuth } from '../../Common/Context/AuthContext';

const UserMasterEdit = ({ isOpen, onClose, selectedGroup, onSave, onRefresh, mode = 'add' }) => {
   const [activeTab, setActiveTab] = useState('usergroup');
    const [sortStatus, setSortStatus] = useState('none');
    const [gridData, setGridData] = useState([]);
      const [getApplist, setgetApplist] = useState([]);
            const [getgrouprole, setgetgrouprole] = useState([]);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [showAuditTrailPopup, setShowAuditTrailPopup] = useState(false);
    const [pendingGroupData, setPendingGroupData] = useState(null);
    const [showWarningPopup, setShowWarningPopup] = useState(false);
    const [warningData, setWarningData] = useState({ title: '', content: '' });
      const [sitesData, setSitesData] = useState([]);
      const [newUserData, setnewUserData] = useState( {
        "sGroupname": "",
        "sCreatedBy": "",
        "sUserStatus": "UA",
        "nLabsheetLicense": 0,
         "sUserFullname": "",
        "sUserMailID": "",
         "sUsername": "",
          "sUserGroupID": "DFT",
        "sUserDefaultSiteCode":"",
        "sApplicationCodes":"",
    },);
    const [showAppDropdown, setShowAppDropdown] = useState(false);
    const dropdownRef = useRef(null);
    const inputRef = useRef(null);
    const fileInputRef = useRef(null);
    
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
loadSite() 
getAllRoles()
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
      
     setnewUserData({
        "sGroupname": selectedGroup.UserGroupName,
        "sCreatedBy": selectedGroup.CreatedBy,
        "sUserStatus": selectedGroup.UserStatus,
        "nLabsheetLicense": 0,
        "sUserFullname": selectedGroup.L02UserFullName,
        "sUserMailID": selectedGroup.L02EmailID,
        "sUsername":selectedGroup.L02UserName,
        "sUserGroupID":selectedGroup.L02UserGroupID,
        "sUserDefaultSiteCode": "",
        "sApplicationCodes": "",
        "sUserId":selectedGroup.L02UserID,
        "profileImage": selectedGroup.L02ProfileImageName
      });
    } else if (mode === 'add') {
   
      setnewUserData({
        "sGroupname": "",
        "sCreatedBy": user?.userdetails?.sUserID || "",
        "sUserStatus": "UA",
        "nLabsheetLicense": 0,
        "sUserFullname": "",
        "sUserMailID": "",
        "sUsername": "",
        "sUserGroupID": "",
        "sUserDefaultSiteCode": "",
        "sApplicationCodes": "",
        "profileImage": ""
      });
    }

  }, [selectedGroup, mode, isOpen, user]);

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
    setnewUserData({
        "sGroupname": "",
        "sCreatedBy": user?.userdetails?.sUserID || "",
        "sUserStatus": "UA",
        "nLabsheetLicense": 0,
        "sUserFullname": "",
        "sUserMailID": "",
        "sUsername": "",
        "sUserGroupID": "",
        "sUserDefaultSiteCode": "",
        "sApplicationCodes": "",
        "profileImage": ""
    });
    setShowAppDropdown(false);
  };
  const handleInputChange = (field, value) => {
    setnewUserData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle application checkbox selection
  const handleAppCheckboxChange = (appCode) => {
    setnewUserData(prev => {
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
  
  // Handle file upload
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Check file size (3MB limit)
      const maxSize = 3 * 1024 * 1024; // 3MB in bytes
      if (file.size > maxSize) {
        alert('File size exceeds 3MB limit');
        return;
      }

      // Check file type
      const allowedTypes = ['.gif', '.png', '.jpg', '.jpeg', '.img'];
      const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
      if (!allowedTypes.includes(fileExtension)) {
        alert('Invalid file type. Allowed types: .gif, .png, .jpg, .jpeg, .img');
        return;
      }

      // Update the form data with the file name
      handleInputChange('profileImage', file.name);
      
      // If you need to handle the actual file upload, you can use FormData here
      // const formData = new FormData();
      // formData.append('file', file);
      // Upload logic here
    }
  };

  const handleSaveGroup = async () => {
    // Validate only mandatory fields
    if (!newUserData.sUsername || !newUserData.sUsername.trim()) {
      alert('Please enter Username');
      return;
    }

    if (!newUserData.sUserFullname || !newUserData.sUserFullname.trim()) {
      alert('Please enter Profile Name');
      return;
    }

    // Email validation (optional field, but validate format if provided)
    if (newUserData.sUserMailID && newUserData.sUserMailID.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(newUserData.sUserMailID.trim())) {
        alert('Please enter a valid Email ID');
        return;
      }
    }

    // Prepare data for save
    const groupData = {
      ...newUserData,
      sUsername: newUserData.sUsername.trim(),
      sUserFullname: newUserData.sUserFullname.trim(),
      sUserMailID: newUserData.sUserMailID ? newUserData.sUserMailID.trim() : "",
      sUserGroupID: newUserData.sUserGroupID || "",
      sUserDefaultSiteCode: newUserData.sUserDefaultSiteCode || "",
      sCreatedBy: user?.userdetails?.sUserID || "",
      nLabsheetLicense: parseInt(newUserData.nLabsheetLicense) || 0
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
      const usertimezone = user?.timezone + "<~>true";
      if (mode === "add") {
        // Create AuditTrailValues with user-provided data
        const auditTrailValues = createAuditTrailValues(auditData);
        
        let data = {
          "AddpopObj": {
            "sUserStatus": groupData.sUserStatus || "UA",
            "nLabsheetLicense": parseInt(groupData.nLabsheetLicense) || 0,
            "sUsername": groupData.sUsername,
            "sUserFullname": groupData.sUserFullname,
            "sCreatedBy": user?.userdetails?.sUserID || "",
            "sUserGroupID": groupData.sUserGroupID,  //DFT
            "sUserDefaultSiteCode": groupData.sUserDefaultSiteCode || "",
            "sUserMailID": groupData.sUserMailID || "",
            "AvailableLabSheetCount": null,
            "AvailableSDMSUsersCount": null
          },
            "ActiveUserDetails": {
            "sUsername": user?.username ,
            "sCategories": user?.categories ,
            "sSiteCode": user?.site ,
            "sUserID": user.userdetails?.sUserID,
            "sUserDomainName": user?.domain ,
            "sUserGroupID": user?.userdetails?.sUserGroupID,
            "sTimeZoneID": usertimezone,
            "sSessionID": user.userdetails.sSessionID ,
            "sUserStatus": "",
            "sApplicationCodes": "UserManagement",
            "sdbtype": user?.sdbtype ,
            "sTenantID": user?.sTenantID || ""
          },
          "AuditTrailValues": auditTrailValues
        };
        
        console.log('Save Data:', data);
        await CreateUserRole(data);
      } else {
        // Create AuditTrailValues with user-provided data
        const auditTrailValues = createAuditTrailValues(auditData);
        
        let data = {
    "EditPopObj": {
        "nLabsheetLicense": 0,
        "sUsername": groupData.sUsername,
        "sUserFullname": groupData.sUserFullname,
        "sUserGroupID": groupData.sUserGroupID,
        "sGroupname": groupData.sGroupname,
        "sUserID": groupData.sUserId,
        "sUserMailID": groupData.sUserMailID,
        "sUserStatus":groupData.sUserStatus === "Active" ? "A" : "UA",
        "sUserDefaultSiteCode": groupData.sUserDefaultSiteCode,
        "AvailableLabSheetCount": null,
        "AvailableSDMSUsersCount": null
    },
    "sLoginUserID":user.userdetails?.sUserID,
    "ActiveUserDetails": {
            "sUsername": user?.username ,
            "sCategories": user?.categories ,
            "sSiteCode": user?.site ,
            "sUserID": user.userdetails?.sUserID,
            "sUserDomainName": user?.domain ,
            "sUserGroupID": user?.userdetails?.sUserGroupID,
            "sTimeZoneID": usertimezone,
            "sSessionID": user.userdetails.sSessionID ,
            "sUserStatus": "",
            "sApplicationCodes": "UserManagement",
            "sdbtype": user?.sdbtype ,
            "sTenantID": user?.sTenantID || ""
          },
          "AuditTrailValues": auditTrailValues
}
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
         var rows = await postAPI(objdata, "User/UsermasterAddPopupSaveBtn", true);
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
         var rows = await postAPI(objdata, "User/UsermasterEditPopupSaveBtn", true);
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

        async function loadSite() {
                    debugger
                    try {
                           const passObj = {};
                             let Req = JSON.stringify(passObj);
                    // const objdata = { "passObj": passObj };
                       var objdata = { "passObj": CF_encrypt(Req) };
                       var rows = await postAPI(objdata, "Login/LoadSite", true);
                       const row = JSON.parse(rows);
                       debugger
                       if (row.Resp.Sts == "1") {
                     
                         if(row.Resp.desc.sitelist != undefined){
                          console.log('Full site response:', row.Resp.desc.sitelist);
                          setSitesData(row.Resp.desc.sitelist || []);
                            setnewUserData(prev => ({
      ...prev,
      "sUserDefaultSiteCode": row.Resp.desc.sitelist[0].sSiteCode
    }));
                          // Auto-select first site if available
                         //  if (row.Resp.desc.sitelist && row.Resp.desc.sitelist.length > 0) {
                         //    const firstSite = row.Resp.desc.sitelist[0];
                         //    setFormValues(prev => ({ ...prev, site: firstSite.sSiteCode }));
                         //     loadDomainCombo(firstSite);
                         //  }
                       //    alert('Role updated successfully!');
                         } else {
                          console.log('No sitelist found in response:', row.Resp.desc);
                          //  alert('Failed to update role: ' + (row.Resp.desc.Rtn || 'Unknown error'));
                          //  throw new Error('API returned failure status');
                         }
                       } else {
                        console.log('Site loading failed:', row.Resp.Msg);
                        //  alert('Failed to update role: ' + (row.Resp.Msg || 'Unknown error'));
                        //  throw new Error('API returned error status');
                       }
                     } catch (error) {
                       console.error("Error updating role:", error);
                      //  throw error;
                     }
                   };
  async function getAllRoles(selectedGroupToMaintain = null) {
        debugger
          // setisLoading(true)
        try {
            let sitedata = await getCookienormal("ActiveUserDetails");
          var Req = {
    "sModuleName": "User Management",
    "sApplicationCodes": "Usermanagement",
    "ActiveUserDetails": JSON.parse(sitedata)
};
          Req = JSON.stringify(Req);
      var objdata = { "passObj": CF_encrypt(Req) };
          var rows = await postAPI(objdata, "User/UserGroupAndMasterGrid", true);
          const row = JSON.parse(rows);
          
          if (row.Resp.Sts == "1") {
              // setisLoading(false)
            if(row.Resp.desc.oResObj == undefined){
              setgetgrouprole([]);
                // setfilterData([])
              }else{
                debugger
                let modifiedData = row.Resp.desc.oResObj.map((item, index) => ({
  ...item,
  id: item.L01UserGroupID || `group_${index}`, // Use L01UserGroupID as unique identifier
  name: item.L01UserGroupName || 'N/A',
  sApplicationCodes: item.gApplicationCodes || 'N/A',
  status: item.gStatus || 'N/A',
  
}));
           console.log('Modified data for grid:', modifiedData);
           setgetgrouprole(modifiedData);
           
   
              }
            // setLoading(false)
            console.log("Data received:", row);
      
          } else {
            
             setgetgrouprole([])
            // setfilterData([])  
            // setLoading(false)
            console.log("No data returned from the API.");
          }
        } catch (error) {
          console.error("Error fetching sites:", error);
          setgetgrouprole([])
          // setfilterData([])  
          // setLoading(false)

       
        }
      }
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
              {/* Username Field */}
              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500', color: '#333', fontSize: '12px' }}>
                  Username <span style={{ color: 'red' }}>*</span>
                </label>
                <input
                  type="text"
                  value={newUserData.sUsername || ''}
                    disabled={mode == 'edit' && true}
                  onChange={(e) => handleInputChange('sUsername', e.target.value)}
                  placeholder="Enter Username"
                  style={{
                    width: '100%',
                    padding: '6px',
                    border: 'none',
                      borderBottom: '2px solid #ddd',
                    borderRadius: '0',
                    fontSize: '12px',
                    boxSizing: 'border-box',
                    transition: 'border-bottom-color 0.2s ease',
                    outline: 'none',
                    backgroundColor: 'transparent'
                  }}
                    onFocus={(e) => e.target.style.borderBottomColor = '#007bff'}
                  onBlur={(e) => e.target.style.borderBottomColor = '#ddd'}
                />
              </div>

              {/* Profile Name Field */}
              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500', color: '#333', fontSize: '12px' }}>
                  Profile Name <span style={{ color: 'red' }}>*</span>
                </label>
                <input
                  type="text"
                  value={newUserData.sUserFullname || ''}
                    disabled={mode == 'edit' && true}
                  onChange={(e) => handleInputChange('sUserFullname', e.target.value)}
                  placeholder="Enter Profile Name"
                  style={{
                    width: '100%',
                    padding: '6px',
                    border: 'none',
                    borderBottom: '2px solid #ddd',
                    borderRadius: '0',
                    fontSize: '12px',
                    boxSizing: 'border-box',
                    transition: 'border-bottom-color 0.2s ease',
                    outline: 'none',
                    backgroundColor: 'transparent'
                  }}
                  onFocus={(e) => e.target.style.borderBottomColor = '#007bff'}
                  onBlur={(e) => e.target.style.borderBottomColor = '#ddd'}
                />
              </div>

              {/* Email ID Field */}
              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500', color: '#333', fontSize: '12px' }}>
                  Email ID
                </label>
                <input
                  type="email"
                  value={newUserData.sUserMailID || ''}
                  onChange={(e) => handleInputChange('sUserMailID', e.target.value)}
                  placeholder="Enter Email ID"
                  style={{
                    width: '100%',
                    padding: '6px',
                    border: 'none',
                    borderBottom: '2px solid #ddd',
                    borderRadius: '0',
                    fontSize: '12px',
                    boxSizing: 'border-box',
                    transition: 'border-bottom-color 0.2s ease',
                    outline: 'none',
                    backgroundColor: 'transparent'
                  }}
                  onFocus={(e) => e.target.style.borderBottomColor = '#007bff'}
                  onBlur={(e) => e.target.style.borderBottomColor = '#ddd'}
                />
                <div style={{ fontSize: '10px', color: '#666', marginTop: '3px' }}>
                  NOTE:- This mail is to recover the forgot password
                </div>
              </div>

              {/* Profile Image Field */}
              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500', color: '#333', fontSize: '12px' }}>
                  Profile Image
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <input
                    type="text"
                    value={newUserData.profileImage}
                    readOnly
                    style={{
                      flex: 1,
                      padding: '6px',
                      border: 'none',
                      borderBottom: '2px solid #ddd',
                      borderRadius: '0',
                      fontSize: '12px',
                      backgroundColor: 'transparent',
                      outline: 'none'
                    }}
                    placeholder="No file chosen"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      padding: '5px 10px',
                      backgroundColor: '#f8f9fa',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '11px'
                    }}
                  >
                    Choose File
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".gif,.png,.jpg,.jpeg,.img"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                  />
                </div>
                <div style={{ fontSize: '10px', color: '#666', marginTop: '3px' }}>
                  NOTE:- Upload File should be less than 3 MB and supported file types are: .gif, .png, .jpg, .jpeg, .img
                </div>
              </div>

              {/* Group Name Field */}
              <div style={{ marginBottom: '10px'}}>
                <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500', color: '#333', fontSize: '12px' }}>
                  Group Name
                </label>
                <select
                  value={newUserData.sUserGroupID || ''}
                    disabled={mode == 'edit' && true}
                  onChange={(e) => handleInputChange('sUserGroupID', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '6px',
                    border: 'none',
                    borderBottom: '2px solid #ddd',
                    borderRadius: '0',
                    fontSize: '12px',
                    backgroundColor: 'transparent',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                 {getgrouprole.map((data, idx) => {
                      return (
                        <option key={idx} value={data.L01UserGroupID}>
                          {data.L01UserGroupName}
                        </option>
                      );
                    })}
                </select>
              </div>

              {/* Default Login Site Field */}
              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500', color: '#333', fontSize: '12px' }}>
                   Site
                </label>
                <select
                  value={newUserData.sUserDefaultSiteCode || ''}
                    disabled={mode == 'edit' && true}
                  onChange={(e) => handleInputChange('sUserDefaultSiteCode', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '6px',
                    border: 'none',
                    borderBottom: '2px solid #ddd',
                    borderRadius: '0',
                    fontSize: '12px',
                    backgroundColor: 'transparent',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
      {sitesData.map((data, idx) => {
                      return (
                        <option key={idx} value={data.sSiteCode}>
                          {data.sSiteName}
                        </option>
                      );
                    })}
                </select>
              </div>

              {/* Approve Checkbox */}
              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '500', color: '#333', fontSize: '12px' }}>
                  <input
                  disabled={mode == 'edit' && true}
                    type="checkbox"
                    checked={ newUserData.sUserStatus === 'A' || newUserData.sUserStatus === 'Active' }
                    onChange={(e) => handleInputChange('sUserStatus', e.target.checked ? 'A' : 'UA')}
                    style={{
                      width: '13px',
                      height: '13px',
                      cursor: 'pointer'
                    }}
                  />
                  Approve
                </label>
              </div>
    
             
            </form>
            {/* Bottom Action Buttons Section */}
            <div style={{ 
              borderTop: '1px solid #e9ecef', 
              paddingTop: '10px', 
              marginTop: '10px' 
            }}>
              <div style={{ 
                display: 'flex', 
                gap: '6px', 
                justifyContent: 'flex-end' 
              }}>
                <button
                  type="button"
                  onClick={handleClosePopup}
                  style={{
                    padding: '5px 10px',
                    backgroundColor: 'white',
                    color: '#333',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '11px',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
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
                    padding: '5px 10px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '11px',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
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
                  <i className="fa fa-check" style={{ fontSize: '10px' }}></i>
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

export default UserMasterEdit
