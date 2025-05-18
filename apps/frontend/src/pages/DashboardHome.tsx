
import React from 'react';
import AppLayout from '../components/AppLayout';

const DashboardHome = () => {
  const studioId = localStorage.getItem('studio_id');
  const utente = JSON.parse(localStorage.getItem('utente') || '{}');

  return (
    <AppLayout>
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-2">Benvenuto in Brickly</h2>
        {studioId && (
          <p className="text-sm text-gray-600 mb-4">
            Sei attualmente nello studio <strong>{studioId}</strong>
          </p>
        )}
        <p className="text-gray-700">
          Utilizza il menu laterale per accedere ai moduli disponibili.
        </p>
      </div>
    </AppLayout>
  );
};

export default DashboardHome;
