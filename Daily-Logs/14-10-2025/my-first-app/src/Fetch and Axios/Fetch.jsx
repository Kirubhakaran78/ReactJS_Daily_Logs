import React, { useEffect, useState } from 'react'

function Fetch() {
    

    //Get
    useEffect(() => {
        //create controller - control or cancel fetch requests
        const controller=new AbortController();
        const signal=controller.signal; // is an signal object that connects the fetch request to the controller
        fetch("https://jsonplaceholder.typicode.com/posts",{signal})
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Network is not working : " + res.statusText);
                }
                return res.json()
            })
            .then((data1) => console.log(data1))
            .catch(err => console.error("There was an problem : " + err))

            return()=>{
                controller.abort();// cancels the request when unmounts
            }
    })

    //Post
    useEffect(() => {
        const controller=new AbortController();
        const signal = controller.signal;

        fetch("https://jsonplaceholder.typicode.com/posts", {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                title: 'MY Post',
                body: "hello world..",
                userId: 1
            }),signal //pass the signal here
        })
            .then(res => res.json())
            .then(data2 => console.log(data2))
            .catch(err => console.error(err))

            return()=>{
                controller.abort();
            }
    })

    return (
        <div>
            <h3>See Fetch Data in the console</h3>
        </div>
    )
}

export default Fetch
