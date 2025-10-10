import { useState,useTransition } from 'react'

function TransitionEx() {
    const[query,setQuery]=useState();
    const[filtered,setFiltered]=useState([]);
    const[isPending,startTransition]=useTransition();

    const items=Array.from({length:10000},(_,i)=> `Item ${i}`)

    const handlechange=(e)=>{
        const value=e.target.value;
        setQuery(value);

        startTransition(()=>{
            setFiltered(items.filter(items=>items.includes(value)))
        })

    }

  return (
    <div>
      <input type="text" value={query} onChange={handlechange} />
      {isPending && "Filtering...."}
      <ui>{
        filtered.map((value,index)=><li key={index}>{value}</li>)
        }</ui>
    </div>
  )
}

export default TransitionEx
