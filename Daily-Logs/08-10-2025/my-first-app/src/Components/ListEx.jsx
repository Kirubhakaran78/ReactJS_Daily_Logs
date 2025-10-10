import React from 'react'

function ListEx() {
    const arrObjs=[
        {id:101,name:"kirubha"},
        {id:102,name:'sanjay'},
        {id:103,name:"karan"}
    ];

  return (
    <div>
      {arrObjs.length>0 &&(
        <ul>
        {arrObjs.map((item,index)=>(
            <li key={index}>{item.name}</li>
        ))}
        </ul>
      )}
    </div>
  )
}

export default ListEx
