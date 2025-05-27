import { type Player } from "../hooks/usePlayers";
import "../styles/PresenceTab.scss";

interface PresencaTabProps {
  players: Player[];
  onUpdateStatus: (id: number, status: "DENTRO" | "FORA" | "DUVIDA") => void;
  onToggleArrived: (id: number, currentArrived: boolean) => void;
}

export const PresencaTab = ({
  players,
  onUpdateStatus,
  onToggleArrived,
}: PresencaTabProps) => {
  const dentro = players.filter((p) => p.status === "DENTRO");
  const fora = players.filter((p) => p.status === "FORA");
  const duvida = players.filter((p) => p.status === "DUVIDA");

  return (
    <div className="presence-tab">
      <section>
        <h4>Dentro</h4>
        {dentro.map((player) => (
          <div key={player.id} className="player-item">
            <span>{player.name}</span>
            <button className="status-button fora" onClick={() => onUpdateStatus(player.id, "FORA")}>
              Marcar Fora
            </button>
            <button className="status-button duvida" onClick={() => onUpdateStatus(player.id, "DUVIDA")}>
              Marcar Dúvida
            </button>
          </div>
        ))}
      </section>

      <section>
        <h4>Fora</h4>
        {fora.map((player) => (
          <div key={player.id} className="player-item">
            <span>{player.name}</span>
            <button className="status-button dentro" onClick={() => onUpdateStatus(player.id, "DENTRO")}>
              Marcar Dentro
            </button>
            <button className="status-button duvida" onClick={() => onUpdateStatus(player.id, "DUVIDA")}>
              Marcar Dúvida
            </button>
          </div>
        ))}
      </section>

      <section>
        <h4>Em dúvida</h4>
        {duvida.map((player) => (
          <div key={player.id} className="player-item">
            <span>{player.name}</span>
            <button className="status-button dentro" onClick={() => onUpdateStatus(player.id, "DENTRO")}>
              Marcar Dentro
            </button>
            <button  className="status-button fora"  onClick={() => onUpdateStatus(player.id, "FORA")}>
              Marcar Fora
            </button>
          </div>
        ))}
      </section>
    </div>
  );
};