import React from 'react'

function Child1(props) {
  return (
    <div>
      <h1>child 1</h1>
      <p>{props.children}</p>
    </div>
  )
}

export default Child1
