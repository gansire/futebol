import { Link } from 'react-router-dom';
import { useGroups } from '../hooks/useGroups';
import { useEffect, useState } from 'react';
import { GroupSection } from '../components/GroupSection';
import { SearchGroups } from '../components/SearchGroups';
import '../styles/GroupsPage.scss';

interface Group {
  id: number;
  name: string;
  isAdmin: boolean;
}

export const GroupsPage = () => {
  const { fetchGroups } = useGroups();
  const [groups, setGroups] = useState<Group[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    try {
      const data = await fetchGroups();

      setGroups(data);
      // Verifica se o usuário é admin em algum grupo
      const hasAdminGroup = data.some(group => group.isAdmin);
      setIsAdmin(hasAdminGroup);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="groups-container">
      {groups.length === 0 ? (
        <div className="empty-groups">
          <h2>Bem-vindo!</h2>
          <p>Você ainda não está em nenhum grupo.</p>
          <div className="actions">
            <Link to="/grupos/criar">
              <button className="primary-btn">Criar Grupo</button>
            </Link>
            <span className="divider">ou</span>
            <SearchGroups />
          </div>
        </div>
      ) : (
        <>
          <h2>Seus Grupos</h2>
          {isAdmin && (
            <Link to="/grupos/invitacoes-pendentes">
              <button className="admin-invitations-btn">
                Convites Pendentes
              </button>
            </Link>
          )}
          <div className="groups-list">
            {groups.map(group => (
              <GroupSection key={group.id} groupId={group.id} groupName={group.name} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};