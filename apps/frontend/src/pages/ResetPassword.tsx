import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const accessToken = searchParams.get('access_token');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errore, setErrore] = useState('');
  const [successo, setSuccesso] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const setupSession = async () => {
      if (!accessToken) {
        setErrore('Token non valido o mancante');
        return;
      }

      // Imposta la sessione
      const { error: sessionError } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: '' // non serve in questo flusso
      });

      if (sessionError) {
        setErrore('Impossibile validare il link. Riprova dalla mail.');
        setCheckingSession(false);
        return;
      }

      // Controlla se l'utente è effettivamente loggato
      const { data, error: userError } = await supabase.auth.getUser();
      if (userError || !data?.user) {
        setErrore('Utente non autenticato. Il link potrebbe essere scaduto.');
      }

      setCheckingSession(false);
    };

    setupSession();
  }, [accessToken]);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrore('');

    if (password !== confirmPassword) {
      setErrore('Le password non coincidono');
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });

    setLoading(false);

    if (error) {
      setErrore(error.message);
    } else {
      setSuccesso(true);
      setTimeout(() => navigate('/login'), 3000);
    }
  };

  if (checkingSession) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-700">
        Verifica del link in corso...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-xl">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Imposta nuova password</h2>

        {successo ? (
          <p className="text-green-600 text-center">Password aggiornata! Verrai reindirizzato al login...</p>
        ) : (
          <form onSubmit={handleReset} className="space-y-4">
            <input
              type="password"
              placeholder="Nuova password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-200 focus:outline-none"
              required
            />
            <input
              type="password"
              placeholder="Conferma nuova password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-200 focus:outline-none"
              required
            />
            {errore && <p className="text-red-500 text-sm text-center">{errore}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Cambia password
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
