import BackButton from '../components/BackButton';
export default function UsefullLinks() {
  return (
    <div>
      <BackButton />
      <ul className='useful-links'>
        <li>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.verbix.com/languages/dutch"
          >
            Dutch verb conjugation
          </a>
        </li>
        <li>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.dutchgrammar.com/ru/index.php"
          >
            Курс Голландской грамматики
          </a>
        </li>
      </ul>
    </div>
  );
}
