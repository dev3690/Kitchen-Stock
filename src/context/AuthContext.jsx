import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUserRole = localStorage.getItem('userRole');
    if (token) {
      setIsAuthenticated(true);
      setUserRole(storedUserRole === 'true');
    }
    setIsLoading(false);
  }, []);

  const login = (token, role) => {
    setIsAuthenticated(true);
    setUserRole(role);
    localStorage.setItem('token', token);
    localStorage.setItem('userRole', role);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
  };

  const isAdmin = () => userRole === 'true';

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout, userRole, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};
