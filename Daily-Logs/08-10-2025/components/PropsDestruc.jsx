import React from 'react'

function PropsDestruc({color="red",brand,model,...rest}) { //color is default has low priority
  return (
    <div>
      <p>My car is {brand} and model is {model} and manufactured in {rest.manufacturedIn} in the year {rest.year} and car color is {color}</p>
    </div>
  )
}

export default PropsDestruc
