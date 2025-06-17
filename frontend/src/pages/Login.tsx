import { useState, type FormEvent } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Login.scss';
import api from '../services/api';
import { useGroups } from '../hooks/useGroups';
export function Login() {
  
  const { login } = useAuth();
  const { fetchGroups } = useGroups();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      login(res.data.token, res.data.user);

      const groups = await fetchGroups();
      if (groups.length > 0) {
        navigate(`/grupo/${groups[0].id}`); 
      } else {
        navigate('/grupos');
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Erro no login');
      setPassword('');
  
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit}>
        <h2>Login</h2>
        <input
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          type="email"
          disabled={loading}
        />
        <input
          placeholder="Senha"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          disabled={loading}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
        {error && <p className="error-message">{error}</p>}

        <p className="register-link">
          Não tem uma conta? <Link to="/register">Registre-se</Link>
        </p>
      </form>
    </div>
  );
}