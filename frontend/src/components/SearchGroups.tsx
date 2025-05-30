import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import '../styles/SearchGroups.scss';
import api from '../services/api';

export function SearchGroups() {
  const { token } = useAuth();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [message, setMessage] = useState('');
  const [pendingInvitations, setPendingInvitations] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPendingInvitations();
  }, []);

  async function loadPendingInvitations() {
    try {
      const res = await api.get('/groups/invitations/pending', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const pendingGroupIds = res.data.map((inv: any) => inv.group.id);
      setPendingInvitations(pendingGroupIds);
    } catch (err) {
      console.error('Erro ao carregar convites pendentes', err);
    }
  }

  async function handleSearch() {
    if (!query.trim()) return;
    setLoading(true);
    setMessage('');
    try {
      const res = await api.get(`/groups/search?name=${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setResults(res.data);
      setMessage(res.data.length === 0 ? 'Nenhum grupo encontrado.' : '');
    } catch (err) {
      console.error(err);
      setMessage('Erro ao buscar grupos.');
    } finally {
      setLoading(false);
    }
  }

  async function handleInvite(groupId: number) {
    try {
      await api.post(`/groups/${groupId}/invite`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPendingInvitations([...pendingInvitations, groupId]);
      setMessage('Convite enviado com sucesso!');
    } catch (err: any) {
      setMessage(err.response?.data?.message || 'Erro ao enviar convite.');
    }
  }

  return (
    <div className="search-groups-container">
      <h2>Procurar Grupos</h2>
      <input
        type="text"
        placeholder="Digite o nome do grupo"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
      />
      <button onClick={handleSearch} disabled={loading}>
        {loading ? 'Buscando...' : 'Buscar'}
      </button>

      {message && <p className="message">{message}</p>}

      <ul>
        {results.map(group => (
          <li key={group.id}>
            <span className="group-name">{group.name}</span>
            <button
              className="invite-button"
              onClick={() => handleInvite(group.id)}
              disabled={pendingInvitations.includes(group.id)}
            >
              {pendingInvitations.includes(group.id) ? 'Convite Pendente' : 'Pedir para Entrar'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}