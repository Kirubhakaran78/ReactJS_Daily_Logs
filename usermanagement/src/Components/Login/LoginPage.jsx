import React, { useState, useEffect } from "react";
import './LoginPage.css';
import { CF_encrypt } from "../Common/EncrptDecrpt/encryption";
import { postAPI } from "../../Services/apicall";
import LoadingScreen from "../Common/LoadingScreen/LoadingScreen";
import { setCookie, CF_sessionSet, CF_sessionGet } from "../Common/CookieSessionStorage/CookieFun";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Common/Context/AuthContext";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formValues, setFormValues] = useState({
    site: "",
    loginUser: '',
    loginPassword: '',
    domain: '',
    timezone: '',
    sCategories:'',
    language: 'English'
  });
  
  const [passwordValues, setPasswordValues] = useState({
    newpassword: '',
    confirmpassword: ''
  });
  
  const [errors, setErrors] = useState({});
  const [sitesData, setSitesData] = useState([]);
  const [domainsData, setDomainsData] = useState([]);
  const [timezonesData, setTimezonesData] = useState([]);

  
   const languagesDatas= [{ language: "English"},
    { language: "Spanish" },
    { language: "French" }
  ]
  const [showPassword, setShowPassword] = useState(false);
  const [passOpen, setPassOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showMoreInfo, setShowMoreInfo] = useState(false);

     async function usernamepasswordcheck(data) {
      debugger
      try {
             const passObj = data;
               let Req = JSON.stringify(passObj);
      // const objdata = { "passObj": passObj };
         var objdata = { "passObj": CF_encrypt(Req) };
         var rows = await postAPI(objdata, "Login/NewpasswordGenerationValidation", true);
         const row = JSON.parse(rows);
         debugger
         if (row.Resp.Sts == "1") {
       
           if(row.Resp.desc.oResObj!= undefined){
              if(row.Resp.desc.oResObj.bStatus == false){
                let tempErrors = {};
                tempErrors.loginPassword = row.Resp.desc.oResObj.sInformation;
                  setErrors(tempErrors);
              }
            
         //    alert('Role updated successfully!');
           } else {

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
     async function passwordvalidationcheck(data) {
      debugger
      try {
             const passObj = data;
               let Req = JSON.stringify(passObj);
      // const objdata = { "passObj": passObj };
         var objdata = { "passObj": CF_encrypt(Req) };
         var rows = await postAPI(objdata, "Login/PasswordMessage", true);
         const row = JSON.parse(rows);
         debugger
         if (row.Resp.Sts == "1") {
       
           if(row.Resp.desc.oResObj!= undefined){
         
           } else {

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
    async function getTimeZones() {
      debugger
      try {
             const passObj = {};
               let Req = JSON.stringify(passObj);
      // const objdata = { "passObj": passObj };
         var objdata = { "passObj": CF_encrypt(Req) };
         var rows = await postAPI(objdata, "Login/getTimeZones", true);
         const row = JSON.parse(rows);
         debugger
         if (row.Resp.Sts == "1") {
       
           if(row.Resp.desc.TimeZones != undefined){
       console.log('Full timezone response:', row.Resp.desc.TimeZones);
       setTimezonesData(row.Resp.desc.TimeZones || []);
       if (row.Resp.desc.TimeZones && row.Resp.desc.TimeZones.length > 0) {

  debugger
  const localTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  console.log("Local system timezone:", localTimeZone);
  const matchedTimezone = row.Resp.desc.TimeZones.find(tz =>
    tz.sTimeZoneID === localTimeZone ||
    tz.sTimeZoneValue?.includes(localTimeZone)
  );

  if (matchedTimezone) {
    setFormValues(prev => ({ ...prev, timezone: matchedTimezone.sTimeZoneID }));
  } else {
     const asiaKolkataTimezone = row.Resp.desc.TimeZones.find(tz => 
           tz.sTimeZoneValue && (
             tz.sTimeZoneID.includes('Asia/Kolkata') 
           )
         );
         debugger
         if (asiaKolkataTimezone) {
           console.log('Setting default timezone to Asia/Kolkata (UTC+05:30):', asiaKolkataTimezone);
           setFormValues(prev => ({ ...prev, timezone: asiaKolkataTimezone.sTimeZoneID }));
         }
  }
}

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
            // Auto-select first site if available
            if (row.Resp.desc.sitelist && row.Resp.desc.sitelist.length > 0) {
              const firstSite = row.Resp.desc.sitelist[0];
              setFormValues(prev => ({ ...prev, site: firstSite.sSiteCode }));
              loadDomainCombo(firstSite);
            }
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


   async function loadDomainCombo(siteCode) {
      debugger
      try {
             const passObj = siteCode;
               let Req = JSON.stringify(passObj);
      // const objdata = { "passObj": passObj };
         var objdata = { "passObj": CF_encrypt(Req) };
         var rows = await postAPI(objdata, "Login/LoadDomainCombo", true);
         const row = JSON.parse(rows);
         debugger
         if (row.Resp.Sts == "1") {
       
           if(row.Resp.desc!= undefined){
            console.log('Full domain response:', row.Resp.desc);
            setDomainsData(row.Resp.desc || []);
            // Auto-select first domain if available
            // if (row.Resp.desc && row.Resp.desc.length > 0) {
            //   const firstDomain = row.Resp.desc[0];
            //  loadDomainCombo(firstDomain);
            // }
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
  // Load data on component mount
  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      try {
        // Set default session storage and cookie values
        setDefaultValues();
        
        // Load timezones first
        await getTimeZones();
        // Then load sites
        await loadSite();
      } catch (error) {
        console.error("Error loading initial data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // Function to set default session storage and cookie values
  const setDefaultValues = () => {
    try {
      // LicensedOrNot - encrypted
      CF_sessionSet('LicensedOrNot', 'true', 1);
      setCookie('LicensedOrNot', CF_encrypt('true'));
      
      // MultiLingual - en_US
      CF_sessionSet('MultiLingual', 'en_US', 0);
      setCookie('MultiLingual', 'en_US');
      
      // PasswordExpiry - false
      CF_sessionSet('PasswordExpiry', 'false', 0);
      setCookie('PasswordExpiry', 'false');
      
      // UTCStatus - encrypted
      CF_sessionSet('UTCStatus', 'true', 1);
      setCookie('UTCStatus', CF_encrypt('true'));
      
      // sShowUTCcol - encrypted
      CF_sessionSet('sShowUTCcol', 'true', 1);
      setCookie('sShowUTCcol', CF_encrypt('true'));
      
      console.log('Default session storage and cookie values set successfully');
    } catch (error) {
      console.error('Error setting default values:', error);
    }
  };


  useEffect(() => {
    debugger
    if (domainsData.length > 0 && !formValues.domain) {
      const firstDomain = domainsData[0];
      const domainValue = firstDomain.sDomainName;
      if (domainValue) {
        console.log('Fallback: Setting domain to first available:', domainValue);
        setFormValues(prev => ({ ...prev, domain: domainValue ,sCategories:firstDomain.sCategories}));
      }
    }
  }, [domainsData, formValues.domain]);
    async function loginservice(data) {
      debugger
      try {
             const passObj = data;
               let Req = JSON.stringify(passObj);
      // const objdata = { "passObj": passObj };
         var objdata = { "passObj": CF_encrypt(Req) };
         console.log('Sending login request:', objdata);
         var rows = await postAPI(objdata, "Login/Login", true);
         console.log('Login API response:', rows);
         const row = JSON.parse(rows);
         console.log('Parsed login response:', row);
         debugger
         if (row.Resp.Sts == "1") {
           if(row.Resp.desc.oResObj!= undefined){
              if(row.Resp.desc.oResObj.bStatus == false){
                // Login failed - show error message
                let tempErrors = {};
                tempErrors.loginPassword = row.Resp.desc.oResObj.sInformation;
                setErrors(tempErrors);
                setIsLoading(false);
              } else {
                // Login successful - store session data and redirect
                handleSuccessfulLogin(row.Resp.desc, data);
              }
           } else {
             // Handle case where oResObj is undefined but login is successful
             handleSuccessfulLogin(row.Resp.desc, data);
           }
         } else {
          // API returned error status
          let tempErrors = {};
          tempErrors.loginPassword = row.Resp.Msg || 'Login failed. Please try again.';
          setErrors(tempErrors);
          setIsLoading(false);
         }
       } catch (error) {
         console.error("Error during login:", error);
         let tempErrors = {};
         tempErrors.loginPassword = 'Network error. Please check your connection and try again.';
         setErrors(tempErrors);
         setIsLoading(false);
       }
     };

     // Handle successful login - store session data and redirect
     const handleSuccessfulLogin = (responseData, loginData) => {
       try {
        debugger
         // Extract user data from response
         const userData = responseData.oResObj || responseData;
         const activeUserDetails = userData.ActiveUserDetails || {};
         const userdetails = responseData.oResObj1;
         // Generate session ID if not provided
         const sessionId = userdetails.sSessionID;
        //  || generateSessionId();
         
         // Set additional session storage and cookie values after login
         setPostLoginValues(userdetails, sessionId,userData,responseData);
         
         // Store user session data in cookies
         const sessionData = {
           isAuthenticated: true,
           username: userdetails.sUserGroupName,
           site: userdetails.sSiteCode,
           domain: userdetails.sDomainName,
           categories: userdetails.sCategories,
           timezone: formValues.timezone,
           language: formValues.language,
           loginTime: new Date().toISOString(),
           // Store any additional data from the API response
           userData: userData,
           userdetails:userdetails,
           sessionId:sessionId,
           // Store the original login object for future API calls
           loginObj: loginData.loginObj
         };

         // Encrypt and store session data
         setCookie('userSession', JSON.stringify(sessionData));
         
         // Store individual values for easy access
         setCookie('username', userdetails.sUserGroupName);
         setCookie('site', userdetails.sSiteCode);
         setCookie('domain', userdetails.sDomainName);
         setCookie('isAuthenticated', 'true');

         console.log('Login successful, session stored');
         
         // Update auth context
         login(sessionData);
         
         // Clear any existing errors
         setErrors({});
         
         // Stop loading
         setIsLoading(false);
         
         // Navigate to main application
         navigate('/');
         
       } catch (error) {
         console.error('Error storing session data:', error);
         setIsLoading(false);
         let tempErrors = {};
         tempErrors.loginPassword = 'Error storing session data. Please try again.';
         setErrors(tempErrors);
       }
     };

     // Generate session ID
     const generateSessionId = () => {
       return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
         const r = Math.random() * 16 | 0;
         const v = c == 'x' ? r : (r & 0x3 | 0x8);
         return v.toString(16);
       });
     };

     // Set post-login session storage and cookie values
     const setPostLoginValues = (userDetails, sessionId,userData,responseData) => {
       try {
        debugger
         const activeUserDetails = userDetails || {};
         
         // ConcurrentUsersAvailableCount
         CF_sessionSet('ConcurrentUsersAvailableCount', userData.concurrentUsersAvailableCount, 0);
         setCookie('ConcurrentUsersAvailableCount', userData.concurrentUsersAvailableCount);
         
         // DownloadLinkLogoff - encrypted
         CF_sessionSet('DownloadLinkLogoff', responseData.DownloadLinkLogoff, 1);
         setCookie('DownloadLinkLogoff', CF_encrypt(JSON.stringify(responseData.DownloadLinkLogoff.toString())));
         
         // LicensedOrNot (update existing)
         CF_sessionSet('LicensedOrNot', userDetails.sLicenseCode, 1);
         setCookie('LicensedOrNot', CF_encrypt(JSON.stringify(userDetails.sLicenseCode)));
         
         // device - encrypted
         CF_sessionSet('device', 'Web', 1);
         setCookie('device', CF_encrypt('Web'));
         
         // iPortalStatus - encrypted
         CF_sessionSet('iPortalStatus', 'active', 1);
         setCookie('iPortalStatus', CF_encrypt('active'));
         
         // nIdleTime
         CF_sessionSet('nIdleTime', userData.nIdealTime, 0);
         setCookie('nIdleTime', userData.nIdealTime);
         
         // sCategories - encrypted
         const categories = activeUserDetails.sCategories || formValues.sCategories || 'DB';
         CF_sessionSet('sCategories', userDetails.sCategories, 1);
         setCookie('sCategories', CF_encrypt(userDetails.sCategories));
         
         // sDomainName - encrypted
         const domainName = activeUserDetails.sDomainName || formValues.domain || 'SDMS';
         CF_sessionSet('sDomainName', userDetails.sDomainName , 1);
         setCookie('sDomainName', CF_encrypt(userDetails.sDomainName));
         
         // sLanguage - encrypted
         const language = formValues.language || 'English';
         CF_sessionSet('sLanguage', language, 1);
         setCookie('sLanguage', CF_encrypt(language));
         
         // sSessionID - encrypted
         CF_sessionSet('sSessionID', userDetails.sSessionID, 1);
         setCookie('sSessionID', CF_encrypt(userDetails.sSessionID));
         
         // sSiteCode - encrypted
         const siteCode = activeUserDetails.sSiteCode || formValues.site || '';
         CF_sessionSet('sSiteCode', userDetails.sSiteCode, 1);
         setCookie('sSiteCode', CF_encrypt(userDetails.sSiteCode));
         
         // sSiteName - encrypted (get from sitesData)
         const siteName = sitesData.find(site => site.sSiteCode === siteCode)?.sSiteName || '';
         CF_sessionSet('sSiteName', userDetails.sSiteName, 1);
         setCookie('sSiteName', CF_encrypt(userDetails.sSiteName));
         
         // sTenantID - encrypted
         const tenantId = activeUserDetails.sTenantID || '';
         CF_sessionSet('sTenantID', tenantId, 1);
         setCookie('sTenantID', CF_encrypt(tenantId));
         debugger
         // sTimeZoneID - encrypted
         const timeZoneId = formValues.timezone + "<~>true" || '';
         CF_sessionSet('sTimeZoneID', timeZoneId , 1);
         setCookie('sTimeZoneID', CF_encrypt(timeZoneId ));
         
         // sTimeZoneValue - encrypted
         const timeZoneValue = timezonesData.find(tz => tz.sTimeZoneID === timeZoneId)?.sTimeZoneValue || '';
         CF_sessionSet('sTimeZoneValue', timeZoneValue , 1);
         setCookie('sTimeZoneValue', CF_encrypt(timeZoneValue ));
         
         // sUserGroupID - encrypted
         const userGroupId = activeUserDetails.sUserGroupID || '';
         CF_sessionSet('sUserGroupID', userGroupId, 1);
         setCookie('sUserGroupID', CF_encrypt(userGroupId));
         
         // sUserGroupName - encrypted
         const userGroupName = activeUserDetails.sUserGroupName || '';
         CF_sessionSet('sUserGroupName', userGroupName, 1);
         setCookie('sUserGroupName', CF_encrypt(userGroupName));
         
         // sUserID - encrypted
         const userId = activeUserDetails.sUserID || '';
         CF_sessionSet('sUserID', userId, 1);
         setCookie('sUserID', CF_encrypt(userId));
         
         // sUserStatus - encrypted
         const userStatus = activeUserDetails.sUserStatus || 'Active';
         CF_sessionSet('sUserStatus', userStatus, 1);
         setCookie('sUserStatus', CF_encrypt(userStatus));
         
         // sUsername - encrypted
         const username = activeUserDetails.sUsername || formValues.loginUser || '';
         CF_sessionSet('sUsername', username, 1);
         setCookie('sUsername', CF_encrypt(username));
         
         // sdbtype - encrypted
         const dbType = activeUserDetails.sdbtype || 'POSTGRESQL';
         CF_sessionSet('sdbtype', dbType, 1);
         setCookie('sdbtype', CF_encrypt(dbType));
         
         // upd - encrypted
         CF_sessionSet('upd', 'true', 1);
         setCookie('upd', CF_encrypt('true'));
         
         // AuditTrailValues
         const auditTrailValues = {
           sUserName: username,
           sUserPassword: "***", // Don't store actual password
           sReasonNo: 1,
           sReasonName: "Activated",
           sComments: "Login successful",
           sUserDomainName: domainName
         };
        //  CF_sessionSet('AuditTrailValues', JSON.stringify(auditTrailValues), 0);
        //  setCookie('AuditTrailValues', JSON.stringify(auditTrailValues));
         
         // ActiveUserDetails
         const activeUserDetailsObj = {
           sUsername: username,
           sCategories: categories,
           sSiteCode: siteCode,
           sUserID: userId,
           sUserDomainName: domainName,
           sUserGroupID: userGroupId,
           sTimeZoneID: timeZoneId,
           sSessionID: sessionId,
           sUserStatus: userStatus,
           sApplicationName: "UserManagement",
           sdbtype: dbType,
           sTenantID: tenantId
         };
         CF_sessionSet('ActiveUserDetails', JSON.stringify(activeUserDetailsObj), 0);
         setCookie('ActiveUserDetails', JSON.stringify(activeUserDetailsObj));
         
         console.log('Post-login session storage and cookie values set successfully');
       } catch (error) {
        debugger
         console.error('Error setting post-login values:', error);
       }
     };
  const handleInputChange = (e) => {
    debugger
    const { name, value } = e.target;
    console.log(`Changing ${name} to:`, value);
    setFormValues({
      ...formValues,
      [name]: value,
    });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
if(name == 'loginPassword'){
  let data ={
    "sUsername":formValues.loginUser,
"sSiteCode":formValues.site,
"ApplicationCode": "UserManagement",
}
// setTimeout(() => {

  usernamepasswordcheck(data);
//   passwordvalidationcheck(data);
// },100);

}
    // // If site changes, load domains for that site
    // if (name === 'site' && value) {
    //   loadDomainCombo(value);
    // }
  };

  const handlepasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordValues({
      ...passwordValues,
      [name]: value,
    });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const validate = () => {
    let tempErrors = {};
    if (!formValues.site) tempErrors.site = "Site is required";
    if (!formValues.loginUser) tempErrors.loginUser = "Username is required";
    if (!formValues.loginPassword) tempErrors.loginPassword = "Password is required";
    if (!formValues.domain) tempErrors.domain = "Domain is required";
    if (!formValues.timezone) tempErrors.timezone = "Timezone is required";
    
    console.log('Validation errors:', tempErrors);
    console.log('Form values being validated:', formValues);
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const validatepassword = () => {
    let tempErrors = {};
    if (!passwordValues.newpassword) tempErrors.newpassword = "New password is required";
    if (!passwordValues.confirmpassword) tempErrors.confirmpassword = "Confirm password is required";
    if(passwordValues.newpassword !== passwordValues.confirmpassword) {
      tempErrors.confirmpassword = "Passwords do not match";
    } 
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login form submitted with values:', formValues);
    if (validate()) {
      console.log('Form validation passed, starting login process');
      setIsLoading(true);
      // Simulate login process
      let passobj = {
    "ApplicationCode": "UserManagement",
    "loginObj": {
        "sUsername": formValues.loginUser,
        "sPassword": formValues.loginPassword,
        "sDomainName": formValues.domain,
        "sCategories": formValues.sCategories,
        "sSiteCode": formValues.site, 
        "sClientMachineName": "Windows 10",
        "bScreenLock": false
    },
    "sLoginFrom": "UserManagement",
    "sAvailableLicenseURL": "http://AGL66:8095/LicenseAPI/License/getAvailableLicenseCount"
}
      console.log('Calling loginservice with:', passobj);
      loginservice(passobj)
      // setTimeout(() => {
      //   setIsLoading(false);
      //   console.log('Login successful', formValues);
      //   alert('Login successful!');
      // }, 2000);
    }
  };

  const handlepasswordSubmit = (e) => {
    e.preventDefault();
    if (validatepassword()) {
      setIsLoading(true);
      // Simulate password update
      setTimeout(() => {
        setIsLoading(false);
        setPassOpen(false);
        setPasswordValues({ newpassword: '', confirmpassword: '' });
        alert('Password updated successfully!');
      }, 2000);
    }
  };

  const handleforgotpassword = (e) => {
    e.preventDefault();
    setPassOpen(true);
  };

  const handleMoreInfo = () => {
    setShowMoreInfo(!showMoreInfo);
  };

  return (
    <div className="login-container-simple">
          <LoadingScreen 
        isLoading={isLoading} 
      />
      {passOpen === false ? (
        <div className="login-form-box">
          <div className="login-header">
            <div className="logo-container">
              <div className="logo-icon">
                <div className="mobile-icon">📱</div>
                <div className="chart-icon">📊</div>
                <div className="lock-icon">🔒</div>
              </div>
              <div className="logo-text">
                <div className="company-name">Logilab</div>
                <div className="product-name">SDMS</div>
              </div>
            </div>
            <div className="version-number">v7.3_20250620_02</div>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-grid">
              <div className="form-field">
                <label className="form-label">Username</label>
                <input
                  type="text"
                  name="loginUser"
                  className={`form-input ${errors.loginUser ? 'error' : ''}`}
                  value={formValues.loginUser}
                  onChange={handleInputChange}
                  maxLength={50}
                  placeholder="Enter username"
                />
                {errors.loginUser && (
                  <span className="error-text">{errors.loginUser}</span>
                )}
              </div>

              <div className="form-field">
                <label className="form-label">Password</label>
                <div className="password-input-container">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="loginPassword"
                    className={`form-input ${errors.loginPassword ? 'error' : ''}`}
                    value={formValues.loginPassword}
                    onChange={handleInputChange}
                    maxLength={50}
                    placeholder="Enter password"
                  />
                  {formValues.loginPassword && (
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={handleClickShowPassword}
                    >
                      {showPassword ? '👁️' : '👁️‍🗨️'}
                    </button>
                  )}
                </div>
                {errors.loginPassword && (
                  <span className="error-text">{errors.loginPassword}</span>
                )}
              </div>

            </div>

            <div className="more-info-container">
              <button
                type="button"
                className="more-info-link"
                onClick={handleMoreInfo}
              >
                More Information
                <span className="arrow-icon">{showMoreInfo ? '▲' : '>>'}</span>
              </button>
            </div>

            {showMoreInfo && (
              <div className="more-info-section">
                <div className="form-field">
                  <label className="form-label">Site</label>
                  <select
                    name="site"
                    className={`form-select ${errors.site ? 'error' : ''}`}
                    value={formValues.site}
                    onChange={handleInputChange}
                 
                  >
                    <option value="DFT">Default</option>
                    {sitesData.map((data, idx) => {
                      return (
                        <option key={idx} value={data.sSiteCode}>
                          {data.sSiteName}
                        </option>
                      );
                    })}
                  </select>
                  {errors.site && (
                    <span className="error-text">{errors.site}</span>
                  )}
                </div>

                <div className="form-field">
                  <label className="form-label">Domain</label>
                  <select
                    name="domain"
                    className={`form-select ${errors.domain ? 'error' : ''}`}
                    value={formValues.domain}
                    onChange={handleInputChange}
                    disabled={isLoading || !formValues.site}
                  >
                    {/* <option value="">Select Domain</option> */}
                    {domainsData.map((data, idx) => {

                      return (
                        <option key={idx} value={data.sDomainName}>
                          {data.sDomainName}
                        </option>
                      );
                    })}
                  </select>
                  {errors.domain && (
                    <span className="error-text">{errors.domain}</span>
                  )}
                </div>

                <div className="form-field">
                  <label className="form-label">Time Zone</label>
                  <select
                    name="timezone"
                    className={`form-select ${errors.timezone ? 'error' : ''}`}
                    value={formValues.timezone}
                    onChange={handleInputChange}
                    disabled={isLoading}
                  >
                    <option value="">Select Time Zone</option>
                    {timezonesData.map((data, idx) => {
                      return (
                        <option key={idx} value={data.sTimeZoneID}>
                          {data.sTimeZoneValue}
                        </option>
                      );
                    })}
                  </select>
                  {errors.timezone && (
                    <span className="error-text">{errors.timezone}</span>
                  )}
                </div>

                <div className="form-field">
                  <label className="form-label">Language</label>
                  <select
                    name="language"
                    className={`form-select ${errors.language ? 'error' : ''}`}
                    value={formValues.language}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Language</option>
                    {languagesDatas.map((data, idx) => (
                      <option key={idx} value={data.language}>
                        {data.language}
                      </option>
                    ))}
                  </select>
                  {errors.language && (
                    <span className="error-text">{errors.language}</span>
                  )}
                </div>
              </div>
            )}

            <button
              type="submit"
              className="login-button"
              disabled={isLoading}
            >
              Login
            </button>

            <div className="forgot-password-container">
              <button
                type="button"
                className="forgot-password-link"
                onClick={handleforgotpassword}
              >
                Forgot Password?
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="login-form-box">
          <h2 className="login-title">Reset Password</h2>
          <p className="login-subtitle">Please enter your new password</p>

          <form onSubmit={handlepasswordSubmit} className="login-form">
            <div className="form-grid">
              <div className="form-field">
                <label className="form-label">New Password</label>
                <input
                  type="password"
                  name="newpassword"
                  className={`form-input ${errors.newpassword ? 'error' : ''}`}
                  value={passwordValues.newpassword}
                  onChange={handlepasswordInputChange}
                  maxLength={50}
                  placeholder="Enter new password"
                />
                {errors.newpassword && (
                  <span className="error-text">{errors.newpassword}</span>
                )}
              </div>

              <div className="form-field">
                <label className="form-label">Confirm Password</label>
                <input
                  type="password"
                  name="confirmpassword"
                  className={`form-input ${errors.confirmpassword ? 'error' : ''}`}
                  value={passwordValues.confirmpassword}
                  onChange={handlepasswordInputChange}
                  maxLength={50}
                  placeholder="Confirm new password"
                />
                {errors.confirmpassword && (
                  <span className="error-text">{errors.confirmpassword}</span>
                )}
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="cancel-button"
                onClick={() => setPassOpen(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="login-button"
                disabled={isLoading}
              >
                {isLoading ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="document-files-section">
        <div className="circle-container">
          <img src="/images/sdmsloginlog.png" alt="SDMS Logo" className="center-logo" />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
