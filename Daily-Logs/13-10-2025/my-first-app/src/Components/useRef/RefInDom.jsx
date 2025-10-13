import React, { useRef } from 'react'

function RefInDom() {
const inputElement=useRef();

const focusInput=()=>{
    inputElement.current.focus();
}

  return (
    <div>
      <input type="text" ref={inputElement} />
      <button onClick={focusInput}>click to focus</button>
    </div>
  )
}

export default RefInDom
