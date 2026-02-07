import {useContext} from 'react';
import {AuthContext} from '../context/AuthContext';

export default function Dashboard() {
  const {user, logout} = useContext(AuthContext);

  return (
    <>
      <h2>Dashboard</h2>
      <p>User: {user.email}</p>
      <button onClick={logout}>Logout</button>
    </>
  );
}
