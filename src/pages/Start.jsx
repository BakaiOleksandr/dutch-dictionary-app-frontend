import {useContext, useEffect} from 'react';
import {Navigate} from 'react-router-dom';
import {AuthContext} from '../context/AuthContext';
import {Link} from 'react-router-dom';
import styles from './Start.module.css';

export default function Start() {
  const {isAuth, loading} = useContext(AuthContext);

  if (loading) return null;

  if (isAuth) {
    return <Navigate to="/app" replace />;
  }

  return (
    <div className={styles.startMainContainer}>
      <div className={styles.logoContainer}>
        <img src="./favicon.png" alt="Logo" />
      </div>
      <h1>Dutch Dictionary</h1>
    <div className={styles.loginRegisterContainer}>
      <Link to="/login">
        <button>Login</button>
      </Link>

      <Link to="/register">
        <button>Register</button>
      </Link></div>
    </div>
  );
}
