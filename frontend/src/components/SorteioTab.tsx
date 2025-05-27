import { type Player } from "../hooks/usePlayers";
import "../styles/SorteioTab.scss";

interface SorteioTabProps {
  players: Player[];
  sortedTeams: { teamA: Player[]; teamB: Player[] } | null;
  loadingSort: boolean;
  onSort: () => void;
  onToggleArrived: (id: number, currentArrived: boolean) => void;
}

export const SorteioTab = ({
  players,
  sortedTeams,
  loadingSort,
  onSort,
  onToggleArrived,
}: SorteioTabProps) => {
  return (
    <div className="sorteio-tab">
      <h4>Jogadores presentes</h4>
      {players.length === 0 && <p className="empty-message">Nenhum jogador dentro.</p>}

      <div className="players-list">
        {players.map((player) => (
          <div key={player.id} className="player-item">
            <span className="player-name">{player.name}</span>
            <button
              className={`arrived-button ${player.arrived ? "arrived" : ""}`}
              onClick={() => onToggleArrived(player.id, player.arrived)}
            >
              {player.arrived ? "Desmarcar Chegada" : "Marcar Chegado"}
            </button>
          </div>
        ))}
      </div>
      <button className="sort-button" onClick={onSort} disabled={loadingSort}>
        {loadingSort ? "Sorteando..." : "Sortear Times"}
      </button>
      {sortedTeams && (
        <>
          <h4>Time A</h4>
          <ul className="team-list">
            {sortedTeams.teamA.map((player) => (
              <li key={player.id}>{player.name}</li>
            ))}
          </ul>

          <h4>Time B</h4>
          <ul className="team-list">
            {sortedTeams.teamB.map((player) => (
              <li key={player.id}>{player.name}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};