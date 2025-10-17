import React, { useState, useEffect } from 'react';
import { getCookieSync } from '../../CookieSessionStorage/CookieFun';
import './AuditTrailPopup.css';
import CustomPopup from '../Editpage/CustomPopup'
const AuditTrailPopup = ({ isOpen, onClose, onSubmit, mode = 'add' }) => {
  const [auditData, setAuditData] = useState({
    sUserName: '',
    sUserPassword: '',
    sReasonNo: 1,
    sReasonName: 'Activated',
    sComments: 'ok'
  });

  // Load username from cookies when component mounts or popup opens
  useEffect(() => {
    if (isOpen) {
      const username = getCookieSync('username') || getCookieSync('sUsername') || 'Administrator';
      setAuditData(prev => ({
        ...prev,
        sUserName: username
      }));
    }
  }, [isOpen]);

  const reasonOptions = [
    { value: 1, label: 'Activated' },
    { value: 2, label: 'Deactivated' },
    { value: 3, label: 'Created' },
    { value: 4, label: 'Updated' },
    { value: 5, label: 'Deleted' },
    { value: 6, label: 'Modified' },
    { value: 7, label: 'Approved' },
    { value: 8, label: 'Rejected' }
  ];

  const handleInputChange = (field, value) => {
    setAuditData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!auditData.sUserPassword.trim()) {
      alert('Please enter password');
      return;
    }
    if (!auditData.sComments.trim()) {
      alert('Please enter comments');
      return;
    }
    onSubmit(auditData);
  };

  const handleCancel = () => {
    setAuditData({
      sUserName: '',
      sUserPassword: '',
      sReasonNo: 1,
      sReasonName: 'Activated',
      sComments: 'ok'
    });
    onClose();
  };

  return (
    <>
         <CustomPopup
        isOpen={isOpen }
        onClose={handleCancel}
        title={mode === 'edit' ? 'Edit Role' : 'Add New Role'}
        content={
             <div >
          <form onSubmit={handleSubmit} >
            <div >
              <label className="form-label">Username *</label>
              <input
                type="text"
                className="form-input form-input-disabled"
                value={auditData.sUserName}
                disabled
                placeholder="Username from session"
              />
            </div>
            
            <div >
              <label className="form-label">Password *</label>
              <input
                type="password"
                className="form-input"
                value={auditData.sUserPassword}
                onChange={(e) => handleInputChange('sUserPassword', e.target.value)}
                placeholder="Enter password"
                required
              />
            </div>
            
            <div >
              <label className="form-label">Reason *</label>
              <select
                className="form-select"
                value={auditData.sReasonNo}
                onChange={(e) => {
                  const selectedReason = reasonOptions.find(opt => opt.value === parseInt(e.target.value));
                  handleInputChange('sReasonNo', parseInt(e.target.value));
                  handleInputChange('sReasonName', selectedReason.label);
                }}
                required
              >
                {reasonOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-field">
              <label className="form-label">Comments *</label>
              <textarea
                className="form-textarea"
                value={auditData.sComments}
                onChange={(e) => handleInputChange('sComments', e.target.value)}
                placeholder="Enter reason for this action..."
                rows="3"
                required
              />
            </div>
            
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
                  onClick={handleCancel}
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
                  type="submit"
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
          </form>
        </div>
        }
      />
  </>
  );
};

export default AuditTrailPopup;
