import React from 'react';
import { useAuth } from '../../providers/AuthContext';
import Cookies from 'js-cookie'

const Home = () => {
    const { logout } = useAuth();
    const userInfo = JSON.parse(Cookies.get('authToken'));

    return (
      <div>
        <h1>{ userInfo["name"] }</h1>
        <button onClick={ logout }>Logout</button>
      </div>
    );
  };
  
export default Home
  