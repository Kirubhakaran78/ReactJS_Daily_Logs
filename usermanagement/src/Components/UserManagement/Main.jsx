import React, { useState, useEffect } from 'react';

// import ReusableGrid from '../../utils/ReusableGrid';
import { useCombobox,useDatePicker } from '../../Components/utils/jqwidgetsMigration';
// import CustomPopup from '../Common/CustomPopup';
import UserRoleView from './UserRole/UserRoleView';
import UserMastersView from './UserMasters/UserMastersView';
import UserRightsView from './UserRights/UserRightsView';
import OnlineUsers from './OnlineUsers/OnlineUsers';



const Main = () => {
  const [activeTab, setActiveTab] = useState('usergroup');
  const [sortStatus, setSortStatus] = useState('none');
  const [gridData, setGridData] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [newGroupData, setNewGroupData] = useState({
    name: '',
    description: '',
    status: 'Active'
  });

  const tabs = [
    { id: 'usergroup', name: 'User Role' },
    { id: 'usermaster', name: 'User Master' },
    // { id: 'userrights', name: 'User Rights' },
    { id: 'onlineusers', name: 'Online Users' }
  ];

  // Sample data for the grid
  const sampleData = [
];

  // Grid configuration
  const gridColumns = [
    { text: 'User Group Name', datafield: 'name', width: '60%' },
    { text: 'Status', datafield: 'status', width: '40%' }
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

  const handleSortChange = (sortType) => {
    setSortStatus(sortType);
  };

  const handleAddGroup = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    // Reset form data when closing
    setNewGroupData({
      name: '',
      description: '',
      status: 'Active'
    });
  };

  const handleInputChange = (field, value) => {
    setNewGroupData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveGroup = () => {
    // Validate form
    if (!newGroupData.name.trim()) {
      alert('Please enter a group name');
      return;
    }

    // Save group logic here
    console.log('Saving new group:', newGroupData);
    
    // Add to grid data
    const newGroup = {
      id: Date.now(), // Simple ID generation
      name: newGroupData.name,
      status: newGroupData.status
    };
    
    setGridData(prev => [...prev, newGroup]);
    
    // Close popup and reset form
    handleClosePopup();
  };

  const handleEditGroup = () => {
    // Edit group logic
    console.log('Edit group clicked');
  };

  const handleActiveDeactive = () => {
    // Active/Deactive logic
    console.log('Active/Deactive clicked');
  };

  // Load combobox data
  useEffect(() => {
    const timer = setTimeout(() => {
      if (statusFilterRef.current) {
        try {
          const $ = window.$;
          const combobox = $(statusFilterRef.current);
          
          const source = {
            datatype: "json",
            localdata: [
              { text: 'All', value: '' },
              { text: 'Active', value: 'Active' },
              { text: 'Inactive', value: 'Inactive' }
            ]
          };
          
          const dataAdapter = new $.jqx.dataAdapter(source);
          combobox.jqxComboBox('source', dataAdapter);
        } catch (error) {
          console.error('Error loading combobox data:', error);
        }
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="user-group-management">
      {/* Tab Navigation */}
      <div className="tab-navigation">
        {tabs.map(tab => (
          <div 
            key={tab.id}
            className={`tab-item ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.name}
          </div>
        ))}
      </div>

      {/* Tab Content - Render component based on active tab */}
      <div className="tab-content">
        {activeTab === 'usergroup' && <UserRoleView />}
        {activeTab === 'usermaster' && <UserMastersView />}
        {/* {activeTab === 'userrights' && <UserRightsView />} */}
        {activeTab === 'onlineusers' && <OnlineUsers />}
      </div>
    </div>
  );
};

export default Main;

