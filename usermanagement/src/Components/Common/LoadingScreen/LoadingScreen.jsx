import React from 'react';
import './LoadingScreen.css';

const LoadingScreen = ({ 
  isLoading, 
  message = "Loading...", 
  showSpinner = true,
  overlay = true 
}) => {
  if (!isLoading) return null;

  return (
    <div className={`loading-overlay ${overlay ? 'with-overlay' : 'no-overlay'}`}>
      <div>
        {showSpinner && (
          <div className="loading-spinner">
            <div className="spinner"></div>
          </div>
        )}
 
      </div>
    </div>
  );
};

export default LoadingScreen;
