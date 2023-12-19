import { createContext, useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = Cookies.get('authToken');
    if (token) {
      setUser(token)
    }
  }, []);

  const register = async (params) => {
    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...params })
      })

      if (!response.ok) {
        const errorMessage = await response.json();
        throw new Error(errorMessage.message);
      }

      const data = await response.json();
      const account = data.message;

      if (data.status === 201) {
        Cookies.set('authToken', JSON.stringify(account), { expires: 3, path: '/' });
        setUser(account)
      }

    } catch (error) {
      throw new Error('Register failed. Please try again.');
    }
  }

  const login = async (params) => {
    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...params })
      });
  
      if (!response.ok) {
        const errorMessage = await response.json();
        throw new Error(errorMessage.message);
      }
  
      const data = await response.json();
      const account = data.message;

      if (data.status === 200) {
        Cookies.set('authToken', JSON.stringify(account), { expires: 3, path: '/' }) 
        setUser(account);
      }
    } catch (error) {
      throw new Error('Login failed. Please try again.');
    }
  };

  const logout = () => {
    Cookies.remove('authToken') 
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