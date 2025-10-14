import axios from 'axios'
import React, { useEffect } from 'react'

function PromiseAll() {


    useEffect(()=>{
        const api1=axios.get("https://jsonplaceholder.typicode.com/posts/1");
        const api2=axios.get("https://jsonplaceholder.typicode.com/posts/2");
        const api3=axios.get("https://jsonplaceholder.typicode.com/invalid-url");
        const api4=axios.get("https://jsonplaceholder.typicode.com/posts/4");
        const api5=axios.get("https://jsonplaceholder.typicode.com/posts/5");

        Promise.all([api1,api2,api3,api4,api5])
        .then(results => {
            console.log("All results : "+JSON.stringify(results.map(res=>res.data,null,2)));
        })
        .catch(err=>{
            console.log("promises all was rejected either one promise got rejected: " +err.message);
        });
    },[])

  return (
    <div>
      <h2>Check console for the Promise.all result</h2>
    </div>
  )
}

export default PromiseAll
