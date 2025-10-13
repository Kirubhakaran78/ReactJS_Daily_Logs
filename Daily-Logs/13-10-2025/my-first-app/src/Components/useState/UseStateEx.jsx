import React, { useEffect, useState } from 'react'

function UseStateEx() {
    const [car, setCar] = useState({
        brand: "Ford",
        model: "Mustang",
        year: 1998,
        color: "red"
    });

    useEffect(()=>{
 console.log("car was updated : "+JSON.stringify(car))
    },[car])


    const updateCar = () => {
        setCar((prevState) => (  //if we use like this, setCar({color: "blue"}) -> it may remove the brand and others from our state.
            {
                ...prevState, // get the other data and overwriting only the "color"
                color: "blue"
            }
        ))
    }

    return (
        <div>
            <button onClick={() =>  updateCar()}>Change color to blue</button>
        </div>
    )
}

export default UseStateEx
