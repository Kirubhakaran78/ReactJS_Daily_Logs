import React, { useState,useEffect } from 'react'

function Timer() {
    const[count,setCount]=useState(0);

    useEffect(()=>{
        let timer=setTimeout(()=>{
            setCount(count => count+1);
        },2000)

        return ()=> clearTimeout(timer) //to cleanup to reduce the memory leaks
    },[])

  return (
    <div>
      <h2>I rendered for {count} times...!</h2>
    </div>
  )
}

export default Timer
