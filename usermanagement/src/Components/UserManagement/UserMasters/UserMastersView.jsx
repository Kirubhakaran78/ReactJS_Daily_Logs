import React, { useState, useEffect } from 'react';
import { useCombobox, useDatePicker } from '../../utils/jqwidgetsMigration';
import ReusableGrid from '../../utils/ReusableGrid';
// import CustomPopup from '../../Common/CustomPopup';
import UserMasterEdit from './UserMasterEdit';
import { postAPI, postAPIUserimport } from '../../../Services/apicall';
import { CF_encrypt } from '../../Common/EncrptDecrpt/encryption';
import LoadingScreen from '../../Common/LoadingScreen/LoadingScreen';
import { getCookie, getCookienormal} from "../../../Components/Common/CookieSessionStorage/CookieFun";
import AuditTrailPopup from '../../Common/PopupScreens/Audittrail/AuditTrailPopup'
import { useAuth } from '../../Common/Context/AuthContext';
import { CF_sessionSet, CF_sessionGet } from '../../Common/CookieSessionStorage/CookieFun';
import WarningPopup from '../../Common/PopupScreens/WarningPopup/WarningPopup';
import * as XLSX from 'xlsx';
import CustomPopup from '../../Common/PopupScreens/Editpage/CustomPopup';
const UserMastersView = () => {  
      const { user } = useAuth();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [isLoading,setisLoading] = useState(false)
    const [importuserpopup,setimportuserpopup] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [fileName, setFileName] = useState('No file chosen')
    const [addEdit, setAddEdit] = useState("add");
      const [showAuditTrailPopup, setShowAuditTrailPopup] = useState(false);
  const [showConfirmationPopup, setShowConfirmationPopup] = useState(false);
  const [gridData, setGridData] = useState([]);
      const [sitesData, setSitesData] = useState([]);
  const [selectedUserRole, setSelectedUserRole] = useState('');
      const [showWarningPopup, setShowWarningPopup] = useState(false);
      const [warningData, setWarningData] = useState({ title: '', content: '' });
const [title, setTitle] = useState("confiramationactdeact");
  const [selectedRowDetails, setSelectedRowDetails] = useState({
    gCreatedBy: '',
    gCreatedOn: '',
    gModifiedBy: '',
    gModifiedOn: ''
  });
  

  // Grid configuration
  const gridColumns = [
    { text: 'Username', datafield: 'name', width: '25%' },
    { text: 'Profilename', datafield: 'profilename', width: '35%' },
    { text: 'User Role Name', datafield: 'rolename', width: '20%' },
    { text: 'User Status', datafield: 'status', width: '20%' }
  ];


  const handleWarningClose = () => {
    setShowWarningPopup(false);
  };
  // jQWidgets Combobox for Status Filter
  const statusFilterRef = useCombobox({
    displayMember: 'text',
    valueMember: 'value',
    width: '100%',
    height: 30,
    placeHolder: 'Filter by Status'
  });

  // jQWidgets DatePicker for Created On
  const createdOnRef = useDatePicker({
    property: {
      formatString: 'dd/MM/yyyy',
      showTimeButton: false
    }
  });

  const handleAuditTrailClose = () => {
    setShowAuditTrailPopup(false);

  };
  const handleAddGroup = () => {
    setSelectedGroup(null);
    setAddEdit('add')
    setSelectedRowDetails({
      gCreatedBy: '',
      gCreatedOn: '',
      gModifiedBy: '',
      gModifiedOn: ''
    });
    setIsEditOpen(true);
  };

  const handleEditGroup = () => {
    debugger
    if (selectedGroup && selectedGroup.UserStatus === "Active" ) {
      setIsEditOpen(true);
          setAddEdit('edit')
    } else {
          setWarningData({ title:"Information",content : "The User selected is Unapporved,So cannot edit!" });
        setShowWarningPopup(true);
      // alert('Please select a group to edit');
    }
  };

  const handleCloseEdit = () => {
    setIsEditOpen(false);
    setSelectedGroup(null);
    setSelectedRowDetails({
      gCreatedBy: '',
      gCreatedOn: '',
      gModifiedBy: '',
      gModifiedOn: ''
    });
  };

  const handleSaveEdit = (groupData) => {
    if (selectedGroup) {
      // Update existing group
      setGridData(prev => prev.map(group => 
        group.id === groupData.id 
          ? { ...group, ...groupData }
          : group
      ));
    } else {
      // Add new group
      setGridData(prev => [...prev, groupData]);
    }

    // Close edit mode
    setIsEditOpen(false);
    setSelectedGroup(null);
  };

  const handleGridRowSelect = (rowData) => {
    debugger
    setSelectedGroup(rowData);
    
    // Load details for the selected row
    setSelectedRowDetails({
           gSite:rowData.SiteName || 'N/A',
                gDomain:rowData.sUserDomainName || 'N/A',
                 gLastlogon:rowData.LastLoggedOn || 'N/A',
                 gPasswordexpiredate:rowData.PassWordExpiryDate || 'N/A',
                gEmail:rowData.L02EmailID || 'N/A',
      gCreatedBy: rowData.CreatedBy || 'N/A',
      gCreatedOn: rowData.CreatedOn || 'N/A',
      gModifiedBy: rowData.ModifiedBy || 'N/A',
      gModifiedOn: rowData.ModifiedOn || 'N/A'
    });
  };


   function handleActiveDeactive (){
    // Open confirmation popup first
    if (selectedGroup) {
      setShowConfirmationPopup(true);
          setAddEdit('activeDeactive');
    } else {
      alert('Please select a group to activate/deactivate');
    }
  };

  const handleConfirmationYes = () => {
    // Close confirmation popup and open audit trail popup
    setShowConfirmationPopup(false);
    setShowAuditTrailPopup(true);
  };

  const handleConfirmationNo = () => {
    // Just close the confirmation popup
    setShowConfirmationPopup(false);
  };
     async function ActiveDeactiveUser(req) {
      try {
        setisLoading(true)
         let Req = JSON.stringify(req);
         var objdata = { "passObj": CF_encrypt(Req) };
         var rows = await postAPI(objdata, "User/UserMasterActDeactBtnclick", true);
         const row = JSON.parse(rows);
         debugger
         if (row.Resp.Sts == "1") {
             setisLoading(false)
          handlereferesh()
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
  // Load combobox data
  useEffect(() => {
getAllUsers();
loadSite();
  }, []);
  const handlereferesh = ()=>{
    // Store the currently selected group before refresh
    const currentSelectedGroup = selectedGroup;
    getAllUsers(currentSelectedGroup) 
  }
    async function getAllUsers(selectedGroupToMaintain = null) {
        debugger
          setisLoading(true)
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
          debugger
          if (row.Resp.Sts == "1") {
              setisLoading(false)
            if(row.Resp.desc.oResObj1 == undefined){
              setGridData([]);
                // setfilterData([])
              }else{
                debugger
                let modifiedData = row.Resp.desc.oResObj1.map((item, index) => ({
  ...item,
  id: item.L02UserID || `group_${index}`, // Use L01UserGroupID as unique identifier
  name: item.L02UserName || 'N/A',
  profilename:item.L02UserFullName || 'N/A',
  rolename: item.UserGroupName || 'N/A',
  status: item.UserStatus || 'N/A',
  
}));
           console.log('Modified data for grid:', modifiedData);
           setGridData(modifiedData);
           
           // Restore selected group if it was maintained during refresh
           if (selectedGroupToMaintain) {
             const restoredGroup = modifiedData.find(item => 
               item.L01UserGroupID === selectedGroupToMaintain.L01UserGroupID
             );
             if (true) {
               setSelectedGroup(restoredGroup);
               setSelectedRowDetails({
                 gSite:restoredGroup.SiteName || 'N/A',
                gDomain:restoredGroup.sUserDomainName || 'N/A',
                 gLastlogon:restoredGroup.LastLoggedOn || 'N/A',
                 gPasswordexpiredate:restoredGroup.PassWordExpiryDate || 'N/A',
                gEmail:restoredGroup.L02EmailID || 'N/A',
                 gCreatedBy: restoredGroup.CreatedBy || 'N/A',
                 gCreatedOn: restoredGroup.CreatedOn || 'N/A',
                 gModifiedBy: restoredGroup.ModifiedBy || 'N/A',
                 gModifiedOn: restoredGroup.ModifiedOn || 'N/A'
               });
               console.log('Restored selected group after refresh:', restoredGroup);
             }
           }
            // setfilterData(row.Resp.desc[0].Servers)  
              }
            // setLoading(false)
            console.log("Data received:", row);
      
          } else {
            
             setGridData([])
            // setfilterData([])  
            // setLoading(false)
            console.log("No data returned from the API.");
          }
        } catch (error) {
          console.error("Error fetching sites:", error);
          setGridData([])
          // setfilterData([])  
          // setLoading(false)

       
        }
      }
        const handleAuditTrailSubmit = async (auditData) => {
    try {
      debugger
      
        const auditTrailValues = createAuditTrailValues(auditData);
      
      // Handle different modes
      if (addEdit === 'activeDeactive') {
        // Call Active/Deactive API
        let usrdetail = await getCookienormal("ActiveUserDetails");
        let auditdetail = await getCookienormal("AuditTrailValues");
        let data = {
          "masterActDeact": {
            "sUsername": selectedGroup.L02UserName,
            "sUserStatus": selectedGroup.UserStatus,
            "sUserGroupID": selectedGroup.L02UserGroupID,
          },
          "AuditTrailValues": auditTrailValues,
          "sApplicationCodes": "Usermanagement",
          "ActiveUserDetails": JSON.parse(usrdetail)
        };
        await ActiveDeactiveUser(data);
      }else if(addEdit === "Approve"){
        let usrdetail = await getCookienormal("ActiveUserDetails");
        let auditdetail = await getCookienormal("AuditTrailValues");
        let data = {
       "ApproveObj": {
        "sUserID": selectedGroup.L02UserID,
        "sUsername": selectedGroup.L02UserName,
        "sUserStatus": selectedGroup.UserStatus,
        "sUserGroupID": selectedGroup.L02UserGroupID,
          },
          "AuditTrailValues": auditTrailValues,
          "sApplicationCodes": "Usermanagement",
          "ActiveUserDetails": JSON.parse(usrdetail)
        };
        await ApporveConfirm(data);
 
    }
    else if(addEdit === "resetpassword"){
  let usrdetail = await getCookienormal("ActiveUserDetails");
        let auditdetail = await getCookienormal("AuditTrailValues");
        let data = {
       "ResetObj": {
        "sUserID": selectedGroup.L02UserID,
        "sResetUserName": selectedGroup.L02UserName,
        "sUserStatus": selectedGroup.UserStatus,
        "sUserGroupID": selectedGroup.L02UserGroupID,
          },
          "AuditTrailValues": auditTrailValues,
          "sApplicationCodes": "Usermanagement",
          "ActiveUserDetails": JSON.parse(usrdetail)
        };
        await resetpasswordConfirm(data);
    }else if(addEdit === "Retire"){
        let usrdetail = await getCookienormal("ActiveUserDetails");
        let auditdetail = await getCookienormal("AuditTrailValues");
        let data = {
       "RetireObj": {
        "sUserID": selectedGroup.L02UserID,
        "sRetireUserName": selectedGroup.L02UserName,
        "sRetireStatus": selectedGroup.UserStatus,
        "sUserGroupID": selectedGroup.L02UserGroupID,
          },
          "AuditTrailValues": auditTrailValues,
          "sApplicationCodes": "Usermanagement",
          "ActiveUserDetails": JSON.parse(usrdetail)
        };
        await retireuserConfirm(data);
    }
            // Close audit trail popup
      setShowAuditTrailPopup(false);
      handlereferesh();
      handleCloseEdit();
    } catch (error) {
      console.error('Error saving group:', error);
      alert('Error saving group. Please try again.');
    }
  };
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

  const handleApporveUsers = ()=>{
    debugger
  if (selectedGroup && selectedGroup.UserStatus != 'Active') {
      setShowConfirmationPopup(true);
      setTitle("Do you Want to Approve the User")
      setAddEdit("Approve")
    } else {
      setWarningData({ title:"Information",content : "The User selected is already apporved!" });
        setShowWarningPopup(true);
    }
              }
                async function ApporveConfirm(req) {
                    try {
                      debugger
                       let Req = JSON.stringify(req);
                       var objdata = { "passObj": CF_encrypt(Req) };
                       var rows = await postAPI(objdata, "User/UserMasterApproveBtn", true);
                       const row = JSON.parse(rows);
                       
                       if (row.Resp.Sts == "1") {
               
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

const handleResetpass = ()=>{
                      if (selectedGroup && selectedGroup.UserStatus == 'Active') {
     handleConfirmationYes();
      setAddEdit("resetpassword")
    }
  }
         async function resetpasswordConfirm(req) {
                    try {
                      debugger
                       let Req = JSON.stringify(req);
                       var objdata = { "passObj": CF_encrypt(Req) };
                       var rows = await postAPI(objdata, "User/MasterResetBtn", true);
                       const row = JSON.parse(rows);
                       
                       if (row.Resp.Sts == "1") {
               
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

const handleRetire =()=>{
  if (selectedGroup && selectedGroup.UserStatus != 'Retired') {
      setShowConfirmationPopup(true);
      setTitle("Do you Want to Retire the User")
      setAddEdit("Retire")
    } else{
         setWarningData({ title:"Information",content : "The User selected is already retired!" });
        setShowWarningPopup(true);
    }
}
const handleLock =()=>{
  if (selectedGroup && selectedGroup.UserStatus == 'Active') {
     setWarningData({ title:"Information",content : "The User selected is already Unlock!" });
        setShowWarningPopup(true);
    } else{
         setWarningData({ title:"Information",content : "The User selected is can not lock!" });
        setShowWarningPopup(true);
    }
}
         async function retireuserConfirm(req) {
                    try {
                      debugger
                       let Req = JSON.stringify(req);
                       var objdata = { "passObj": CF_encrypt(Req) };
                       var rows = await postAPI(objdata, "User/MasterRetireBtn", true);
                       const row = JSON.parse(rows);
                       
                       if (row.Resp.Sts == "1") {
               
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

  // Handle Export to Excel
  const handleExport = () => {
    if (!gridData || gridData.length === 0) {
      setWarningData({ title: "Information", content: "No data available to export!" });
      setShowWarningPopup(true);
      return;
    }

    try {
      // Map the grid data to the required export columns
      const exportData = gridData.map((item, index) => ({
        'Username': item.L02UserName || item.name || 'N/A',
        'Profile Name': item.L02UserFullName || item.profilename || 'N/A',
        'User Group Name': item.UserGroupName || item.rolename || 'N/A',
        'User Status': item.UserStatus || item.status || 'N/A',
        'Last Logged On': item.LastLoggedOn || 'N/A',
        'Password Expiry Date': item.PassWordExpiryDate || 'N/A',
        'Created By': item.CreatedBy || 'N/A',
        'Created On': item.CreatedOn || 'N/A',
        'Modified By': item.ModifiedBy || 'N/A',
        'Modified On': item.ModifiedOn || 'N/A'
      }));

      // Create a new workbook
      const wb = XLSX.utils.book_new();
      
      // Create a worksheet from the data
      const ws = XLSX.utils.json_to_sheet(exportData);
      
      // Set column widths for better readability
      const colWidths = [
        { wch: 15 }, // Username
        { wch: 25 }, // Profile Name
        { wch: 20 }, // User Group Name
        { wch: 15 }, // User Status
        { wch: 20 }, // Last Logged On
        { wch: 20 }, // Password Expiry Date
        { wch: 15 }, // Created By
        { wch: 15 }, // Created On
        { wch: 15 }, // Modified By
        { wch: 15 }  // Modified On
      ];
      ws['!cols'] = colWidths;

      // Add the worksheet to the workbook
      XLSX.utils.book_append_sheet(wb, ws, 'User Masters');

      // Generate filename with current date
      const currentDate = new Date();
      const dateString = currentDate.toISOString().split('T')[0]; // YYYY-MM-DD format
      const fileName = `UserMasters_${dateString}.xlsx`;

      // Save the file
      XLSX.writeFile(wb, fileName);

      // Show success message
      setWarningData({ title: "Success", content: `Data exported successfully as ${fileName}` });
      setShowWarningPopup(true);

    } catch (error) {
      console.error('Error exporting data:', error);
      setWarningData({ title: "Error", content: "Failed to export data. Please try again." });
      setShowWarningPopup(true);
    }
  };
  const handlepopcolse=()=>{
    setimportuserpopup(false)
    setSelectedFile(null)
    setFileName('No file chosen')
  }

  // Handle file selection
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file extension
      const allowedExtensions = ['.xls', '.xlsx'];
      const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
      
      if (!allowedExtensions.includes(fileExtension)) {
        setWarningData({ 
          title: "Error", 
          content: "Invalid file type. Please select a .xls or .xlsx file." 
        });
        setShowWarningPopup(true);
        return;
      }

      // Check file size (5MB limit)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        setWarningData({ 
          title: "Error", 
          content: "File size exceeds 5MB limit." 
        });
        setShowWarningPopup(true);
        return;
      }

      setSelectedFile(file);
      setFileName(file.name);
    }
  };

  // Handle file upload
  const handleFileUpload = async () => {
    debugger

    try {
      setisLoading(true);
      
      // Create FormData
      var formData = new FormData();
      formData.append('file', selectedFile);
      
      // Get active user details and encrypt them
      let usrdetail = await getCookienormal("ActiveUserDetails");
      const activeUserDetails = JSON.parse(usrdetail);
      
      formData.append('sUsername', CF_encrypt(activeUserDetails.sUsername));
      formData.append('sSiteCode', CF_encrypt(activeUserDetails.sSiteCode));
      formData.append('sUserID', CF_encrypt(activeUserDetails.sUserID));
      formData.append('sTimeZoneID', CF_encrypt(activeUserDetails.sTimeZoneID));
      
      // Get user group details from the selected site
      const selectedSite = sitesData.find(site => site.sSiteCode === selectedUserRole);
      const userGroupID = selectedUserRole || 'DFT'; // Default group ID
      const userGroupName = selectedSite?.sSiteName || 'Default Group';
      
      formData.append('sUserGroupID', CF_encrypt(userGroupID));
      formData.append('sUserGroupName', CF_encrypt(userGroupName));
      
        var rows = await postAPIUserimport(formData, "User/importDataFile", true);
                       const row = JSON.parse(rows);
                       
                       if (row.Resp.Sts == "1") {
               
                         if(row.Resp.desc.oResObj != undefined){
                      
                           //alert('Role created successfully!');
                         } else {
                         }
                       } else {
                       }
      
      // Close the popup and reset
      handlepopcolse();
      
      // Refresh the grid data
      handlereferesh();
      
    } catch (error) {
      console.error('Error uploading file:', error);
      setWarningData({ 
        title: "Error", 
        content: "Failed to upload file. Please try again." 
      });
      setShowWarningPopup(true);
    } finally {
      setisLoading(false);
    }
  };
  return (
    <div className="user-group-management">

      <LoadingScreen 
        isLoading={isLoading} 
        message="Please wait..." 
      />
      {/* UserRoleView Content Area */}
      <div className="UserRoleView-content-area full-width">
        {/* Action Buttons */}
         <div style={{display:'flex',justifyContent:"space-between"}}>
            <div style={{display:'flex', alignItems: 'center', gap: '10px', marginLeft: '30px'}}>
                 <label style={{ fontWeight: '500', color: '#333', fontSize: '14px', whiteSpace: 'nowrap' }}>
                   Site <span style={{ color: 'red' }}>*</span>
                 </label>
                 <select
                   value={selectedUserRole}
                   onChange={(e) => setSelectedUserRole(e.target.value)}
                   style={{
                     width: '200px',
                     padding: '10px 12px',
                     border: 'none',
                     borderRadius: '0',
                     fontSize: '14px',
                     backgroundColor: 'transparent',
                     outline: 'none',
                     cursor: 'pointer',
                     borderBottom: '2px solid #ddd',
                     transition: 'border-bottom-color 0.2s ease'
                   }}
                   onFocus={(e) => e.target.style.borderBottomColor = '#007bff'}
                   onBlur={(e) => e.target.style.borderBottomColor = '#ddd'}
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
        <div className="action-buttons full-width">
        
          <button className="action-btn add-btn" onClick={handleAddGroup}>
            <i className="fa fa-users"></i>
            Add
          </button>
           <button 
             className={`action-btn edit-btn ${!selectedGroup ? 'disabled' : ''}`} 
             onClick={handleEditGroup}
             disabled={!selectedGroup}
           >
             <i className="fa fa-pencil"></i>
             Edit
           </button>
           <button 
             className={`action-btn active-btn ${!selectedGroup ? 'disabled' : ''}`} 
             onClick={handleRetire}
             disabled={!selectedGroup}
           >
             <i className="fa fa-user-times"></i>
            Retire
           </button>
              <button 
             className={`action-btn active-btn ${!selectedGroup ? 'disabled' : ''}`} 
             onClick={handleResetpass}
             disabled={!selectedGroup}
           >
             <i className="fa fa-user-times"></i>
            Reset Password
           </button>
              <button 
             className={`action-btn active-btn ${!selectedGroup ? 'disabled' : ''}`} 
             onClick={handleLock}
             disabled={!selectedGroup}
           >
             <i className="fa fa-user-times"></i>
            Unlock
           </button>
              <button 
             className={`action-btn active-btn ${!selectedGroup ? 'disabled' : ''}`} 
             onClick={handleActiveDeactive}
             disabled={!selectedGroup}
           >
             <i className="fa fa-user-times"></i>
            Active/Deactive
           </button>
              <button 
             className={`action-btn active-btn ${!selectedGroup ? 'disabled' : ''}`} 
             onClick={handleApporveUsers}
             disabled={!selectedGroup}
           >
             <i className="fa fa-user-times"></i>
            Apporve
           </button>
              <button 
             className={`action-btn active-btn ${!selectedGroup ? 'disabled' : ''}`} 
             onClick={handleActiveDeactive}
             disabled={!selectedGroup}
           >
             <i className="fa fa-user-times"></i>
            ImportADS
           </button>
              <button 
             className="action-btn active-btn" 
             onClick={handleExport}
           >
             <i className="fa fa-download"></i>
            Export
           </button>
              <button 
             className="action-btn active-btn" 
             onClick={() => setimportuserpopup(true)}
           >
             <i className="fa fa-upload"></i>
            Import
           </button>
        </div>
        </div>
<div className="content-panels-container">
        {/* Data Table - jQWidgets Grid */}
        <div className="data-table-container full-width">
     
            <ReusableGrid
              data={ gridData }
              columns={gridColumns}
              width="100%"
              height={400}
              showfilterrow={true}
              filterable={true}
              sortable={true}
              onRowSelect={handleGridRowSelect}
              selectedRowIndex={selectedGroup ? gridData.findIndex(item => item.L01UserGroupID === selectedGroup.L01UserGroupID) : -1}
              // Color customization for status column
              activeColor="#28a745"    // Green for active status
              inactiveColor="#dc3545"  // Red for inactive/deactive status
              enableRowSelection={true}  // Enable row selection on cell click
              onScroll={(scrollInfo, event) => {
                console.log('Scroll position:', scrollInfo);
                console.log('Scroll Top:', scrollInfo.scrollTop);
                console.log('Scroll Left:', scrollInfo.scrollLeft);
              }}
            />
        </div>

        {/* Details Pane - Bottom */}
        <div className="details-pane-bottom full-width" style={{
          display: 'flex',
          flexDirection: 'column',
          padding: '15px 20px',
          backgroundColor: 'white',
          border: '1px solid #e9ecef',
          borderRadius: '4px'
        }}>
                  <div className="detail-item" style={{ display: 'flex', alignItems: 'center', flexDirection: 'row', lineHeight: '1.6', marginBottom: '8px'}}>
            <label style={{ fontWeight: '500', color: '#333', marginRight: '20px', minWidth: '150px', fontSize: '14px' }}>Email ID:</label>
            <span style={{ color: '#666', fontSize: '14px' }}>{selectedRowDetails.gEmail}</span>
          </div>
                    <div className="detail-item" style={{ display: 'flex', alignItems: 'center', flexDirection: 'row', lineHeight: '1.6', marginBottom: '8px'}}>
            <label style={{ fontWeight: '500', color: '#333', marginRight: '20px', minWidth: '150px', fontSize: '14px' }}>Prfile Image:</label>
            <span style={{ color: '#666', fontSize: '14px' }}>{selectedRowDetails.gCreatedBy}</span>
          </div>
                    <div className="detail-item" style={{ display: 'flex', alignItems: 'center', flexDirection: 'row', lineHeight: '1.6', marginBottom: '8px'}}>
            <label style={{ fontWeight: '500', color: '#333', marginRight: '20px', minWidth: '150px', fontSize: '14px' }}>Last Logged On:</label>
            <span style={{ color: '#666', fontSize: '14px' }}>{selectedRowDetails.gLastlogon}</span>
          </div>
                    <div className="detail-item" style={{ display: 'flex', alignItems: 'center', flexDirection: 'row', lineHeight: '1.6', marginBottom: '8px'}}>
            <label style={{ fontWeight: '500', color: '#333', marginRight: '20px', minWidth: '150px', fontSize: '14px' }}>Password Expiry Date:</label>
            <span style={{ color: '#666', fontSize: '14px' }}>{selectedRowDetails.gPasswordexpiredate}</span>
          </div>  
          <div className="detail-item" style={{ display: 'flex', alignItems: 'center', flexDirection: 'row', lineHeight: '1.6', marginBottom: '8px'}}>
            <label style={{ fontWeight: '500', color: '#333', marginRight: '20px', minWidth: '150px', fontSize: '14px' }}>Created By:</label>
            <span style={{ color: '#666', fontSize: '14px' }}>{selectedRowDetails.gCreatedBy}</span>
          </div>
          <div className="detail-item" style={{ display: 'flex', alignItems: 'center', flexDirection: 'row', lineHeight: '1.6', marginBottom: '8px' }}>
            <label style={{ fontWeight: '500', color: '#333', marginRight: '20px', minWidth: '150px', fontSize: '14px' }}>Created On:</label>
            <span style={{ color: '#666', fontSize: '14px' }}>{selectedRowDetails.gCreatedOn}</span>
          </div>
          <div className="detail-item" style={{ display: 'flex', alignItems: 'center', flexDirection: 'row', lineHeight: '1.6', marginBottom: '8px' }}>
            <label style={{ fontWeight: '500', color: '#333', marginRight: '20px', minWidth: '150px', fontSize: '14px' }}>Modified By:</label>
            <span style={{ color: '#666', fontSize: '14px' }}>{selectedRowDetails.gModifiedBy}</span>
          </div>
          <div className="detail-item" style={{ display: 'flex', alignItems: 'center', flexDirection: 'row', lineHeight: '1.6' }}>
            <label style={{ fontWeight: '500', color: '#333', marginRight: '20px', minWidth: '150px', fontSize: '14px' }}>Modified On:</label>
            <span style={{ color: '#666', fontSize: '14px' }}>{selectedRowDetails.gModifiedOn}</span>
          </div>
                    <div className="detail-item" style={{ display: 'flex', alignItems: 'center', flexDirection: 'row', lineHeight: '1.6', marginBottom: '8px'}}>
            <label style={{ fontWeight: '500', color: '#333', marginRight: '20px', minWidth: '150px', fontSize: '14px' }}>Domain:</label>
            <span style={{ color: '#666', fontSize: '14px' }}>{selectedRowDetails.gDomain}</span>
          </div>
                    <div className="detail-item" style={{ display: 'flex', alignItems: 'center', flexDirection: 'row', lineHeight: '1.6', marginBottom: '8px'}}>
            <label style={{ fontWeight: '500', color: '#333', marginRight: '20px', minWidth: '150px', fontSize: '14px' }}>Site:</label>
            <span style={{ color: '#666', fontSize: '14px' }}>{selectedRowDetails.gSite}</span>
          </div>
        </div>
        </div>
      </div>

      {/* UserRole Edit Component for both Add and Edit */}
      <UserMasterEdit 
        isOpen={isEditOpen}
        onClose={handleCloseEdit}
        selectedGroup={selectedGroup}
        onSave={handleSaveEdit}
        onRefresh={handlereferesh}
        mode={addEdit}
      />
      <AuditTrailPopup
        isOpen={showAuditTrailPopup}
        onClose={handleAuditTrailClose}
        onSubmit={handleAuditTrailSubmit}
        mode={addEdit}
      />

      {/* Confirmation Popup */}
      {showConfirmationPopup && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '25px',
            borderRadius: '6px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            minWidth: '600px',
            maxWidth: '700px',
            minHeight: '180px'
          }}>
            {/* Header */}
            <div style={{
              backgroundColor: '#f8f9fa',
              padding: '15px 25px',
              margin: '-25px -25px 25px -25px',
              borderRadius: '6px 6px 0 0',
              borderBottom: '1px solid #e9ecef'
            }}>
              <h3 style={{ 
                margin: 0, 
                fontSize: '18px',
                fontWeight: '600',
                color: '#2c3e50'
              }}>
                Confirmation
              </h3>
            </div>

            {/* Message */}
            <p style={{ 
              marginBottom: '25px', 
              fontSize: '16px', 
              color: '#495057',
              textAlign: 'center',
              lineHeight: '1.5'
            }}>
              {title}
            </p>

            {/* Buttons */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'flex-end', 
              gap: '15px',
              alignItems: 'center',
                   borderTop: '1px solid #e9ecef',
                   padding:'10px'
            }}>
              <span
                onClick={handleConfirmationNo}
                style={{
                  color: '#495057',
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: '500'
                }}
                onMouseOver={(e) => e.target.style.color = '#343a40'}
                onMouseOut={(e) => e.target.style.color = '#495057'}
              >
                cancel
              </span>
              <button
                onClick={handleConfirmationYes}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#e9ecef',
                  color: '#495057',
                  border: '1px solid #ced4da',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: '500'
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = '#dee2e6';
                  e.target.style.borderColor = '#adb5bd';
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = '#e9ecef';
                  e.target.style.borderColor = '#ced4da';
                }}
              >
                ok
              </button>
            </div>
          </div>
        </div>
      )}

       <WarningPopup
        isOpen={showWarningPopup}
        onClose={handleWarningClose}
        title={warningData.title}
        content={warningData.content}
        okButtonText="Ok"
      />
          <CustomPopup
              isOpen={importuserpopup}
              onClose={handlepopcolse}
              title={'Import Users'}
              content={
             <div style={{ padding: '15px', minWidth: '400px', maxWidth: '450px' }}>
               {/* File Input Section */}
               <div style={{ marginBottom: '15px' }}>
                 <label style={{ 
                   display: 'block', 
                   marginBottom: '8px', 
                   fontWeight: '500', 
                   color: '#333', 
                   fontSize: '14px' 
                 }}>
                   File <span style={{ color: 'red' }}>*</span>
                 </label>
                 
                 <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                   <button
                     type="button"
                     onClick={() => document.getElementById('fileInput').click()}
                     style={{
                       padding: '6px 12px',
                       backgroundColor: '#f8f9fa',
                       color: '#333',
                       border: '1px solid #ddd',
                       borderRadius: '4px',
                       cursor: 'pointer',
                       fontSize: '13px',
                       fontWeight: '500'
                     }}
                   >
                     Choose File
                   </button>
                   <span style={{ 
                     color: '#666', 
                     fontSize: '14px',
                     fontStyle: 'italic'
                   }}>
                     {fileName}
                   </span>
                 </div>
                 
                 <div style={{ 
                   height: '1px', 
                   backgroundColor: '#ddd', 
                   marginTop: '8px' 
                 }}></div>
               </div>

               {/* Note Section */}
               <div style={{ 
                 backgroundColor: '#f8f9fa', 
                 padding: '10px', 
                 borderRadius: '4px', 
                 marginBottom: '15px',
                 border: '1px solid #e9ecef'
               }}>
                 <p style={{ 
                   margin: 0, 
                   color: '#666', 
                   fontSize: '13px', 
                   lineHeight: '1.4' 
                 }}>
                   <strong>NOTE:-</strong> Allowed browse file extension are .xls and .xlsx and columns Username, Profile Name and User Status are mandatory.
                 </p>
               </div>

               {/* Action Buttons */}
               <div style={{ 
                 display: 'flex', 
                 justifyContent: 'flex-end', 
                 gap: '8px',
                 borderTop: '1px solid #e9ecef',
                 paddingTop: '12px'
               }}>
                 <button
                   type="button"
                   onClick={handlepopcolse}
                   style={{
                     padding: '6px 12px',
                     backgroundColor: 'white',
                     color: '#333',
                     border: '1px solid #ddd',
                     borderRadius: '4px',
                     cursor: 'pointer',
                     fontSize: '13px',
                     fontWeight: '500'
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
                   onClick={handleFileUpload}
                   style={{
                     padding: '6px 12px',
                     backgroundColor: '#007bff',
                     color: 'white',
                     border: 'none',
                     borderRadius: '4px',
                     cursor: 'pointer',
                     fontSize: '13px',
                     fontWeight: '500',
                     display: 'flex',
                     alignItems: 'center',
                     gap: '4px'
                   }}
                   onMouseEnter={(e) => {
                     e.target.style.backgroundColor = '#0056b3';
                   }}
                   onMouseLeave={(e) => {
                     e.target.style.backgroundColor = '#007bff';
                   }}
                 >
                   <i className="fa fa-upload" style={{ fontSize: '12px' }}></i>
                   Upload
                 </button>
               </div>

               {/* Hidden File Input */}
               <input
                 id="fileInput"
                 type="file"
                 accept=".xls,.xlsx"
                 onChange={handleFileChange}
                 style={{ display: 'none' }}
               />
             </div>
              }
            />
    </div>
  );



};

export default UserMastersView;

