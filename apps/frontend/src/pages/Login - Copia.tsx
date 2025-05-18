import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { setUtente } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errore, setErrore] = useState('');
  const [loading, setLoading] = useState(false);
  const loginButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    loginButtonRef.current?.focus();
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      setErrore('Inserisci email e password');
      return;
    }

    setLoading(true);

    try {
      const res = await api.post('/login', { email, password });
      const { token, user } = res.data;

      setUtente(user);
      localStorage.setItem('token', token);
      localStorage.setItem('utente', JSON.stringify(user));
      navigate('/dashboard');
    } catch (err: any) {
      setErrore(err.response?.data?.error || 'Errore di login');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
      {loading && (
        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <img src="/icon.png" alt="loading" className="h-10 w-10 animate-spin" />
        </div>
      )}

      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-xl relative z-10">
        <div className="text-center">
          <img src="/logo.png" alt="Brickly" className="mx-auto h-12 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800">Accedi a Brickly</h2>
        </div>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-200 focus:outline-none"
          disabled={loading}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-200 focus:outline-none"
          disabled={loading}
        />

        {errore && <p className="text-red-500 text-sm">{errore}</p>}

        <button
          ref={loginButtonRef}
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;