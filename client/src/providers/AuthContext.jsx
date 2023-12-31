import { createContext, useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = Cookies.get('authToken');
    if (token) {
      setUser(token)
    }
  }, []);

  const register = async (params, setIsLogin) => {
    try {
      const response = await fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...params })
      })

      const data = await response.json();

      if (data.status === 201) {
        toast.success("Successful registration.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      }

      return data;

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
  
      const data = await response.json();
      const account = data.message;

      if (data.status === 200) {
        Cookies.set('authToken', JSON.stringify(account), { expires: 3, path: '/' }) 
        setUser(JSON.stringify(account));
      }

      return data
      
    } catch (error) {
      throw new Error('Login failed. Please try again.');
    }
  };

  const logout = () => {
    Cookies.remove('authToken') 
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};