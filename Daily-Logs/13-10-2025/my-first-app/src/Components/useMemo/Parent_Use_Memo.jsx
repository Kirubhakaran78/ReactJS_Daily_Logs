import React, { useMemo, useState } from "react";
import Child_Use_Memo from "./Child_Use_Memo";

function Parent_Use_Memo() {
  const [item, setItems] = useState([
    { name: "tea", price: 45 },
    { name: "coffee", price: 89 },
  ]);

  //Derived Value
  const total = useMemo(() => {
    console.log("Calculating...");
    return item.reduce((sum, it) => sum + it.price, 0);
  }, [item]);

  return (
    <div>
      <h2>Parent</h2>
      <Child_Use_Memo total={total} />
    </div>
  );
}

export default Parent_Use_Memo;
