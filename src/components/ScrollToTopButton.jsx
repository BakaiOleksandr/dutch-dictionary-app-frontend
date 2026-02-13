import {useState, useEffect} from 'react';
import {FiArrowUp} from 'react-icons/fi';
import styles from './ScrollToTopButton.module.css'; // подключим стили

export default function ScrollToTopButton({targetRef, scrollThreshold = 300}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > scrollThreshold);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrollThreshold]);

  const handleClick = () => {
    if (targetRef?.current) {
      targetRef.current.scrollIntoView({behavior: 'smooth'});
    } else {
      window.scrollTo({top: 0, behavior: 'smooth'});
    }
  };

  if (!visible) return null;

  return (
    <button className={styles.scrollToTop} onClick={handleClick}>
      <FiArrowUp size={28} />
    </button>
  );
}
