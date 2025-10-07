import { useState } from "react";
import StuForm from "./StuForm";

function ShowStuData() {

    const [data, setData] = useState([]);

    return (
        <>
            <StuForm data={data} setData={setData}/>

            {data.length > 0 && (
                <table border="1">
                    <thead>
                        <tr>
                            <th>S.No</th>
                            <th>Name</th>
                            <th>Age</th>
                            <th>YOB</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{item.name}</td>
                                <td>{item.age}</td>
                                <td>{new Date().getFullYear() - Number(item.age)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

        </>
    )
}

export default ShowStuData;