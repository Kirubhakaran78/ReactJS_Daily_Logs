import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import CryptoJS from 'crypto-js';
import './Login.css';

const SECRET_VALUE = 'AGARAM_SDMS_SCRT';

function Loginfull() {
    const [username, setUserName] = useState("");
    const [password, setPassword] = useState("");

    // Signup / Add User
    const handleSignup = (e) => {
        e.preventDefault();

        if (!username || !password) {
            alert("Please enter username and password");
            return;
        }

        // Encrypt password
        const cipherText = CryptoJS.AES.encrypt(password, SECRET_VALUE).toString();

        // Get existing users from localStorage
        const users = JSON.parse(localStorage.getItem("users")) || {};

        if (users[username]) {
            alert("Username already exists!");
            return;
        }

        // Add new user
        users[username] = cipherText;

        // Save back to localStorage
        localStorage.setItem("users", JSON.stringify(users));

        alert(`User ${username} signed up successfully!`);
        setUserName(""); 
        setPassword("");
    };

    // Login / Validate User
    const handleLogin = (e) => {
        e.preventDefault();

        if (!username || !password) {
            alert("Please enter username and password");
            return;
        }

        // Load users from localStorage
        const users = JSON.parse(localStorage.getItem("users")) || {};

        if (!users[username]) {
            alert("User does not exist!");
            return;
        }

        // Decrypt password
        const bytes = CryptoJS.AES.decrypt(users[username], SECRET_VALUE);
        const originalPassword = bytes.toString(CryptoJS.enc.Utf8);

        if (originalPassword === password) {
            alert("Login successful!");
        } else {
            alert("Incorrect password!");
        }
    };

    return (
        <div className='main_container'>
            <h3>Signup / Login</h3>
            <Form>
                <Form.Group className="mb-3" controlId="formGroupEmail">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter Username"
                        value={username}
                        onChange={(e) => setUserName(e.target.value)}
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formGroupPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </Form.Group>

                <Form.Group as={Row} className="mb-3">
                    <Col sm={{ span: 10, offset: 2 }}>
                        <Button variant="success" onClick={handleSignup}>Signup</Button>{' '}
                        <Button variant="primary" onClick={handleLogin}>Login</Button>
                    </Col>
                </Form.Group>
            </Form>
        </div>
    );
}

export default Loginfull;
