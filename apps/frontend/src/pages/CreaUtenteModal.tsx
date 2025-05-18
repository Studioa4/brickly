import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const CreaUtenteModal = ({ isOpen, onClose }: Props) => {
  const { utente } = useAuth();
  const [codiceFiscale, setCodiceFiscale] = useState('');
  const [ruolo, setRuolo] = useState('utente');
  const [messaggio, setMessaggio] = useState('');
  const [errore, setErrore] = useState('');
  const [verificaCF, setVerificaCF] = useState<'idle' | 'ok' | 'notfound'>('idle');

  useEffect(() => {
    setMessaggio('');
    setErrore('');
    setVerificaCF('idle');
  }, [isOpen]);

  const checkCodiceFiscale = async (cf: string) => {
    try {
      const res = await axios.get('/api/anagrafiche/verifica', {
        params: { codice_fiscale: cf },
      });
      setVerificaCF(res.data.found ? 'ok' : 'notfound');
    } catch (err) {
      setVerificaCF('notfound');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrore('');
    try {
      const res = await axios.post('/api/utenti/create', {
        codice_fiscale: codiceFiscale,
        ruolo,
      });
      setMessaggio(res.data.message);
    } catch (err: any) {
      setErrore(err.response?.data?.error || 'Errore durante la creazione');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-30 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">Crea nuovo utente</h2>

        {messaggio && <p className="text-green-600">{messaggio}</p>}
        {errore && <p className="text-red-600">{errore}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={codiceFiscale}
            onChange={(e) => {
              setCodiceFiscale(e.target.value);
              if (e.target.value.length === 16) {
                checkCodiceFiscale(e.target.value);
              } else {
                setVerificaCF('idle');
              }
            }}
            placeholder="Codice fiscale"
            className="w-full border px-4 py-2 rounded"
            required
          />
          {verificaCF === 'ok' && (
            <p className="text-green-600 text-sm">Codice fiscale trovato.</p>
          )}
          {verificaCF === 'notfound' && (
            <p className="text-red-600 text-sm">Codice fiscale non presente in banche dati.</p>
          )}

          {utente?.is_superadmin && (
            <select value={ruolo} onChange={(e) => setRuolo(e.target.value)} className="w-full border px-4 py-2 rounded">
              <option value="utente">Utente</option>
              <option value="admin">Admin</option>
            </select>
          )}

          <div className="flex justify-end gap-4">
            <button type="button" onClick={onClose} className="text-gray-600 hover:underline">
              Annulla
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-40"
              disabled={verificaCF !== 'ok'}
            >
              Crea utente
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreaUtenteModal;
