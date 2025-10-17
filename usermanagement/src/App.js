import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from './Components/Login_Design/LoginPage';
import Home from './Home';
import UserGroupView from './Components/UserManagement/UserRole/UserRoleView';
import { AuthProvider } from './Components/Common/Context/AuthContext';
import ProtectedRoute from './Components/Common/Context/ProtectedRoute';
// e.g. in index.js
import 'bootstrap/dist/css/bootstrap.min.css';



function App() {
  return (
    <AuthProvider>

      <Router basename='/usermanagement' >
        <Routes>
          <Route path="/Login" element={<LoginPage />} />
          <Route path="/" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }>
            <Route index element={<Home />} />
            <Route path="usergroup" element={<UserGroupView />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
