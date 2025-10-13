import React,{useContext} from 'react'
import { UserContext } from './Component1';

function Component3() {
const {count,setCount}=useContext(UserContext);

  return (
    <div>
      <h2>Component3  {count}</h2>
      <button onClick={()=>setCount(c=>c+1)}>click to increase</button>
    </div>
  )
}

export default Component3
