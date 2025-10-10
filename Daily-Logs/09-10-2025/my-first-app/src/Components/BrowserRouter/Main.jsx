import React from 'react'
import {BrowserRouter,Route,Routes,Link,NavLink} from 'react-router-dom'
import Home from "./Home"
import Contact from './Contact'
import Car from './Car'
import Bike from './Bike'

function Main() {
  return (
    <div>
      <BrowserRouter>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/contact">contact</Link>
      </nav>
      
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/contact" element={<Contact/>}>
            <Route path="car" element={<Car/>}/>
            <Route path="bike" element={<Bike/>}/>
        </Route>
      </Routes>
      </BrowserRouter>
    </div>
  )
}

export default Main
