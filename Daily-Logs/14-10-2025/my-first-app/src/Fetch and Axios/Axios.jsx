import { useEffect } from 'react';
import axios from "axios";
import api from "./api.js"

function Axios() {

    // //Get Request
    // useEffect(() => {
    //     axios.get("https://jsonplaceholder.typicode.com/posts",{withCredentials:true})
    //     .then(res => console.log(res.data))
    //     .catch(err => console.error(err))
    // })

    // //Post Request
    // useEffect(()=>{
    //     axios.post("https://jsonplaceholder.typicode.com/posts",{
    //         title:"my title",
    //         body:"This is a post",
    //         userId:1
    //     })
    //     .then(res => console.log(res.data))
    //     .catch(err => console.error(err))
    // })

    //Axios Parameters
    // useEffect(() => {
    //     //cancel request
    //     //create an AbortController()
    //     const controller=new AbortController();
    //     const signal=controller.signal;

    //     axios({
    //         method: "post",                                  //HTTP method
    //         url: "https://jsonplaceholder.typicode.com/posts",
    //         data: {                                          //Body for the POST/PUT
    //             title: "my title",
    //             body: "This is post body",
    //             userId: 121
    //         },
    //         headers: {                                        
    //             "Content-Type": "application/json",          // tell server we are sending JSON {important}
    //             "Custom-Header": "Myvalue"                   //Custom headers
    //         },
    //         params: {                                        //send query params for the get request -> mostly for get requests eg(https://jsonplaceholder.typicode.com/posts&id:1)
    //             userId: 121                                        //Axios automatically converts the object into a query string.
    //         },                                              
    //         timeout: 5000,                                   //Request timeout in 5s (maximum time axios will wait for a response,if doesn't within the time axios throws an error)
    //         auth: {                                          //Basic auth
    //             username: "username",
    //             password: "password"
    //         },
    //         responseType: 'json',                             //json by default and others like text,blob,arraybuffer
    //         withCredentials:true,                              //sends the cookies /session info
    //         signal                            
    //     }).then(res => console.log(res.data))
    //     .catch(err=> console.error(err.message))

    //     //cleanup function cancel requests when the component unmounts
    //     return ()=>{
    //         controller.abort();
    //     }
    // },[])


    //baseUrl
    api.get("/posts")
    .then(res => console.log(res.data)) // actually calls https://jsonplaceholder.typicode.com/posts
    .catch(err=>console.error(err.message))

    return (
        <div>
            <h1>Check the console for Axios response</h1>
        </div>
    )
}

export default Axios
