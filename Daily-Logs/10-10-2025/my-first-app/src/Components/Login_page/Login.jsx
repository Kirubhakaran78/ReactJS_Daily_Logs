import React, { useState, useEffect } from 'react'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import './Login.css'
import CryptoJS from 'crypto-js';
import axios from "axios";

function Login() {

    const [username, setUserName] = useState("");
    const [password, setPassword] = useState("");

    const SECRET_VALUE = 'AGARAM_SDMS_SCRT';

    useEffect(() => {
        const savedUser = localStorage.getItem("user");

        if (savedUser) {
            const userObj = JSON.parse(savedUser);
            setUserName(userObj.username);
            setPassword(userObj.password);
        }
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!username || !password) {
            alert("Please enter username and passowrd");
            return;
        }


        try {
            //Json 
            // const response=await axios.post("https://jsonplaceholder.typicode.com/posts",{
            //     username,
            //     password:cipherText
            // })
            // console.log(response.data);

            // if(response.status===201){
            //     alert("Login Successful.!")
            // }else{
            //     alert("Login Failed..!");
            // }

            // add users
            const cipherText = CryptoJS.AES.encrypt(password, SECRET_VALUE).toString();

            const userObj = { username, password: cipherText };

            localStorage.setItem("user", JSON.stringify(userObj));
            alert("Login Successful! Saved encrypted password in localStorage.");



            


        } catch (error) {
            console.error(error)
            alert("Error in : " + error);
        }

    }


    return (
        <>
            <div className='main_container'>
                <h3 >Login</h3>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="formGroupEmail">
                        <Form.Label>Email User Name</Form.Label>
                        <Form.Control type="text" placeholder="Enter User Name" onChange={(e) => setUserName(e.target.value)} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formGroupPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3">
                        <Col sm={{ span: 10, offset: 2 }}>
                            <Button type="submit">Sign in</Button>
                        </Col>
                    </Form.Group>
                </Form></div>
        </>
    )
}

export default Login
