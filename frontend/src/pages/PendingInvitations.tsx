import { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

interface Invitation {
  id: number;
  user: { id: number; name: string };
  group: { id: number; name: string };
  status: string;
}

export function PendingInvitationsPage() {
  const { token } = useAuth();
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function fetchInvitations() {
      try {
        const res = await api.get('/groups/invitations/pending', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setInvitations(res.data);
      } catch (err) {
        setMessage('Erro ao carregar convites.');
      } finally {
        setLoading(false);
      }
    }
    fetchInvitations();
  }, [token]);

  async function respondInvitation(invitationId: number, status: 'approved' | 'rejected') {
    try {
      await api.post(`/groups/invitations/${invitationId}/respond`, { status }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInvitations(invitations.filter(i => i.id !== invitationId));
    } catch (err) {
      setMessage('Erro ao responder convite.');
    }
  }

  if (loading) return <p>Carregando convites...</p>;

  return (
    <div>
      <h2>Convites Pendentes</h2>
      {message && <p>{message}</p>}
      {invitations.length === 0 && <p>Não há convites pendentes.</p>}
      <ul>
        {invitations.map(invite => (
          <li key={invite.id}>
            <b>{invite.user.name}</b> quer entrar no grupo <b>{invite.group.name}</b>.
            <button onClick={() => respondInvitation(invite.id, 'approved')}>Aprovar</button>
            <button onClick={() => respondInvitation(invite.id, 'rejected')}>Rejeitar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}