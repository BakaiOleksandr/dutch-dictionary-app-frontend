import {useContext} from 'react';
import {Navigate} from 'react-router-dom';
import {AuthContext} from '../context/AuthContext';
import Spinner from './Spinner';

export default function ProtectedRoute({children}) {
  const {isAuth, loading} = useContext(AuthContext);

  if (loading) return <Spinner/>;

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
