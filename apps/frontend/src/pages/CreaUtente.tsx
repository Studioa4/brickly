import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const CreaUtente = () => {
  const { utente } = useAuth();
  const [codiceFiscale, setCodiceFiscale] = useState('');
  const [ruolo, setRuolo] = useState('utente');
  const [messaggio, setMessaggio] = useState('');
  const [errore, setErrore] = useState('');

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

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Crea nuovo utente</h2>
      {messaggio && <p className="text-green-600">{messaggio}</p>}
      {errore && <p className="text-red-600">{errore}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={codiceFiscale}
          onChange={(e) => setCodiceFiscale(e.target.value)}
          placeholder="Codice fiscale"
          className="w-full border px-4 py-2 rounded"
          required
        />
        {utente?.is_superadmin && (
          <select value={ruolo} onChange={(e) => setRuolo(e.target.value)} className="w-full border px-4 py-2 rounded">
            <option value="utente">Utente</option>
            <option value="admin">Admin</option>
          </select>
        )}
        {!utente?.is_superadmin && (
          <input type="hidden" value="utente" />
        )}
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Crea utente
        </button>
      </form>
    </div>
  );
};

export default CreaUtente;
