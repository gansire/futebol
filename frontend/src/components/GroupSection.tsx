import { useState, useEffect } from "react";
import { AddPlayerToGroup } from "./AddPlayerToGroup";
import { Tabs } from "./Tabs";
import { PresencaTab } from "./PresenceTab";
import { SorteioTab } from "./SorteioTab";
import { usePlayers, type Player } from "../hooks/usePlayers";

interface GroupSectionProps {
  groupId: number;
  groupName: string;
}

export const GroupSection = ({ groupId, groupName }: GroupSectionProps) => {
  const { fetchPlayersByGroup, updateStatus, toggleArrived, sortTeams } =
    usePlayers();

  const [players, setPlayers] = useState<Player[]>([]);
  const [sortedTeams, setSortedTeams] = useState<{
    teamA: Player[];
    teamB: Player[];
  } | null>(null);
  const [loadingSort, setLoadingSort] = useState(false);

  useEffect(() => {
    loadPlayers();
  }, []);

  const loadPlayers = async () => {
    try {
      const data = await fetchPlayersByGroup(groupId);
      setPlayers(data);
      setSortedTeams(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateStatus = async (
    playerId: number,
    newStatus: "DENTRO" | "FORA" | "DUVIDA"
  ) => {
    await updateStatus(playerId, newStatus);
    loadPlayers();
  };

  const handleToggleArrived = async (playerId: number, currentArrived: boolean) => {
    await toggleArrived(playerId, currentArrived);
    loadPlayers();
  };

  const handleSortTeams = async () => {
    setLoadingSort(true);
    try {
      const result = await sortTeams(groupId);
      setSortedTeams(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingSort(false);
    }
  };

  return (
    <div>
      <h3>{groupName}</h3>
      <AddPlayerToGroup groupId={groupId} onPlayerAdded={loadPlayers} />
      <Tabs
        tabs={[
          {
            label: "Presença",
            content: (
              <PresencaTab
                players={players}
                onUpdateStatus={handleUpdateStatus}
                onToggleArrived={handleToggleArrived} // pode remover se não usar aqui
              />
            ),
          },
          {
            label: "Sorteio",
            content: (
              <SorteioTab
                players={players.filter((p) => p.status === "DENTRO")}
                sortedTeams={sortedTeams}
                loadingSort={loadingSort}
                onSort={handleSortTeams}
                onToggleArrived={handleToggleArrived}
              />
            ),
          },
        ]}
      />
    </div>
  );
};