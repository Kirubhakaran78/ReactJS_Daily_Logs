import React, {useMemo} from 'react'

const Child_Use_Memo=React.memo(({total})=>{ //React.memo -> memozies the component,only re-render when the prop value is changed, Prevents re-rendering of child components
    console.log("Child rendered");
    return <div><p>Total: ₹{total}</p></div>
})
  

export default Child_Use_Memo
