import {useState, useContext} from 'react';
import BackButton from '../components/BackButton';
import {LoadingContext} from '../context/LoadingContext';
import {useError} from '../context/ErrorContext';
import styles from './UsefullLinks.module.css';
// API подтягивается автоматически из .env.local при dev и из .env при build
const API = import.meta.env.VITE_API;

export default function UsefullLinks() {
  const [word, setWord] = useState('');
  const [article, setArticle] = useState('');
  const [resultWord, setResultWord] = useState(''); // сохраняем слово для результата
  const {showError} = useError();

  const {loading, setLoading} = useContext(LoadingContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedWord = word.trim();

    // Проверка длины и цифр
    if (trimmedWord.length <= 1) {
      showError('Word must be longer than 1 letter');
      return;
    }
    if (/\d/.test(trimmedWord)) {
      showError('Word cannot contain numbers');
      return;
    }

    try {
      setArticle('');
      setLoading(true);

      const res = await fetch(`${API}/article/${trimmedWord.toLowerCase()}`);
      if (!res.ok) {
        showError('Word not found');
        return;
      }

      const data = await res.json();

      if (!data.article || data.article === 'unknown') {
        showError('Article not found');
      } else {
        setArticle(data.article);
        setResultWord(trimmedWord); // сохраняем слово для показа
      }
    } catch (err) {
      showError('Something went wrong');
    } finally {
      setLoading(false);
      setWord(''); // очищаем input
    }
  };

  return (
    <div>
      <BackButton />
      <div className={styles.mainContainer}>
        <h3>Check Dutch Article (de / het)</h3>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter Dutch word"
            value={word}
            name="checksubmit"
            onChange={(e) => {
              const sanitized = e.target.value.replace(/[^a-zA-ZÀ-ÿ\-]/g, '');
              setWord(sanitized);
            }}
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Checking...' : 'Check'}
          </button>
        </form>

        {article && (
          <p className={styles.result}>
            <strong>
              {article} {resultWord}
            </strong>
          </p>
        )}
      </div>
    </div>
  );
}
