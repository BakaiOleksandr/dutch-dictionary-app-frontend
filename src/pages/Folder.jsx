import {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';

const API = 'http://localhost:3001';

export default function Folder() {
  const {id} = useParams();
  const token = localStorage.getItem('token');

  const [words, setWords] = useState([]);
  const [nl, setNl] = useState('');
  const [ru, setRu] = useState('');

  // загрузка слов
  useEffect(() => {
    fetch(`${API}/words/${id}`, {
      headers: {Authorization: `Bearer ${token}`},
    })
      .then((res) => res.json())
      .then(setWords);
  }, [id]);

  // добавить слово
  const addWord = async () => {
    if (!nl.trim() || !ru.trim()) return;

    const res = await fetch(`${API}/words`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        folderId: id,
        nl,
        ru,
      }),
    });

    const word = await res.json();
    setWords([...words, word]);
    setNl('');
    setRu('');
  };

  // удалить слово
  const deleteWord = async (wordId) => {
    await fetch(`${API}/words/${wordId}`, {
      method: 'DELETE',
      headers: {Authorization: `Bearer ${token}`},
    });

    setWords(words.filter((w) => w._id !== wordId));
  };

  return (
    <div>
      <h2>Words</h2>

      <input
        placeholder="Dutch word"
        value={nl}
        onChange={(e) => setNl(e.target.value)}
      />

      <input
        placeholder="Translation"
        value={ru}
        onChange={(e) => setRu(e.target.value)}
      />

      <button onClick={addWord}>Add word</button>

      <ul>
        {words.map((w) => (
          <li key={w._id}>
            <strong>{w.nl}</strong> — {w.ru}
            <button onClick={() => deleteWord(w._id)}>❌</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
