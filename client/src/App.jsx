import React from 'react';
import { useAuth } from './providers/AuthContext.jsx';

import { Home, Login, Register } from './pages'

const App = () => {
  const { user } = useAuth();

  return (
    <>
      <h1>
        {!user ? <Register /> : <Home />}
      </h1>
    </>
  );
};

export default App;