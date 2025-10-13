import React,{createContext, useState} from 'react'
import Component2 from "./Component2"


    export const UserContext=createContext();

function Component1() {
    const[count,setCount]=useState(0);


  return (
    <div>
      <h2>Component 1</h2>

      <UserContext.Provider value={{count,setCount}}>
      <Component2/>
      </UserContext.Provider>
    </div>
  )
}

export default Component1
