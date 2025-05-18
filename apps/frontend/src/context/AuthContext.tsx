import React, { createContext, useContext, useEffect, useState } from "react";
import { Utente } from "@/types";

type AuthContextType = {
  utente: Utente | null;
  setUtente: (u: Utente | null) => void;
  logout: () => void;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  utente: null,
  setUtente: () => {},
  logout: () => {},
  loading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [utente, setUtente] = useState<Utente | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("utente");
    if (stored) {
      setUtente(JSON.parse(stored));
    }
    setLoading(false);
  }, []);

  const logout = () => {
    localStorage.removeItem("utente");
    localStorage.removeItem("token");
    setUtente(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ utente, setUtente, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
