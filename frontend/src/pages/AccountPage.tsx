import { useAuth } from '../contexts/AuthContext';

export function AccountPage() {
  const { user, logout } = useAuth();

  return (
    <div>
      <h2>Minha Conta</h2>
      <p><strong>Nome:</strong> {user?.name}</p>
      <p><strong>Email:</strong> {user?.email}</p>
      <button onClick={logout}>Sair</button>
    </div>
  );
}