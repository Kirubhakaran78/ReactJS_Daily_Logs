import React from "react";
import useFetch from "./useFetch";

function CustomHookEx() {
  const [data] = useFetch("https://jsonplaceholder.typicode.com/todos");
  return (
    <div>
      {data &&
        data.map((data) => (
          <p key={data.id}>{JSON.stringify(data,null,2)}</p>
    ))
    }
    </div>
  );
}

export default CustomHookEx;
