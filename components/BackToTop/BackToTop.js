import { useState, useEffect } from 'react';
import { FaArrowUp } from 'react-icons/fa'; // Icon for Back to Top button
import styles from './BackToTop.module.css';

const BackToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setVisible(window.scrollY > 300);
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    visible && (
      <button className={styles.button} onClick={scrollToTop} aria-label="Back to Top">
        <FaArrowUp />
      </button>
    )
  );
};

export default BackToTop;
