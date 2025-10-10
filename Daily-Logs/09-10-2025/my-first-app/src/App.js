// import './App.css';
import { Suspense, lazy } from 'react';
import {BrowserRouter,Route,Routes,Link,NavLink} from 'react-router-dom';
import Info from './Components/BrowserRouter/useParamEx/Info';
// import styles from "./Button.module.css"
import styles from "./MyButton.module.scss"
import TransitionEx from './Components/TransitionEx';
import LocalStorageEx from './Components/Local_Session_cookie/LocalStorageEx';

//suspense
const Main = lazy(() => import("./Components/BrowserRouter/Main"))


function App() {
  return (
    <>
      {/* <Suspense fallback={"Loading the page..."}>
        <Main />
      </Suspense> */}

      {/* <BrowserRouter>
      <nav>
        <NavLink to="/Customer/Email" >Email</NavLink>
        <Link to="/Customer/Akhil" >Akhil</Link>
        <Link to="/Customer/Ram" >Ram</Link>
        
      </nav>

      <Routes>
        <Route path='/Customer/:firstname' element={<Info/>}/>
      </Routes>
      
      </BrowserRouter> */}
      
      {/* <button type='submit' className={`${styles.primarybtn}`}>Submit</button>
      <button type='submit' className={`${styles.mybutton} ${styles.secondarybtn}`}>Submit</button> */}

    {/* <button type='submit' className={styles.mybutton}>Submit</button> */}

    {/* <TransitionEx/> */}

    <LocalStorageEx/>
    </>
  );
}

export default App;
