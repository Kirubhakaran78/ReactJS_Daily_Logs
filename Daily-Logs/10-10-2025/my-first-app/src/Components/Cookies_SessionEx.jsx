import React, { useEffect, useState } from 'react'

function Cookies_SessionEx() {
    const[cookiesVal,setCookiesVal]=useState();
    const[sessionVal,setSessionVal]=useState();

    //displaying the session and cookie
    const[cookieDisplay,setCookiedisplay]=useState(getCookie("userName") || "");
    const[sessionDisplay,setSessionDisplay]=useState(sessionStorage.getItem("sessionData") || "");


    useEffect(()=>{
        const savedCookie=getCookie("userName");
        const savedSession=sessionStorage.getItem("sessionData");

        if(savedCookie){
            setCookiesVal(savedCookie)
        }
        if(savedSession){
            setSessionVal(savedSession)
        }
    },[])

    const setCookie=(name,value,days)=>{
        const existing = getCookie(name) || "";
        const newValue =existing ? existing +" , "+value : value;

        const day=new Date();
        day.setTime(day.getTime() + days*24*60*60*1000);
        const expires="expires="+day.toUTCString();
        document.cookie=`${name}=${newValue};${expires};path=/`;
    }

    function getCookie(name){
        const cookies=document.cookie.split(";");
        for(let cookie of cookies){
            const[key,value]=cookie.split("=");
            if(key===name){
                return value;
            }
        }
        return "";
    }

    const deleteCookie=(name)=>{
        document.cookie=`${name}=;expires=Thu, 01 Jan 1900 00:00:00 UTC;path=/`;
    }

    function handleSave(){
        setCookie("userName",cookiesVal,7);

        setCookiedisplay(cookiesVal);

        //session Storage
        const existingSession=sessionStorage.getItem("sessionData");
        const newSessionValue= existingSession ? existingSession+" , "+sessionVal :sessionVal;
        
        sessionStorage.setItem("sessionData",newSessionValue);
        setSessionDisplay(newSessionValue);

        setCookiesVal("");
        setSessionVal("");
        
        alert("Data Saved Successfully");

        



    }
    
    function handleClear(){
        deleteCookie("userName");
        sessionStorage.removeItem("sessionData");
        setCookiesVal("");
        setSessionVal("");
        alert("Data Deleted Successfully");
    }




  return (
    <div>
      <label htmlFor="cookie_value">Cookie Value : </label>
      <input type="text" id='cookie_value' value={cookiesVal} onChange={(e)=>setCookiesVal(e.target.value)} />
      <br /><br />
      <label htmlFor="session_val">Session Value : </label>
      <input type="text" id='session_val' value={sessionVal} onChange={(e)=>setSessionVal(e.target.value)} />
      <br />
      <button onClick={handleSave}>Save</button>
      <br />
      <button onClick={handleClear}>Clear</button>
      <br />
      <h3>Cookie and session Data</h3>
      <p>
        Cookies (userName):
        {getCookie("userName") || "None"}
      </p>
      <br />
      <p>
        Session Data: 
        {sessionStorage.getItem("sessionData") || "None"}
      </p>
    </div>
  )
}

export default Cookies_SessionEx
