import React, { useState } from 'react';
import axios from 'axios';

const RicercaUtente = ({ onSeleziona }: { onSeleziona: (anagrafica: any) => void }) => {
  const [cf, setCf] = useState('');
  const [anagrafiche, setAnagrafiche] = useState<any[]>([]);
  const [errore, setErrore] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setErrore('');
    setLoading(true);
    setAnagrafiche([]);

    try {
      const res = await axios.post('/api/utenti/verifica-codice-fiscale', {
        codice_fiscale: cf,
      });

      if (res.data.found) {
        setAnagrafiche(res.data.anagrafiche);
      } else {
        setErrore('Nessuna anagrafica trovata.');
      }
    } catch (err: any) {
      setErrore(err.response?.data?.error || 'Errore di rete o validazione');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow rounded space-y-4">
      <h2 className="text-xl font-bold">Ricerca utente da codice fiscale</h2>
      <input
        type="text"
        value={cf}
        onChange={(e) => setCf(e.target.value.toUpperCase())}
        placeholder="Inserisci codice fiscale"
        className="w-full border px-4 py-2 rounded"
      />
      <button
        onClick={handleSearch}
        className="bg-blue-600 text-white px-4 py-2 rounded"
        disabled={cf.length !== 16 || loading}
      >
        {loading ? 'Verifica...' : 'Conferma'}
      </button>

      {errore && <p className="text-red-600">{errore}</p>}

      {anagrafiche.length === 1 && (
        <div className="border p-4 bg-gray-50 rounded">
          <p>Anagrafica trovata:</p>
          <pre>{JSON.stringify(anagrafiche[0], null, 2)}</pre>
          <button
            onClick={() => onSeleziona(anagrafiche[0])}
            className="mt-2 bg-green-600 text-white px-4 py-2 rounded"
          >
            Usa questa anagrafica
          </button>
        </div>
      )}

      {anagrafiche.length > 1 && (
        <div>
          <p>Più anagrafiche trovate, seleziona una:</p>
          {anagrafiche.map((a, i) => (
            <div key={i} className="border p-3 my-2 rounded bg-gray-50">
              <pre>{JSON.stringify(a, null, 2)}</pre>
              <button
                onClick={() => onSeleziona(a)}
                className="mt-1 bg-green-600 text-white px-4 py-1 rounded"
              >
                Seleziona
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RicercaUtente;
