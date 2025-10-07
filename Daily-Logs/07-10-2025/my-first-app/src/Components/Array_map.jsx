

function Array_map() {

    const fruits = ["banana", "apple", "mango"];
    return (
        <>
            {fruits.length > 0 && (
                <ul>
                    {fruits.map((item, index) => (
                        <li key={index}>{item}</li>
                    ))}
                </ul>
            )}
        </>
    )

}

export default Array_map;