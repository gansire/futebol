import { useEffect, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useGroups } from '../hooks/useGroups';
import '../styles/SidebarLayout.scss';

interface Group {
  id: number;
  name: string;
}

export function SidebarLayout() {
  const { fetchGroups } = useGroups();
  const [groups, setGroups] = useState<Group[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    fetchGroups().then(setGroups).catch(console.error);
  }, []);

  return (
    <div className="sidebar-layout">
      <button className="hamburger" onClick={() => setIsOpen(!isOpen)}>
        ☰
      </button>

      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <h3>Meus Grupos</h3>
        {groups.map(group => (
          <Link
            key={group.id}
            to={`/grupo/${group.id}`}
            onClick={() => setIsOpen(false)}
            className={location.pathname.includes(`/grupo/${group.id}`) ? 'active' : ''}
          >
            {group.name}
          </Link>
        ))}

        <hr />

        <Link to="/conta" onClick={() => setIsOpen(false)}>
          Minha Conta
        </Link>
      </aside>

      {isOpen && <div className="overlay" onClick={() => setIsOpen(false)} />}

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}