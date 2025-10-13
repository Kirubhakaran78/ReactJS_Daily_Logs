import React, { useEffect, useState } from 'react'

function Counter() {
    const[count,setCount]=useState(0);
    const[calculation,setCalculation]=useState(0);

    useEffect(()=>{
        setCalculation(()=>count*2);
    },[count])

  return (
    <div>
      <p>Count: {count}</p>
      <button style={{padding:"20px"}} onClick={()=> setCount(c => c+1)}>+</button>
      <p>Calculations {calculation}</p>
    </div>
  )
}

export default Counter
