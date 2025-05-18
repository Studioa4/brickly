
import React, { createContext, useContext, useState, useEffect } from 'react';

type Utente = {
  id: string;
  email: string;
  utente_studio_id: string;
};

type AuthContextType = {
  utente: Utente | null;
  setUtente: (u: Utente | null) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  utente: null,
  setUtente: () => {},
  logout: () => {}
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [utente, setUtente] = useState<Utente | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('utente');
    if (stored) {
      setUtente(JSON.parse(stored));
    }
  }, []);

  const logout = () => {
    setUtente(null);
    localStorage.removeItem('utente');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ utente, setUtente, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
