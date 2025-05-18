import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/AppLayout';

const ProtectedPage = () => {
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    fetch('http://localhost:3000/api/profile', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setUser(data.user);
        } else {
          setError(data.error || 'Errore profilo');
          navigate('/login');
        }
      })
      .catch(err => {
        console.error('Errore rete:', err);
        setError('Errore rete');
        navigate('/login');
      });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <AppLayout>
      {!user ? (
        <p>Caricamento...</p>
      ) : (
        <div className="space-y-2">
          <h2 className="text-xl font-bold">Dashboard Protetta</h2>
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>Ruolo:</strong> {user.ruolo}</p>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>
      )}
    </AppLayout>
  );
};

export default ProtectedPage;
