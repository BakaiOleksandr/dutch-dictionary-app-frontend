import {createContext, useEffect, useState} from 'react';
import {getMe, login as apiLogin, register as apiRegister} from '../api/auth';

export const AuthContext = createContext(null);

export const AuthProvider = ({children}) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');

  // 🔁 Проверка токена при старте
  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          const me = await getMe(token);
          if (!me.message) {
            setUser(me);
          } else {
            logout();
          }
        } catch {
          logout();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  // 🔐 Login
  const login = async (email, password) => {
    const data = await apiLogin(email, password);
    if (data.token) {
      localStorage.setItem('token', data.token);
      const me = await getMe(data.token);
      setUser(me);
    }
    return data;
  };

  // 📝 Register
  const register = async (email, password) => {
    const data = await apiRegister(email, password);
    if (data.token) {
      localStorage.setItem('token', data.token);
      const me = await getMe(data.token);
      setUser(me);
    }
    return data;
  };

  // 🚪 Logout
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuth: !!user,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
