import React, { useState } from 'react';
import { useAuth } from './providers/AuthContext.jsx';

import { Login, Register } from './pages/pre-auth'
import { Home } from './pages/auth'

const PreAuth = () => {
  const [isLogin, setIsLogin] = useState(true);

  return isLogin ? <Login setIsLogin={ setIsLogin }/> : <Register setIsLogin={ setIsLogin }/>;
}

const App = () => {
  const { user } = useAuth();

  return (
    <>
      <h1>
        {!user ? <PreAuth /> : <Home />}
      </h1>
    </>
  );
};

export default App;