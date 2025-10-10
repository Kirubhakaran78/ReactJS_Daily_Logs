import React from 'react'
import Car from './Car'
import Bike from './Bike'
import { Link, Outlet } from 'react-router-dom'

function Contact() {
  return (
    <div>
      <h1>contact page</h1>
      <nav>
        <Link to="/contact/bike">Bike</Link>
        <Link to="/contact/car">Car</Link>
      </nav>
      
      <Outlet/> 
      {/* specifies where to render the child component */}
    </div>
  )
}

export default Contact
