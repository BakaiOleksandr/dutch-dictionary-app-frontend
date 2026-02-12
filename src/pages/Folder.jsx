import {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import BackButton from '../components/BackButton';
import {useContext} from 'react';
import {LoadingContext} from '../context/LoadingContext';
import {useError} from '../context/ErrorContext';

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
      alert('Введите слово и перевод');
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
      console.error(err);
      alert('Ошибка при удалении слова');
    }
  };

  return (
    <div style={{padding: '1rem', maxWidth: '400px'}}>
      <BackButton />
      <h2>
        Folder: <span>{folder?.name}</span>
      </h2>

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

      <h3>Words in folder:</h3>
      <ul>
        {words.map((w) => (
          <li key={w._id || w.nl + w.ru}>
            {w.nl} → {w.ru}{' '}
            <button
              style={{marginLeft: '0.5rem'}}
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
