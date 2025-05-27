import React, { useState } from 'react';
import '../styles/AddPlayerToGroup.scss';

interface Props {
  groupId: number;
  onPlayerAdded: () => void;
}

export const AddPlayerToGroup: React.FC<Props> = ({ groupId, onPlayerAdded }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAdd = async () => {
    if (!name.trim()) {
      setError('Nome é obrigatório');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:4000/players/group/${groupId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: name.trim(), email: email.trim() || undefined }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Erro ao adicionar jogador');
      }

      setName('');
      setEmail('');
      onPlayerAdded();
    } catch (err: any) {
      setError(err.message || 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-player-container">
      <h4>Adicionar Jogador</h4>
      {error && <p className="error-message">{error}</p>}
      <input
        placeholder="Nome"
        value={name}
        onChange={(e) => setName(e.target.value)}
        disabled={loading}
      />
      <input
        placeholder="Email (opcional)"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={loading}
      />
      <button onClick={handleAdd} disabled={loading}>
        {loading ? 'Adicionando...' : 'Adicionar'}
      </button>
    </div>
  );
};