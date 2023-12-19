import { createContext, useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie'

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = Cookies.get('authToken');
    if (token) {
      setUser(token)
    }
  }, []);

  const login = (userData) => {
    Cookies.set('authToken', { ...userData }, { expires: 7, path: '/' })

    setUser(userData);
  };

  const logout = () => {
    Cookies.remove('authToken', { path: '/' }) 
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};