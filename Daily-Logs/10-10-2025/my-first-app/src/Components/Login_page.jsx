import React, { useState } from 'react'
import CryptoJS from 'crypto-js';
import axios from "axios";

function Login_page() {
    const [username, setUserName] = useState();
    const [password, setPassword] = useState();
    // const [message, setMessage] = useState();

    const SECRET_VALUE = 'AGARAM_SDMS_SCRT';

    const handleLogin=async()=>{

        if(!username && !password){
            alert("Please enter username and passowrd");
            return;
        }

        const cipherText = CryptoJS.AES.encrypt(password,SECRET_VALUE).toString();
        try{
                const response=await axios.post("https://jsonplaceholder.typicode.com/posts",{
                    username,
                    password:cipherText
                })
                console.log(response.data);

                if(response.status===201){
                    alert("Login Successful.!")
                }else{
                    alert("Login Failed..!");
                }


        }catch(error){
            console.error(error)
            alert("Error in : "+error);
        }
        
    }


    return (
        <div>
            <label htmlFor="username">Enter user name: </label>
            <input type="text" id='username' onChange={(e) => setUserName(e.target.value)} /><br />
            <label htmlFor="password">Enter password:</label>
            <input type="text" id='password' onChange={(e) => setPassword(e.target.value)} /><br/>
            <button type='submit' onClick={handleLogin}>Login</button>
        </div>
    )
}

export default Login_page
