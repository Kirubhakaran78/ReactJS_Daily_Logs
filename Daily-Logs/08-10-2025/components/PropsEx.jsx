import React from 'react'

function PropsEx(props) {
  return (
    <div>
      <h3>{props.person.name} and i am from the city called {props.person.Address.city}</h3>
      <h4>My cars are: {props.carinfo[0]} and {props.carinfo[1]}</h4>
    </div>
  )
}

export default PropsEx
