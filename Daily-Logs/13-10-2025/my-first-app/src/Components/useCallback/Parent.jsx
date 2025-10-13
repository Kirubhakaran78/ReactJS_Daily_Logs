import { useCallback, useState } from "react";
import Child from "./Child";

function Parent() {
  const [count1, setCount1] = useState(0);
  const [count2, setCount2] = useState(0);

  const handleClick1 = useCallback(() => {
    console.log("clicked 1");
    setCount1(count1+ 1);
  }, [count1]);

  const handleClick2 = useCallback(() => {
    setCount2(count2+ 1);
  }, [count2]);

  console.log("parent rendered");
  return (
    <div>
      <h2>Parent component</h2>
      <p>Count 1 : {count1}</p>
      <p>Count 2 : {count2}</p>
      <Child onClick={handleClick1} text={"button 1"}></Child>
      <Child onClick={handleClick2} text={"button 2"}></Child>
    </div>
  );
}

export default Parent;
