import React from 'react'
import { useNavigate } from 'react-router-dom';
import UserForm from "./UserForm"
import { useState } from 'react';

function HomePage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        gender: "",
        country: "",
        skills: [],
        agree: false,
    });

    const navigate = useNavigate();

    const handlesubmit = (e) => {
        e.preventDefault();
        console.log("form submitted");
        alert(`handlesubmit/n/n${JSON.stringify(formData, null, 2)}`);
    }



    const logout = () => {
        localStorage.removeItem("user");
        localStorage.setItem("isLoggedIn", "false");
        navigate("/Login")
    }

    return (
        <div className='home_page'>
            <h2 className='home_header'>Home page.....</h2>

            <button style={{ backgroundColor: "red", color: "white", padding: "10px", border: "none", borderRadius: "5px" }} onClick={logout}>Logout</button>

            <h2>User Form</h2>
            <form onSubmit={handlesubmit} className='form_css'>
                <UserForm formData={formData} setFormData={setFormData} />
                <br />
                <button type='submit' disabled={!formData.agree}>Submit</button>
            </form>
        </div>
    )
}

export default HomePage
