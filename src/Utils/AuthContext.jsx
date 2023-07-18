import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [logged, setLogged] = useState(false);
  const [userName, setUserName] = useState('');
  const [token, setToken] = useState('');

  const authContextValues = {
    logged,
    setLogged,
    userName,
    setUserName,
    token,
    setToken
  };

  return (
    <AuthContext.Provider value={authContextValues}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;


