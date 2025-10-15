import './App.css';
import HomePage from './Component/Login_page/HomePage';
import PublicPage from './Component/Login_page/PublicPage';
import ProtectedPage from './Component/Login_page/ProtectedPage';
import Login from './Component/Login_page/Login';
import { Route,Routes,BrowserRouter } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Home from './Component/Home_page/Home';
import LogilabSDMS from './Component/Home_page/LogilabSDMS';
import HomeMain from './Component/Home_page/HomeMain';
import ResizableTable from './Component/ResizableTable';
import DataTable from './Component/DataTable';
import GridExample from './Component/GridExample';

function App() {
  return (
    <>
      {/* <BrowserRouter>
        <Routes>

          <Route path='/' element={<PublicPage><Login/> </PublicPage>}></Route>

          <Route path='/HomePage' element={<ProtectedPage><HomePage /></ProtectedPage>}></Route>
          
        </Routes>
      </BrowserRouter > */}
      {/* <Home/> */}
      {/* <LogilabSDMS/> */}
      {/* <HomeMain/> Need to run this */}
      {/* <ResizableTable/> */}
      {/* <DataTable/> MUI - data grid */}
      <GridExample/>

    </>
  );
}

export default App;
