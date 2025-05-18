
import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

export type PermessiModuli = {
  banche_dati_catasto: boolean;
  banche_dati_anagrafiche: boolean;
  banche_dati_fornitori: boolean;
  banche_dati_province_e_comuni: boolean;
  banche_dati_tabelle_fiscali: boolean;
};

const PermessiContext = createContext<{
  permessi: PermessiModuli | null;
  loading: boolean;
  errore: string | null;
}>({
  permessi: null,
  loading: true,
  errore: null
});

export const usePermessi = () => useContext(PermessiContext);

export const PermessiProvider = ({ children }: { children: React.ReactNode }) => {
  const [permessi, setPermessi] = useState<PermessiModuli | null>(null);
  const [loading, setLoading] = useState(true);
  const [errore, setErrore] = useState<string | null>(null);
  const [studioId, setStudioId] = useState<string | null>(null);

  useEffect(() => {
    const handleStudioChange = () => {
      const id = localStorage.getItem('studio_id');
      setStudioId(id && id !== 'null' && id !== 'undefined' && id !== 'utente-demo' ? id : null);
    };

    handleStudioChange(); // iniziale
    window.addEventListener('storage', handleStudioChange); // in caso cambi in un'altra scheda

    return () => window.removeEventListener('storage', handleStudioChange);
  }, []);

  useEffect(() => {
    if (!studioId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    axios
      .get('/api/permessi-moduli', {
        params: { studio_id: studioId }
      })
      .then((res) => {
        console.log('✅ Permessi ricevuti:', res.data);
        setPermessi(res.data);
      })
      .catch((err) => {
        console.error('Errore permessi:', err.message);
        setErrore('Errore permessi');
      })
      .finally(() => setLoading(false));
  }, [studioId]);

  return (
    <PermessiContext.Provider value={{ permessi, loading, errore }}>
      {children}
    </PermessiContext.Provider>
  );
};
