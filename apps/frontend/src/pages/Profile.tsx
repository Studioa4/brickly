import React, { useEffect, useState } from 'react';
import AppLayout from '../components/AppLayout';

const Profile = () => {
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError("Token non trovato. Effettua il login.");
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
          setError(data.error || 'Errore sconosciuto');
        }
      })
      .catch(err => {
        console.error('Errore profilo:', err);
        setError('Errore di rete');
      });
  }, []);

  return (
    <AppLayout>
      {error && <p className="text-red-500">{error}</p>}
      {!user ? (
        <p>Caricamento profilo...</p>
      ) : (
        <div className="space-y-2">
          <h2 className="text-xl font-bold">Profilo Utente</h2>
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>Ruolo:</strong> {user.ruolo}</p>
        </div>
      )}
    </AppLayout>
  );
};

export default Profile;
