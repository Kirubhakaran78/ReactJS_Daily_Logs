import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCookie, getCookieSync, removeCookie } from '../CookieSessionStorage/CookieFun';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check authentication status on app load
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // First check if isAuthenticated cookie exists (synchronous check)
        const authStatus = getCookieSync('isAuthenticated');
        
        if (authStatus === 'true') {
          // If authenticated, get the full session data
          const userSession = await getCookie('userSession');
          
          if (userSession) {
            try {
              const sessionData = JSON.parse(userSession);
              setIsAuthenticated(true);
              setUser(sessionData);
            } catch (parseError) {
              console.error('Error parsing session data:', parseError);
              // Fallback: try to reconstruct session from individual cookies
              const username = getCookieSync('username');
              const site = getCookieSync('site');
              const domain = getCookieSync('domain');
              
              if (username) {
                const fallbackSession = {
                  isAuthenticated: true,
                  username: username,
                  site: site || '',
                  domain: domain || '',
                  categories: '',
                  timezone: 'Asia/Kolkata',
                  language: 'English',
                  loginTime: new Date().toISOString()
                };
                setIsAuthenticated(true);
                setUser(fallbackSession);
              } else {
                setIsAuthenticated(false);
                setUser(null);
              }
            }
          } else {
            // Fallback: try to reconstruct session from individual cookies
            const username = getCookieSync('username');
            const site = getCookieSync('site');
            const domain = getCookieSync('domain');
            
            if (username) {
              const fallbackSession = {
                isAuthenticated: true,
                username: username,
                site: site || '',
                domain: domain || '',
                categories: '',
                timezone: 'Asia/Kolkata',
                language: 'English',
                loginTime: new Date().toISOString()
              };
              setIsAuthenticated(true);
              setUser(fallbackSession);
            } else {
              setIsAuthenticated(false);
              setUser(null);
            }
          }
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
  };

  const logout = () => {
    // Clear all session cookies
    removeCookie('isAuthenticated');
    removeCookie('userSession');
    removeCookie('username');
    removeCookie('site');
    removeCookie('domain');
    
    // Clear state
    setIsAuthenticated(false);
    setUser(null);
  };

  const value = {
    isAuthenticated,
    user,
    loading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
