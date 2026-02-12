import {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import BackButton from '../components/BackButton';
import {useContext} from 'react';
import {LoadingContext} from '../context/LoadingContext';
import {useError} from '../context/ErrorContext';
import {FcOpenedFolder} from 'react-icons/fc';
import styles from './Folder.module.css';

const API = import.meta.env.VITE_API;

export default function Folder() {
  const {folderId} = useParams();
  const token = localStorage.getItem('token');

  const [words, setWords] = useState([]);
  const [newWord, setNewWord] = useState('');
  const [translation, setTranslation] = useState('');
  const [folder, setFolder] = useState(null);

  const {setLoading} = useContext(LoadingContext);
  const {showError} = useError();

  // find folder
  useEffect(() => {
    if (!folderId) return;

    setLoading(true);

    fetch(`${API}/folders/${folderId}`, {
      headers: {Authorization: `Bearer ${token}`},
    })
      .then((res) => res.json())
      .then((data) => setFolder(data))
      .catch((err) => showError(err))
      .finally(() => setLoading(false));
  }, [folderId, token]);

  // Получаем слова папки при монтировании
  useEffect(() => {
    if (!folderId) return;

    fetch(`${API}/words/${folderId}`, {
      headers: {Authorization: 'Bearer ' + token},
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setWords(data);
        } else {
          console.warn('Expected array, got:', data);
          setWords([]);
        }
      })
      .catch((err) => showError(err));
  }, [folderId, token]);

  // Добавление слова
  const addWord = async () => {
    if (!newWord || !translation) {
      showError('Enter a word');
      return;
    }

    try {
      const res = await fetch(`${API}/words`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
        body: JSON.stringify({
          folderId,
          nl: newWord,
          ru: translation,
        }),
      });

      if (!res.ok) throw new Error('Error adding word');

      const word = await res.json();
      setWords((prev) => [...prev, word]);

      setNewWord('');
      setTranslation('');
    } catch (err) {
      showError(err);
    }
  };

  // Удаление слова
  const deleteWord = async (id) => {
    try {
      const res = await fetch(`${API}/words/${id}`, {
        method: 'DELETE',
        headers: {Authorization: 'Bearer ' + token},
      });

      if (!res.ok) throw new Error('Error deleting word');

      setWords((prev) => prev.filter((w) => w._id !== id));
    } catch (err) {
      showError(err);
    }
  };

  return (
    <div className="foler-container">
      <BackButton />
      <div className="folder-icon-and-name">
        <FcOpenedFolder size={80} />

        <h2>
          Folder: <span>{folder?.name}</span>
        </h2>
      </div>

      <div style={{marginBottom: '1rem'}}>
        <input
          type="text"
          placeholder="Word in Dutch"
          value={newWord}
          onChange={(e) => setNewWord(e.target.value)}
        />
      </div>

      <div style={{marginBottom: '1rem'}}>
        <input
          type="text"
          placeholder="Translation in Russian"
          value={translation}
          onChange={(e) => setTranslation(e.target.value)}
        />
      </div>

      <button onClick={addWord}>Add Word</button>

      {words.length > 0 ? <h3>Words in folder:</h3> : ''}
      <ul className={styles.wordsListContainer}>
        {words.map((w) => (
          <li key={w._id || w.nl + w.ru} className={styles.wordItem}>
            <span className={styles.wordText}>
              <strong>{w.nl}</strong> →{' '}
              <i style={{fontWeight: '300'}}>{w.ru}</i>
            </span>
            <button
              className={styles.folderDeleteWordBtn}
              onClick={() => deleteWord(w._id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
