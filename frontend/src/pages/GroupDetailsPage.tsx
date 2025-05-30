import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

type User = { id: number; name: string };
type Group = {
  id: number;
  name: string;
  users: User[];
  admins: User[];
};

export const GroupDetailsPage = () => {
  const { groupId } = useParams();
  const { token, user } = useAuth();
  const [group, setGroup] = useState<Group | null>(null);

  useEffect(() => {
    fetchGroup();
  }, []);

  const fetchGroup = async () => {
    const res = await api.get(`/groups/${groupId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.data
    setGroup(data);
  };

  const promoteToAdmin = async (userId: number) => {
    await api.post(`/groups/${groupId}/admins/${userId}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchGroup();
  };

  const isCurrentUserAdmin = group?.admins.some((admin) => admin.id === user?.id);

  if (!group) return <p>Carregando grupo...</p>;

  return (
    <div>
      <h2>{group.name}</h2>
      <h3>Membros:</h3>
      <ul>
        {group.users.map((member) => (
          <li key={member.id}>
            {member.name}
            {group.admins.some((admin) => admin.id === member.id) && ' 👑'}
            {isCurrentUserAdmin && !group.admins.some((admin) => admin.id === member.id) && (
              <button onClick={() => promoteToAdmin(member.id)}>Tornar Admin</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};