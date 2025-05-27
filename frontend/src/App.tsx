import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { GroupsPage } from './pages/GroupsPage';
import { CreateGroup } from './components/CreateGroup';
import "./styles/App.scss"
function App() {
  const { token, logout } = useAuth();

  return (
    <Router>
      <div>
        {token && <button className="logout-button" onClick={logout}>Sair</button>}
        <Routes>
          {!token ? (
            <>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </>
          ) : (
            <>
              <Route path="/grupos" element={<GroupsPage />} />
              <Route path="/grupos/criar" element={<CreateGroup/>} />
              <Route path="*" element={<Navigate to="/grupos" replace />} />
            </>
          )}
        </Routes>
      </div>
    </Router>
  );
}

export default App;