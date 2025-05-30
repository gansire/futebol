import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { GroupsPage } from './pages/GroupsPage';
import { CreateGroup } from './components/CreateGroup';
import { SearchGroups } from './components/SearchGroups';
import { PendingInvitationsPage } from './pages/PendingInvitations';
import { GroupDetailsPage } from './pages/GroupDetailsPage';
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
              <Route path="/grupos/procurar" element={<SearchGroups />} />
              <Route path="*" element={<Navigate to="/grupos" replace />} />
              <Route path="/admin/convites" element={<PendingInvitationsPage />} />
              <Route path="/grupos/:groupId" element={<GroupDetailsPage />} />
            </>
          )}
        </Routes>
      </div>
    </Router>
  );
}

export default App;