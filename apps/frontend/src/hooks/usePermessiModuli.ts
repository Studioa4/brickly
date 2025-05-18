
import { useEffect, useState } from 'react';
import axios from 'axios';

export type PermessiModuli = {
  banche_dati_catasto: boolean;
  banche_dati_anagrafiche: boolean;
  banche_dati_fornitori: boolean;
  banche_dati_province_e_comuni: boolean;
  banche_dati_tabelle_fiscali: boolean;
};

export function usePermessiModuli(studioId: string) {
  const [permessi, setPermessi] = useState<PermessiModuli | null>(null);
  const [loading, setLoading] = useState(true);
  const [errore, setErrore] = useState<string | null>(null);

  useEffect(() => {
    if (!studioId) return;

    setLoading(true);
    setErrore(null);

    axios
      .get('/api/permessi-moduli', {
        params: { studio_id: studioId },
      })
      .then((res) => {
        setPermessi(res.data);
      })
      .catch((err) => {
        console.error('Errore nel recupero permessi moduli:', err);
        setErrore('Accesso negato o errore server');
        setPermessi(null);
      })
      .finally(() => setLoading(false));
  }, [studioId]);

  return { permessi, loading, errore };
}
