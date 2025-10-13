import React, { useEffect, useRef, useState } from 'react'

function CountRender() {
    //count we render the component
    const[count,setCount]=useState();

    const countRen = useRef(0);

    useEffect(()=>{
        countRen.current+=1;
    })

  return (
    <div>
      <input type="text" onChange={(e)=>setCount(e.target.value)} />
      <p>How many times the component Re-renders: {countRen.current}</p>
    </div>
  )
}

export default CountRender
