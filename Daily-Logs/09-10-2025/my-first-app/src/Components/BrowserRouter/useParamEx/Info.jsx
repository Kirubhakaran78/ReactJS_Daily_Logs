import React from 'react'
import { useParams } from 'react-router-dom'

function Info() {
    const {firstname}=useParams();

  return (
    <div>
    <h1> Hello, {firstname}!</h1>
    </div>
  )
}

export default Info
