import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

export default function Folder() {
  const { folderId } = useParams();
  const token = localStorage.getItem('token');

  const [words, setWords] = useState([]);
  const [newWord, setNewWord] = useState('');
  const [translation, setTranslation] = useState('');

  // Получаем слова папки при монтировании
  useEffect(() => {
    if (!folderId) return;

    fetch(`http://localhost:3001/words/${folderId}`, {
      headers: { Authorization: 'Bearer ' + token },
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
      .catch((err) => console.error(err));
  }, [folderId, token]);

  // Добавление слова
  const addWord = async () => {
    if (!newWord || !translation) {
      alert('Введите слово и перевод');
      return;
    }

    try {
      const res = await fetch('http://localhost:3001/words', {
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
      console.error(err);
      alert('Ошибка при добавлении слова');
    }
  };

  // Удаление слова
  const deleteWord = async (id) => {
    try {
      const res = await fetch(`http://localhost:3001/words/${id}`, {
        method: 'DELETE',
        headers: { Authorization: 'Bearer ' + token },
      });

      if (!res.ok) throw new Error('Error deleting word');

      setWords((prev) => prev.filter((w) => w._id !== id));
    } catch (err) {
      console.error(err);
      alert('Ошибка при удалении слова');
    }
  };

  return (
    <div style={{ padding: '1rem', maxWidth: '400px' }}>
      <h2>Folder</h2>

      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Word in Dutch"
          value={newWord}
          onChange={(e) => setNewWord(e.target.value)}
        />
      </div>

      <div style={{ marginBottom: '1rem' }}>
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
            <button style={{ marginLeft: '0.5rem' }} onClick={() => deleteWord(w._id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
