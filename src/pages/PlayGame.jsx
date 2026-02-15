import {useEffect, useState, useContext} from 'react';
import {useParams} from 'react-router-dom';
import BackButton from '../components/BackButton';
import {LoadingContext} from '../context/LoadingContext';
import styles from './PlayGame.module.css';

const API = import.meta.env.VITE_API;
export default function PlayGame() {
  const {folderId} = useParams();
  const token = localStorage.getItem('token');

  const [words, setWords] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [correct, setCorrect] = useState(0);
  const [wrongWords, setWrongWords] = useState([]);
  const [finished, setFinished] = useState(false);
  const {setLoading} = useContext(LoadingContext);

  // загрузка слов
  useEffect(() => {
    if (!folderId) return;

    setLoading(true);

    fetch(`${API}/words/${folderId}`, {
      headers: {Authorization: 'Bearer ' + token},
    })
      .then((res) => res.json())
      .then((data) => {
        const shuffled = data.sort(() => Math.random() - 0.5);
        setWords(shuffled);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [folderId, token]);

  const handleSubmit = () => {
    const currentWord = words[currentIndex];

    if (!currentWord) return;

    if (answer.trim().toLowerCase() === currentWord.ru.toLowerCase()) {
      setCorrect((prev) => prev + 1);
    } else {
      setWrongWords((prev) => [
        ...prev,
        {
          word: currentWord.nl,
          correctTranslation: currentWord.ru,
          userAnswer: answer,
        },
      ]);
    }

    setAnswer('');

    if (currentIndex + 1 === words.length) {
      setFinished(true);
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  if (!words.length)
    return (
      <div>
        <BackButton />
        <h3>No words in this folder</h3>
      </div>
    );
  //FINISHED
  if (finished) {
    const percent = Math.round((correct / words.length) * 100);

    return (
      <div>
        <BackButton />
        <h2>Игра окончена 🎉</h2>

        {percent === 100 ? (
          <h3 style={{color: 'green'}}>Супер! Все слова верны 💯🔥</h3>
        ) : (
          <>
            <p>
              Правильных ответов: {correct} / {words.length}
            </p>

            <h4>Неправильные ответы:</h4>
            <ul>
              {wrongWords.map((w, i) => (
                <li key={i}>
                  {w.word} → {w.correctTranslation}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    );
  }

  const currentWord = words[currentIndex];

  return (
    <div>
      <BackButton />
      <div className={styles.playGameContainer}>
        <h2>Translate the word:</h2>

        <h3>{currentWord.nl}</h3>

        <input
          type="text"
          placeholder="Type translation..."
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
        />

        <button onClick={handleSubmit}>Submit</button>

        <p>
          Progress: {currentIndex + 1} / {words.length}
        </p>
      </div>
    </div>
  );
}
