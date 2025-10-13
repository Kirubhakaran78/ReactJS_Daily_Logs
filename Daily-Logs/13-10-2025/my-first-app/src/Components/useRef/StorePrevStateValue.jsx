import React,{useEffect, useRef,useState} from 'react'

function StorePrevStateValue() {
    const[inputValue,setInputValue]=useState();
    const prevStateValue=useRef();

    useEffect(()=>{
        prevStateValue.current=inputValue
    },[inputValue])

  return (
    <div>
      
      <input type='text' value={inputValue} onChange={(e)=>setInputValue(e.target.value)}/>
      <h2>prev state Value: {prevStateValue.current}</h2>
      <h2>current state value: {inputValue}</h2>
    </div>
  )
}

export default StorePrevStateValue
