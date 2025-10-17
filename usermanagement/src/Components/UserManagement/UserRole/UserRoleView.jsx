import React, { useState, useEffect } from 'react';
import { useCombobox, useDatePicker } from '../../utils/jqwidgetsMigration';
import ReusableGrid from '../../utils/ReusableGrid';
// import CustomPopup from '../../Common/CustomPopup';
import UserRoleEdit from './UserRoleEdit';
import { postAPI } from '../../../Services/apicall';
import { CF_encrypt } from '../../Common/EncrptDecrpt/encryption';
import LoadingScreen from '../../Common/LoadingScreen/LoadingScreen';
import { getCookie, getCookienormal} from "../../../Components/Common/CookieSessionStorage/CookieFun";
import AuditTrailPopup from '../../Common/PopupScreens/Audittrail/AuditTrailPopup'
import { useAuth } from '../../Common/Context/AuthContext';
import { CF_sessionSet, CF_sessionGet } from '../../Common/CookieSessionStorage/CookieFun';
const UserRoleView = () => {  
      const { user } = useAuth();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [isLoading,setisLoading] = useState(false)
    const [addEdit, setAddEdit] = useState("add");
      const [showAuditTrailPopup, setShowAuditTrailPopup] = useState(false);
  const [showConfirmationPopup, setShowConfirmationPopup] = useState(false);
  const [gridData, setGridData] = useState([]);
  const [selectedRowDetails, setSelectedRowDetails] = useState({
    gCreatedBy: '',
    gCreatedOn: '',
    gModifiedBy: '',
    gModifiedOn: ''
  });
  

  // Grid configuration
  const gridColumns = [
    { text: 'User Group Name', datafield: 'name', width: '25%' },
    { text: 'Application Name', datafield: 'sApplicationCodes', width: '35%' },
    { text: 'Status', datafield: 'status', width: '20%' }
  ];

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
    if (selectedGroup) {
      setIsEditOpen(true);
          setAddEdit('edit')
    } else {
      alert('Please select a group to edit');
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
      gCreatedBy: rowData.gCreatedBy || 'N/A',
      gCreatedOn: rowData.gCreatedOn || 'N/A',
      gModifiedBy: rowData.gModifiedBy || 'N/A',
      gModifiedOn: rowData.gModifiedOn || 'N/A'
    });
  };

   function handleActiveDeactive (){
    // Open confirmation popup first
    if (selectedGroup) {
      setShowConfirmationPopup(true);
    } else {
      alert('Please select a group to activate/deactivate');
    }
  };

  const handleConfirmationYes = () => {
    // Close confirmation popup and open audit trail popup
    setShowConfirmationPopup(false);
    setAddEdit('activeDeactive');
    setShowAuditTrailPopup(true);
  };

  const handleConfirmationNo = () => {
    // Just close the confirmation popup
    setShowConfirmationPopup(false);
  };
     async function ActiveDeactiveUserRole(req) {
      try {
        setisLoading(true)
         let Req = JSON.stringify(req);
         var objdata = { "passObj": CF_encrypt(Req) };
         var rows = await postAPI(objdata, "User/UserGroupActDeactBtnclick", true);
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
getAllRoles() 
  }, []);
  const handlereferesh = ()=>{
    // Store the currently selected group before refresh
    const currentSelectedGroup = selectedGroup;
    getAllRoles(currentSelectedGroup) 
  }
    async function getAllRoles(selectedGroupToMaintain = null) {
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
          
          if (row.Resp.Sts == "1") {
              setisLoading(false)
            if(row.Resp.desc.oResObj == undefined){
              setGridData([]);
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
           setGridData(modifiedData);
           
           // Restore selected group if it was maintained during refresh
           if (selectedGroupToMaintain) {
             const restoredGroup = modifiedData.find(item => 
               item.L01UserGroupID === selectedGroupToMaintain.L01UserGroupID
             );
             if (restoredGroup) {
               setSelectedGroup(restoredGroup);
               setSelectedRowDetails({
                 gCreatedBy: restoredGroup.gCreatedBy || 'N/A',
                 gCreatedOn: restoredGroup.gCreatedOn || 'N/A',
                 gModifiedBy: restoredGroup.gModifiedBy || 'N/A',
                 gModifiedOn: restoredGroup.gModifiedOn || 'N/A'
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
          "ActDeactObj": {
            "sGroupname": selectedGroup.L01UserGroupID,
            "sCreatedBy": selectedGroup.gCreatedBy,
            "sUserStatus": selectedGroup.gStatus,
            "sUserGroupID": selectedGroup.L01UserGroupID,
          },
          "AuditTrailValues": auditTrailValues,
          "sApplicationCodes": "Usermanagement",
          "ActiveUserDetails": JSON.parse(usrdetail)
        };
        await ActiveDeactiveUserRole(data);
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
  return (
    <div className="user-group-management">

      <LoadingScreen 
        isLoading={isLoading} 
        message="Please wait..." 
      />
      {/* UserRoleView Content Area */}
      <div className="UserRoleView-content-area full-width">
        {/* Action Buttons */}
        <div className="action-buttons full-width">
          <button className="action-btn add-btn" onClick={handleAddGroup}>
            <i className="fa fa-users"></i>
            Add New Role
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
             onClick={handleActiveDeactive}
             disabled={!selectedGroup}
           >
             <i className="fa fa-user-times"></i>
             Active/Deactive
           </button>
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
        </div>
        </div>
      </div>

      {/* UserRole Edit Component for both Add and Edit */}
      <UserRoleEdit 
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
              confiramationactdeact
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
    </div>
  );



};

export default UserRoleView;

