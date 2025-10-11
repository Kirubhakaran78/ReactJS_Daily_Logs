import React from 'react'
import { Navigate } from 'react-router-dom'

function ProtectedPage({children}) {
  
    const isLoggedIn=localStorage.getItem("isLoggedIn")==="true";

    console.log(isLoggedIn)

    if(!isLoggedIn){
       return <Navigate to="/Login"/>;
    }

    return children;

}

export default ProtectedPage
