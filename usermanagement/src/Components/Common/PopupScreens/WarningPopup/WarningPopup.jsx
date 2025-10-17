import React from 'react';
import './WarningPopup.css';

const WarningPopup = ({ 
  isOpen, 
  onClose, 
  title = "Warning", 
  content = "", 
  showOkButton = true,
  okButtonText = "Ok",
  closeOnOverlayClick = false 
}) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleOkClick = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="warning-popup-overlay" onClick={handleOverlayClick}>
      <div className="warning-popup-container">
        <div className="warning-popup-header">
          <h3 className="warning-popup-title">{title}</h3>
        </div>
        <div className="warning-popup-content">
          <div className="warning-popup-message">{content}</div>
          {showOkButton && (
            <div className="warning-popup-button-container">
              <button className="warning-popup-ok-btn" onClick={handleOkClick}>
                {okButtonText}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WarningPopup;
