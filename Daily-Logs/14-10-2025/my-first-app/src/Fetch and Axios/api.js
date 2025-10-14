import axios from 'axios'
import React from 'react'


    const api=axios.create({
        baseURL:"https://jsonplaceholder.typicode.com",
        timeout:60000,
        headers:{
            "Content-Type":"application/json"
        }
    })

export default api
