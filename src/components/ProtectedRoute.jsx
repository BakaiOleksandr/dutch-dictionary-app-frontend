import {useContext} from 'react';
import {Navigate} from 'react-router-dom';
import {AuthContext} from '../context/AuthContext';

export default function ProtectedRoute({children}) {
  const {isAuth, loading} = useContext(AuthContext);

  if (loading) return <p>Loading...</p>;

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
