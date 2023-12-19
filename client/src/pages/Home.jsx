import React from 'react';
import { useAuth } from '../providers/AuthContext';

const Home = () => {
    const { logout } = useAuth();

    return (
      <>
        <button onClick={ logout }>Logout</button>
      </>
    );
  };
  
export default Home
  