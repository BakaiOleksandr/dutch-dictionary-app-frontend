import {useState, useEffect, useContext, useRef} from 'react';
import {useParams, Link} from 'react-router-dom';
import BackButton from '../components/BackButton';
import {LoadingContext} from '../context/LoadingContext';
import {useError} from '../context/ErrorContext';
import {FcOpenedFolder} from 'react-icons/fc';
import styles from './Folder.module.css';
import {FiArrowUp} from 'react-icons/fi';
import ScrollToTopButton from '../components/ScrollToTopButton';

const API = import.meta.env.VITE_API;

export default function Folder() {
  const {folderId} = useParams();
  const token = localStorage.getItem('token');

  const [words, setWords] = useState([]);
  const [newWord, setNewWord] = useState('');
  const [translation, setTranslation] = useState('');
  const [folder, setFolder] = useState(null);

  const {loading, setLoading} = useContext(LoadingContext);
  const {showError} = useError();

  const formRef = useRef(null);

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
  //RETURN RETURN RETURN RETURN
  return (
    <div className={styles.folerContainer}>
      <div ref={formRef} className={styles.folderIconAndName}>
        <div className={styles.folderBackBTN}>
          <BackButton />
        </div>
        <div className={styles.folderNameAndIconContainer}>
          <FcOpenedFolder size={50} />
          <h2>
            Папка: <span>{folder?.name}</span>
          </h2>
        </div>
      </div>

      <div className={styles.addWord}>
        <h3 style={{fontWeight: '400'}}>Добавьте новое слово</h3>
        <input
          type="text"
          placeholder="Word in Dutch"
          value={newWord}
          onChange={(e) => setNewWord(e.target.value)}
        />

        <input
          type="text"
          placeholder="Translation in Russian"
          value={translation}
          onChange={(e) => setTranslation(e.target.value)}
        />
        <button onClick={addWord}>Добавить слово</button>
      </div>

      {words.length > 0 ? <h3>Слова в этой папке:</h3> : ''}
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
              ❌
            </button>
          </li>
        ))}
      </ul>
      <Link className={styles.playGameInFolder} to={`/play/${folderId}`}>
        <button style={{marginLeft: '1rem'}}>Play Game 🎮</button>
      </Link>
      <ScrollToTopButton targetRef={formRef} scrollThreshold={300} />
    </div>
  );
}
