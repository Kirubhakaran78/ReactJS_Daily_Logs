import React from 'react';
import './CustomPopup.css';

const CustomPopup = ({ 
  isOpen, 
  onClose, 
  title, 
  content, 
  showCloseButton = true,
  closeOnOverlayClick = true 
}) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="popup-overlay" onClick={handleOverlayClick}>
      <div className="popup-container">
        <div className="popup-header">
          <h3 className="popup-title">{title}</h3>
          {showCloseButton && (
            <button className="popup-close-btn" onClick={onClose}>
              <i className="fa fa-times"></i>
            </button>
          )}
        </div>
        <div className="popup-content">
          {content}
        </div>
      </div>
    </div>
  );
};

export default CustomPopup;
