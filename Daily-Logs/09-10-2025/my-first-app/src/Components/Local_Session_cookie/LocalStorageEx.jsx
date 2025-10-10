import React, {  useEffect, useState } from 'react'

function LocalStorageEx() {
    const[username,setUserName]=useState("");

    useEffect(()=>{
       const savedUserName=localStorage.getItem("username");
       if(savedUserName) setUserName(savedUserName) 
    },[])


    useEffect(()=>{
        localStorage.setItem("username",username)
    },[username])

  return (
    <div>
      <h1>Local Storage Example</h1>
      <label htmlFor="input"></label>
      <input type="text" id='input' value={username} onChange={(e)=>setUserName(e.target.value)} />
    </div>
  )
}

export default LocalStorageEx
