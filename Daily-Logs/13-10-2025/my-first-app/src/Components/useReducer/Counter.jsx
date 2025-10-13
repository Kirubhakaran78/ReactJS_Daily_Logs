import React, { useReducer } from 'react'

function Counter() {
    const initialState = { count: 0 };

    // function init(initialState){ //if we give the initialState to the 0 in the useReducer()
    //     return {count:initialState};
    // }

    function reducer(state, action) {
        switch (action.type) {
            case "Increment":
                return { count: state.count + 1 }
            case "Decrement":
                return { count: state.count - 1 }
            case "Reset":
                return { count: 0 }
            default:
                return state
        }
    }

    const [state, dispatch] = useReducer(reducer, initialState)

    return (
        <div>
            <h2>Counter {state.count}</h2>
            <button onClick={() => dispatch({ type: "Increment" })}>+</button><br />
            <button onClick={() => dispatch({ type: "Decrement" })}>-</button><br />
            <button onClick={() => dispatch({ type: "Reset" })}>Reset</button><br />
        </div>
    )
}

export default Counter
