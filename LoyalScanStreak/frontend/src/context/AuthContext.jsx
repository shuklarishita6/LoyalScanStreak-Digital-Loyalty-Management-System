import { createContext, useContext, useState, useEffect } from 'react';

// Global "who is logged in right now" state.
// Any component can call useAuth() instead of receiving this via props.
const AuthContext = createContext();

const STORAGE_KEY = 'lss_user';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // { ...profile, role: 'customer' | 'owner', token }
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) setUser(JSON.parse(stored));
    setLoading(false);
  }, []);

  const login = (userData) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
