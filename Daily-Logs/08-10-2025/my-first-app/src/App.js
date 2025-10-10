import './App.css';
import PropsDestruc from './Components/PropsDestruc';
// import PropsEx from './Components/PropsEx';
// import LifeCycle from './Components/LifeCycle';
// import Parent from "./Components/PropsParentToChild/Parent"
// import EventsEx from "./Components/EventsEx"
// import ListEx from "./Components/ListEx"
import FormMain from "./Components/Form/FormMain"

function App() {
  //Object props
  let x={
    name:"kirubhakaran",
    age:22,
    Address:{
      street:"ps nagar",
      city:"tirupur",
      pincode:638111
    }
  }

  //array props
  const carinfo=["bmw","ford","hyundai"];
 return(
  <>
   {/* <LifeCycle color="blue"/> */}
   {/* <PropsEx person={x} carinfo={carinfo}/> */}
   {/* <PropsDestruc brand="bmw" model="bmw001" year={1998} manufacturedIn="india" color="violet"/> */}
   {/* <Parent/> */}
   {/* <EventsEx/> */}
   {/* <ListEx/> */}
   <FormMain/>
  
  </>
 )
}

export default App;
