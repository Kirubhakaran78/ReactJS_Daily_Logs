import { useState } from "react";

function StuForm({data,setData}) {

    const [name, setName] = useState("");
    const [age, setAge] = useState("");
    

    const handleSubmit = (e) => {
        e.preventDefault();
        const newEntry = { name, age };

        setData([...data, newEntry]);

        setName("");
        setAge("");

    }
  return (
    <>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name: </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />{" "}
        {/* value={name} --> the input field shows whatever in the react usestate, react control the input field */}
        <br />
        <br />
        <label htmlFor="age">Age: </label>
        <input
          id="age"
          type="text"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />
        <br />
        <br />
        <button type="submit">submit</button>
      </form>
    </>
  );
}

export default StuForm;
