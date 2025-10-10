import React from 'react'
import { useNavigate } from 'react-router-dom';

function HomePage() {
    const navigate = useNavigate();




    const logout = () => {
        localStorage.removeItem("user");
        localStorage.setItem("isLoggedIn", "false");
        navigate("/")
    }

    return (
        <div>
            {/* <UserForm/> */}
            <h2>Home page.....</h2>

            <button style={{ backgroundColor: "red", color: "white", padding: "10px", border: "none", borderRadius: "5px" }} onClick={logout}>Logout</button>


        </div>
    )
}

export default HomePage
