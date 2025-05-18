import React, { useState } from 'react';
import axios from 'axios';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSeleziona: (anagrafica: any) => void;
};

const ModalInserimentoCodiceFiscale = ({ isOpen, onClose, onSeleziona }: Props) => {
  const [cf, setCf] = useState('');
  const [errore, setErrore] = useState('');
  const [loading, setLoading] = useState(false);
  const [risultati, setRisultati] = useState<any[]>([]);

  const handleVerifica = async () => {
    setErrore('');
    setRisultati([]);
    setLoading(true);
    try {
      const res = await axios.post('/api/utenti/verifica-codice-fiscale', {
        codice_fiscale: cf,
      });
      if (res.data.found) {
        setRisultati(res.data.anagrafiche);
      } else {
        setErrore('Nessuna anagrafica trovata.');
      }
    } catch (err: any) {
      setErrore(err.response?.data?.error || 'Errore durante la verifica.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-30 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg space-y-4">
        <h2 className="text-xl font-bold">Inserisci codice fiscale</h2>

        <input
          type="text"
          value={cf}
          onChange={(e) => setCf(e.target.value.toUpperCase())}
          placeholder="Codice fiscale"
          className="w-full border px-4 py-2 rounded"
          maxLength={16}
        />

        <div className="flex justify-end gap-4">
          <button onClick={onClose} className="text-gray-600 hover:underline">
            Annulla
          </button>
          <button
            onClick={handleVerifica}
            className="bg-blue-600 text-white px-4 py-2 rounded"
            disabled={cf.length !== 16 || loading}
          >
            {loading ? 'Verifica...' : 'Conferma'}
          </button>
        </div>

        {errore && <p className="text-red-600">{errore}</p>}

        {risultati.length === 1 && (
          <div className="border p-3 rounded bg-gray-50 mt-4">
            <p>Anagrafica trovata:</p>
            <pre className="text-sm">{JSON.stringify(risultati[0], null, 2)}</pre>
            <button
              onClick={() => onSeleziona(risultati[0])}
              className="mt-2 bg-green-600 text-white px-4 py-2 rounded"
            >
              Usa questa anagrafica
            </button>
          </div>
        )}

        {risultati.length > 1 && (
          <div className="mt-4 space-y-3">
            <p>Più anagrafiche trovate, seleziona una:</p>
            {risultati.map((a, i) => (
              <div key={i} className="border p-3 rounded bg-gray-50">
                <pre className="text-sm">{JSON.stringify(a, null, 2)}</pre>
                <button
                  onClick={() => onSeleziona(a)}
                  className="mt-1 bg-green-600 text-white px-3 py-1 rounded"
                >
                  Seleziona
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ModalInserimentoCodiceFiscale;
