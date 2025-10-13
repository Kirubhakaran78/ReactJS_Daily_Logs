import './App.css';
import Timer from './Components/useEffect/Timer';
import UseStateEx from "./Components/useState/UseStateEx"
import Counter from "./Components/useEffect/Counter"
import Component1 from "./Components/useContext/Component1"
import CountRender from './Components/useRef/CountRender'
import RefInDom from "./Components/useRef/RefInDom"
import StorePrevStateValue from "./Components/useRef/StorePrevStateValue"
import CounterReducer from "./Components/useReducer/Counter"
import Parent from './Components/useCallback/Parent';
import Parent_Use_Memo from "./Components/useMemo/Parent_Use_Memo"
import CustomHookEx from "./Components/CustomHooks/CustomHookEx"


function App() {
  return (
    <>
    {/* <UseStateEx/> */}
    {/* <Timer/> */}
    {/* <Counter/> */}
    {/* <Component1/> */}
    {/* <CountRender/> */}

    {/* <RefInDom/> */}
    {/* <StorePrevStateValue/> */}
    {/* <CounterReducer/> */}

    {/* <Parent/> */}
    {/* <Parent_Use_Memo/> */}
    <CustomHookEx/>
    </>
  );
}

export default App;
