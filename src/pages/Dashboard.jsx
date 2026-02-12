import {useContext, useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import {AuthContext} from '../context/AuthContext';

const API = import.meta.env.VITE_API;

export default function Dashboard() {
  const [folders, setFolders] = useState([]);
  const [name, setName] = useState('');
  const {user, logout} = useContext(AuthContext);

  const token = localStorage.getItem('token');

  // загрузка папок
  useEffect(() => {
    fetch(`${API}/folders`, {
      headers: {Authorization: `Bearer ${token}`},
    })
      .then((res) => res.json())
      .then(setFolders);
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
            <button onClick={() => deleteFolder(folder._id)}>❌</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
