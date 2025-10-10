import React from 'react'

function EventsEx() {
    const shoot=(a,b)=>{
        alert(b.type);
        console.log(a);
    }
  return (
    <div>
      <button onClick={(event)=>shoot("Goal",event)}>click me</button>
    </div>
  )
}

export default EventsEx
