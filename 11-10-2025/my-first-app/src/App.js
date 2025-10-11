import './App.css';
import HomePage from './Component/Login_page/HomePage';
import PublicPage from './Component/Login_page/PublicPage';
import ProtectedPage from './Component/Login_page/ProtectedPage';
import Login from './Component/Login_page/Login';
import { BrowserRouter,Route,Routes,HashRouter } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function App() {
  return (
    <>
      <HashRouter>
        <Routes>

          <Route path='Login' element={<PublicPage><Login/> </PublicPage>}></Route>

          <Route path='HomePage' element={<ProtectedPage><HomePage /></ProtectedPage>}></Route>\
          
        </Routes>
      </HashRouter >
    </>
  );
}

export default App;
