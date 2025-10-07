import { useState } from "react";

function ShowDataInTable() {

    const [name, setName] = useState("");
    const [age, setAge] = useState("");
    const [data, setData] = useState([]);

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
                <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} /> {/* value={name} --> the input field shows whatever in the react usestate, react control the input field */}
                <br /><br />
                <label htmlFor="age">Age: </label>
                <input id="age" type="text" value={age} onChange={(e) => setAge(e.target.value)} />
                <br /><br />
                <button type="submit">submit</button>
            </form>

            {data.length > 0 && (
                <table border="1">
                    <thead>
                        <tr>
                            <th>S.No</th>
                            <th>Name</th>
                            <th>Age</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{item.name}</td>
                                <td>{item.age}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

        </>
    )
}

export default ShowDataInTable;