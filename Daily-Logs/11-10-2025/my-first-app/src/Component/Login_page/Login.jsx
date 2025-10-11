import { useState } from 'react'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import './Login.css'
import CryptoJS from 'crypto-js';
import { useNavigate } from "react-router-dom";

function Login() {
    const [username, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const SECRET_VALUE = 'AGARAM_SDMS_SCRT';

    const handleSubmit = (e) => {
        e.preventDefault();

        if (username === "admin" && password === "admin") {
            const cipherText = CryptoJS.AES.encrypt(password, SECRET_VALUE).toString();

            //save local
            const userObj = { username, password: cipherText };
            localStorage.setItem("user", JSON.stringify(userObj));

            //get from local
            const savedUser = JSON.parse(localStorage.getItem("user"));

            if (savedUser) {
                const savedusername = savedUser.username;
                const savedEncryptedPassword = savedUser.password;

                //decrypt
                const bytes = CryptoJS.AES.decrypt(savedEncryptedPassword, SECRET_VALUE);
                const originalPassword = bytes.toString(CryptoJS.enc.Utf8);

                if (username === savedusername && password === originalPassword) {
                    alert('Login successful!');
                    localStorage.setItem("isLoggedIn", "true");
                    navigate('/HomePage')
                } else {
                    alert('Decryption failed!');
                }
            }


        } else {
            alert("Invalid username or password...!")
            setUserName("")
            setPassword("")
        }
    }

    return (
        <div className='login_page'>
            <div className='main_container'>
                <h3 >Login</h3>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="formGroupEmail">
                        <Form.Label>Email User Name</Form.Label>
                        <Form.Control type="text" placeholder="Enter User Name" value={username} onChange={(e) => setUserName(e.target.value)} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formGroupPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3">
                        <Col sm={{ span: 10, offset: 2 }}>
                            <Button type="submit">Sign in</Button>
                        </Col>
                    </Form.Group>
                </Form></div>
        </div>
    )
}

export default Login
