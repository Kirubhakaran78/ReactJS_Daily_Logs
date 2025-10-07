import React,{ useEffect } from "react";
 
 function JsDom(){

   useEffect(()=>{
        const container=document.getElementById('my_div');

        if(!document.getElementById('myNewDiv')){
        const newDiv=document.createElement('div');
        newDiv.textContent="hello from the new div";
        newDiv.setAttribute("id","myNewDiv");
        newDiv.className="myNewDivClass";

        container.appendChild(newDiv);
        }
    },[]);

    return(
        <>
            <div id="my_div"></div>
        </>
    );
}

export default JsDom;