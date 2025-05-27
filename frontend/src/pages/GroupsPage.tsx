import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useGroups } from '../hooks/useGroups';
import { GroupSection } from '../components/GroupSection';
import { SearchAndInviteGroups } from '../components/SearchAndInviteGroups';
import '../styles/GroupsPage.scss';

export const GroupsPage = () => {
  const { fetchGroups, createGroup } = useGroups();
  const [groups, setGroups] = useState<any[]>([]);
  const [newGroup, setNewGroup] = useState('');

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    try {
      const data = await fetchGroups();
      setGroups(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="groups-container">
      {
        groups.length === 0 ? (
          <div>
            <p>Você ainda não está em nenhum grupo. Crie um novo grupo ou peça para alguém te adicionar.</p>
            <Link to="/grupos/criar">
              <button>Criar Grupo</button>
            </Link>
            <hr />
            <SearchAndInviteGroups />
          </div>
        ) : (
            <>
              <h2>Seus Grupos</h2>
              <div className="groups-list">
                {groups.map(group => (
                  <GroupSection key={group.id} groupId={group.id} groupName={group.name} />
                ))}
              </div>
            </>
        )
      }
    </div>
  );
};