import {createContext, useEffect, useState} from 'react';
import {login as loginRequest, getMe} from '../api/auth';

export const AuthContext = createContext();

export function AuthProvider({children}) {
  const [isAuth, setIsAuth] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');

  const login = async (email, password) => {
    const data = await loginRequest(email, password);
    if (data.token) {
      localStorage.setItem('token', data.token);
      await loadUser(data.token);
      setIsAuth(true);
    }
    return data;
  };

  const loadUser = async (token) => {
    try {
      const userData = await getMe(token);
      setUser(userData);
    } catch {
      logout();
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuth(false);
    setUser(null);
  };

  useEffect(() => {
    if (token) {
      loadUser(token).finally(() => {
        setIsAuth(true);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider value={{isAuth, user, login, logout, loading}}>
      {children}
    </AuthContext.Provider>
  );
}
