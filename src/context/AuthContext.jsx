import {createContext, useEffect, useState} from 'react';
import {login as loginRequest, getMe} from '../api/auth';

export const AuthContext = createContext();

export function AuthProvider({children}) {
  const [isAuth, setIsAuth] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');

  // обычный логин
  const login = async (email, password) => {
    const data = await loginRequest(email, password);
    if (data.token) {
      await loginWithToken(data.token);
    }
    return data;
  };

  // ⭐ НОВОЕ — логин по токену (нужен для register)
  const loginWithToken = async (token) => {
    localStorage.setItem('token', token);
    await loadUser(token);
    setIsAuth(true);
  };

  const loadUser = async (token) => {
    try {
      const userData = await getMe(token);
      setUser(userData);
    } catch {
      logout();
      throw new Error('Invalid token');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuth(false);
    setUser(null);
  };

  // ⭐ исправленный автологин при refresh
  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    loadUser(token)
      .then(() => setIsAuth(true))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AuthContext.Provider
      value={{isAuth, user, login, loginWithToken, logout, loading}}
    >
      {children}
    </AuthContext.Provider>
  );
}
