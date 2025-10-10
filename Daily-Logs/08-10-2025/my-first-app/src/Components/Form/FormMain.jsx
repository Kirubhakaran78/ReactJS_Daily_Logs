import React from 'react'
import {useState} from 'react';
import UserForm from "./UserForm"

function FormMain() {
    const[formData,setFormData]=useState({
        name:"",
        email:"",
        gender:"",
        country:"",
        skills:[],
        agree:false,
    });

const handlesubmit=(e)=>{
  e.preventDefault();
  console.log("form submitted");
  alert(`handlesubmit/n/n${JSON.stringify(formData,null,2)}`);
}

  return (
    <div>
      <h2>User Form Example</h2>
      <form onSubmit={handlesubmit} >
        <UserForm formData={formData} setFormData={setFormData}/>
        <br />
        <button type='submit'disabled={!formData.agree}>Submit</button>
      </form>
    </div>
  )
}

export default FormMain
