import { useAuth } from '../contexts/AuthContext';

const API = 'http://localhost:4000/groups';

export const useGroups = () => {
  const { token } = useAuth();

  const fetchGroups = async () => {
    const res = await fetch(API, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error('Erro ao buscar grupos');
    return res.json();
  };

  const createGroup = async (name: string) => {
    const res = await fetch(API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name }),
    });

    if (!res.ok) throw new Error('Erro ao criar grupo');
    return res.json();
  };

  return { fetchGroups, createGroup };
};