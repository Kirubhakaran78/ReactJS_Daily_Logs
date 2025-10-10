// import './App.css';

import Cookies_SessionEx from './Components/Cookies_SessionEx'
import EncryptDecrypt from './Components/EncryptDecrypt'
import Login_page from './Components/Login_page'
import Login from './Components/Login_page/Login'
import Loginfull from './Components/Login_page/Loginfull'
import LoginMain from './Components/Login_page/LoginMain'
import { BrowserRouter, NavLink, Routes, Route } from 'react-router-dom'
import HomePage from './Components/Login_page/HomePage'
import ProtectedPage from "./Components/Login_page/ProtectedPage"

function App() {
  return (
    <>
      {/* <Cookies_SessionEx/> */}
      {/* <EncryptDecrypt/> */}
      {/* <Login_page/> */}
      {/* <Login/> */}
      {/* <Loginfull/> */}
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<LoginMain />}></Route>
          <Route path='/HomePage' element={<ProtectedPage><HomePage/></ProtectedPage>}></Route>
        </Routes>
      </BrowserRouter>

    </>
  );
}

export default App;
