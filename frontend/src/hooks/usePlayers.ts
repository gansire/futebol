import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";
import api from "../services/api";

export type Player = {
  id: number;
  name: string;
  email: string;
  status: "DENTRO" | "FORA" | "DUVIDA";
  present: boolean;
  arrived: boolean;
  groupId?: number;
};

export function usePlayers() {
  const { token } = useAuth();
  const [players, setPlayers] = useState<Player[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchPlayers = async () => {
    if (!token) return;

    try {
      const res = await api.get("/players");
      setPlayers(res.data);
      setError(null);
    } catch (e: any) {
      console.error(e);
      if (e.response?.status === 401) {
        setError("Não autorizado - token inválido ou expirado");
      } else {
        setError("Erro ao buscar jogadores");
      }
      setPlayers([]);
    }
  };

  const updateStatus = async (
    id: number,
    status: "DENTRO" | "FORA" | "DUVIDA"
  ) => {
    try {
      await api.patch(`/players/${id}/status`, { status });
      setPlayers(players.map((p) => (p.id === id ? { ...p, status } : p)));
    } catch (e) {
      console.error(e);
    }
  };

  const toggleArrived = async (id: number, currentArrived: boolean) => {
    try {
      await api.patch(
        `/players/${id}/arrived`,
        { arrived: !currentArrived },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPlayers(
        players.map((p) =>
          p.id === id ? { ...p, arrived: !currentArrived } : p
        )
      );
    } catch (e) {
      console.error(e);
    }
  };

  const fetchPlayersByGroup = useCallback(async (groupId: number) => {
    try {
      const res = await api.get(`/players/group/${groupId}`);
      return res.data;
    } catch (e) {
      console.error(e);
      throw new Error("Erro ao buscar jogadores");
    }
  }, []);

  const sortTeams = async (groupId: number) => {
    try {
      const response = await api.post(`/players/sort/${groupId}`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data; // os times sorteados
    } catch (err) {
      console.error("Erro ao sortear times", err);
      throw err;
    }
  };

  useEffect(() => {
    fetchPlayers();
  }, [token]);

  return {
    fetchPlayersByGroup,
    sortTeams,
    players,
    updateStatus,
    toggleArrived,
    fetchPlayers,
  };
}