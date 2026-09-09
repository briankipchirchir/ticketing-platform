import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Load user from localStorage on app start
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('email');
    const fullName = localStorage.getItem('fullName');
    const role = localStorage.getItem('role');
    if (token && email && fullName && role) {
      setUser({ token, email, fullName, role });
    }
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('token', userData.token);
    localStorage.setItem('email', userData.email);
    localStorage.setItem('fullName', userData.fullName);
    localStorage.setItem('role', userData.role);
  };

  const logout = () => {
    setUser(null);
    localStorage.clear();
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
