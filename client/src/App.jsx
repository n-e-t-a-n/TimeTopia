import React from 'react';
import { useAuth } from './providers/AuthContext.jsx';

import { Home, Login } from './pages'

const App = () => {
  const { user } = useAuth();

  return (
    <>
      <h1>
        {!user ? <Login /> : <Home />}
      </h1>
    </>
  );
};

export default App;