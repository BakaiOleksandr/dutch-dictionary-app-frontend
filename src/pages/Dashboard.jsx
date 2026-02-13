import {useContext, useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import {AuthContext} from '../context/AuthContext';
import {LoadingContext} from '../context/LoadingContext';

const API = import.meta.env.VITE_API;

export default function Dashboard() {
  const [folders, setFolders] = useState([]);
  const [name, setName] = useState('');
  const {user, logout} = useContext(AuthContext);

  const token = localStorage.getItem('token');

  const {loading, setLoading} = useContext(LoadingContext);
  // загрузка папок
  useEffect(() => {
    const fetchFolders = async () => {
      try {
        setLoading(true);

        const res = await fetch(`${API}/folders`, {
          headers: {Authorization: `Bearer ${token}`},
        });

        const data = await res.json();
        setFolders(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFolders();
  }, []);

  // создать папку
  const createFolder = async () => {
    if (!name.trim()) return;

    const res = await fetch(`${API}/folders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({name}),
    });

    const folder = await res.json();
    setFolders([...folders, folder]);
    setName('');
  };

  // удалить папку
  const deleteFolder = async (id) => {
    await fetch(`${API}/folders/${id}`, {
      method: 'DELETE',
      headers: {Authorization: `Bearer ${token}`},
    });

    setFolders(folders.filter((f) => f._id !== id));
  };

  return (
    <div>
      <header style={{display: 'flex', justifyContent: 'space-between'}}>
        <div>
          <h2>Dashboard</h2>
          {user && (
            <p>
              Logged in as: <strong>{user.email}</strong>
            </p>
          )}
        </div>
        <button className="log-out-btn" onClick={logout}>
          Logout
        </button>
      </header>
      <h2>Your folders</h2>

      <input
        placeholder="Folder name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button onClick={createFolder}>Create folder</button>

      <ul>
        {folders.map((folder) => (
          <li key={folder._id}>
            <Link to={`/folders/${folder._id}`}>{folder.name}</Link>
            <Link to={`/play/${folder._id}`}>
              <button style={{marginLeft: '1rem'}}>Play Game 🎮</button>
            </Link>

            <button onClick={() => deleteFolder(folder._id)}>❌</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
