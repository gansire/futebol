import { useState } from 'react';
import api from '../services/api';

interface Group {
  id: number;
  name: string;
}

interface Props {
  onInviteSent?: (groupName: string) => void;
}

export function SearchAndInviteGroups({ onInviteSent }: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<Group[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sendingInviteToId, setSendingInviteToId] = useState<number | null>(null);
  const [inviteSuccessName, setInviteSuccessName] = useState<string | null>(null);

  async function handleSearch() {
    setLoading(true);
    setError(null);
    setResults([]);
    setInviteSuccessName(null);
    try {
      // Substitua essa URL pelo endpoint real do seu backend
      const response = await api.get<Group[]>(`/api/groups/search?name=${encodeURIComponent(searchTerm)}`);
      setResults(response.data);
    } catch (err) {
      setError('Erro ao buscar grupos');
    } finally {
      setLoading(false);
    }
  }

  async function handleSendInvite(groupId: number, groupName: string) {
    setSendingInviteToId(groupId);
    setError(null);
    try {
      // Substitua essa URL pelo endpoint real do seu backend para convite
      await api.post(`/api/groups/${groupId}/invite`);
      setInviteSuccessName(groupName);
      if (onInviteSent) onInviteSent(groupName);
    } catch {
      setError('Erro ao enviar convite');
    } finally {
      setSendingInviteToId(null);
    }
  }

  return (
    <div className="search-invite-groups">
      <input
        type="text"
        placeholder="Procurar grupo pelo nome"
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      />
      <button onClick={handleSearch} disabled={loading || !searchTerm.trim()}>
        {loading ? 'Buscando...' : 'Buscar'}
      </button>

      {error && <p className="error-message">{error}</p>}

      <ul>
        {results.map(group => (
          <li key={group.id}>
            {group.name}
            <button
              disabled={sendingInviteToId === group.id}
              onClick={() => handleSendInvite(group.id, group.name)}
            >
              {sendingInviteToId === group.id ? 'Enviando...' : 'Enviar Convite'}
            </button>
          </li>
        ))}
      </ul>

      {inviteSuccessName && (
        <p className="success-message">
          Convite enviado para <strong>{inviteSuccessName}</strong>!
        </p>
      )}
    </div>
  );
}