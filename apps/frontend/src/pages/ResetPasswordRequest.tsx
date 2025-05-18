import React, { useState } from 'react';
import axios from 'axios';

const ResetPasswordRequest = () => {
  const [email, setEmail] = useState('');
  const [inviato, setInviato] = useState(false);
  const [errore, setErrore] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrore('');
    try {
      await axios.post('/api/password-recovery', { email });
      setInviato(true);
    } catch (err: any) {
      setErrore(err.response?.data?.error || 'Errore durante l’invio');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-xl">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Recupera password</h2>
        {inviato ? (
          <p className="text-green-600 text-center">Se l’email è corretta, riceverai un link per reimpostare la password.</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="Inserisci la tua email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-200 focus:outline-none"
              required
            />
            {errore && <p className="text-red-500 text-sm text-center">{errore}</p>}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Invia link di recupero
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordRequest;
