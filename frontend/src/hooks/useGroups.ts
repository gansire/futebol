import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

interface Group {
  id: number;
  name: string;
  isAdmin: boolean;
}

export const useGroups = () => {
  const { token } = useAuth();

  const fetchGroups = async (): Promise<Group[]> => {
    const res = await api.get("/groups", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res) throw new Error('Erro ao buscar grupos');
    return res.data;
  };

  const createGroup = async (name: string) => {
    const res = await api.post(
      "/groups",
      { name },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!res) throw new Error('Erro ao criar grupo');
    return res.data;
  };

  return { fetchGroups, createGroup };
};