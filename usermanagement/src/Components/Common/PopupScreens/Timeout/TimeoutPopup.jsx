import React, { useState } from 'react';
import { useAuth } from '../../Context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './TimeoutPopup.css';

const TimeoutPopup = ({ onClose, onLogin }) => {
  const [username, setUsername] = useState('Administrator');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Call the login function passed from parent
      await onLogin(username, password);
      onClose();
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/Login');
  };

  return (
    <div className="timeout-popup-overlay">
      <div className="timeout-popup-container">
        <div className="timeout-popup-header">
          <h2 className="timeout-popup-title">Server Timeout</h2>
        </div>
        
        <div className="timeout-popup-content">
          <form onSubmit={handleLogin} className="timeout-login-form">
            <div className="form-field">
              <label className="form-label">Username *</label>
              <input
                type="text"
                className="form-input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            
            <div className="form-field">
              <label className="form-label">Password *</label>
              <input
                type="password"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <div className="timeout-message">
              <p className="error-text">
                User is logged out while user trying to refresh, reload and closing browser by manually. 
                Please login here to continue your further process
              </p>
            </div>
            
            <div className="timeout-popup-actions">
              <button
                type="submit"
                className="login-button"
                disabled={isLoading}
              >
                {isLoading ? 'Logging in...' : (
                  <>
                    <i className="fa fa-arrow-right"></i>
                    Login
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TimeoutPopup;
