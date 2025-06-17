import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { GroupsPage } from './pages/GroupsPage';
import { CreateGroup } from './components/CreateGroup';
import { SearchGroups } from './components/SearchGroups';
import { AdminInvitationsPage } from './pages/AdminInvitationsPage';
import { GroupDetailsPage } from './pages/GroupDetailsPage';
import { SidebarLayout } from './layouts/SidebarLayout';
import './styles/App.scss';

function App() {
  const { token } = useAuth();

  return (
    <Router>
      <Routes>
        {!token ? (
          <>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </>
        ) : (
          // Rotas protegidas dentro do layout com sidebar
          <Route path="/" element={<SidebarLayout />}>
            <Route path="grupos" element={<GroupsPage />} />
            <Route path="grupos/criar" element={<CreateGroup />} />
            <Route path="grupos/procurar" element={<SearchGroups />} />
            <Route path="grupos/invitacoes-pendentes" element={<AdminInvitationsPage />} />
            <Route path="grupo/:groupId" element={<GroupDetailsPage />} />
            <Route path="*" element={<Navigate to="/grupos" replace />} />
          </Route>
        )}
      </Routes>
    </Router>
  );
}

export default App;