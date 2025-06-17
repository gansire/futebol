import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/AdminInvitationsPage.scss';

interface Invitation {
  id: number;
  status: string;
  user: {
    name: string;
  };
  group: {
    name: string;
  };
}

export const AdminInvitationsPage = () => {
  const { token } = useAuth();
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPendingInvitations();
  }, []);

  const fetchPendingInvitations = async () => {
    try {
      const res = await fetch('http://localhost:4000/groups/invitations/pending', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setInvitations(data);
    } catch (err) {
      console.error('Erro ao buscar convites pendentes');
    } finally {
      setLoading(false);
    }
  };

  const respondToInvitation = async (invitationId: number, status: 'approved' | 'rejected') => {
    try {
      await fetch(`http://localhost:4000/groups/invitations/${invitationId}/respond`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      setInvitations((prev) => prev.filter((inv) => inv.id !== invitationId));
    } catch (err) {
      console.error('Erro ao responder convite');
    }
  };

  if (loading) return <p>Carregando...</p>;

  return (
    <div className="admin-invitations-container">
      <h2>Convites Pendentes</h2>
      {invitations.length === 0 ? (
        <p>Não há convites pendentes no momento.</p>
      ) : (
        <ul>
          {invitations.map((inv) => (
            <li key={inv.id}>
              <span>
                <strong>{inv.user.name}</strong> quer entrar no grupo <strong>{inv.group.name}</strong>
              </span>
              <div className="buttons">
                <button onClick={() => respondToInvitation(inv.id, 'approved')}>Aprovar</button>
                <button onClick={() => respondToInvitation(inv.id, 'rejected')}>Rejeitar</button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <button onClick={() => navigate(-1)} className="back-btn">Voltar</button>
    </div>
  );
};