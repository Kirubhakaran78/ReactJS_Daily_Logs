import axios from 'axios'
import {useEffect} from 'react'

function RetrievalWithPost() {

    useEffect(()=>{
        axios.post("https://jsonplaceholder.typicode.com/posts",{
            title: "qui est esse"
        })
        .then(res => console.log(res.data))
        .catch(err => console.error(err))
    },[])
  return (
    <div>
    <h2>Check console to see the fetched data</h2>
    </div>
  )
}

export default RetrievalWithPost
