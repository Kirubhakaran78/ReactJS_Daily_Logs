import React from 'react'
import { Navigate } from 'react-router-dom'

function PublicPage({children}) {

const isLoggedIn=localStorage.getItem("isLoggedIn")==="true";

if(isLoggedIn){
    return <Navigate to="/HomePage"/>
}

  return children;
}

export default PublicPage
