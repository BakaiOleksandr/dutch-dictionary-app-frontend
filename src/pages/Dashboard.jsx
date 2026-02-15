import {useContext, useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import {AuthContext} from '../context/AuthContext';
import {LoadingContext} from '../context/LoadingContext';
import styles from './Dashboard.module.css';
import {FcFolder} from 'react-icons/fc';

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
      if (!token) return;
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
  }, [token]);

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
      <div className={styles.headerDash}>
        {user && <p className={styles.userNameDash}>{user.email}</p>}
        <Link to={'/usefulllinks'}>
          <button className={styles.useful}>
            Check Dutch Article (de / het)
          </button>
        </Link>
        <button className={styles.logOutBtn} onClick={logout}>
          Logout
        </button>
      </div>
      <div className={styles.addFolderContainer}>
        <h2>Your folders</h2>

        <div className={styles.inputAndButton}>
          <input
            style={{margin: '0'}}
            placeholder="Folder name"
            value={name}
            maxLength={30}
            onChange={(e) => setName(e.target.value)}
          />
          <button className={styles.createFolder} onClick={createFolder}>
            Create folder
          </button>
        </div>
      </div>

      <ul className={styles.foldersList}>
        {folders.map((folder) => (
          <li className={styles.folderDash} key={folder._id}>
            <div className={styles.folderDashIconName}>
              <FcFolder size={40} />
              <div className={styles.folderName}>
                <Link to={`/folders/${folder._id}`}>{folder.name}</Link>
              </div>
            </div>

            <div className={styles.playAndDelete}>
              <Link to={`/folders/${folder._id}`}>
                <button className={styles.openFolderBTN}>Open</button>
              </Link>
              <Link to={`/play/${folder._id}`}>
                <button style={{margin: 0}}>Game 🎮</button>
              </Link>

              <button
                style={{margin: 0}}
                onClick={() => deleteFolder(folder._id)}
              >
                ❌
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
