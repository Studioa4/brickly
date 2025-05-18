
import React, { useState } from 'react';
import api from '../../api/client';

const CreaUtente = () => {
  const [form, setForm] = useState({
    email: '',
    password: '',
    nome: '',
    cognome: '',
    codice_fiscale: '',
    studio_id: ''
  });

  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const res = await api.post('/superadmin/create-user', form);
      setMessage(res.data.message || 'Utente creato');
    } catch (err: any) {
      setMessage(err.response?.data?.error || 'Errore');
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-6 shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Crea nuovo utente</h2>
      {['email', 'password', 'nome', 'cognome', 'codice_fiscale', 'studio_id'].map((field) => (
        <input
          key={field}
          name={field}
          placeholder={field.replace('_', ' ')}
          type={field === 'password' ? 'password' : 'text'}
          value={(form as any)[field]}
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
        />
      ))}
      <button
        onClick={handleSubmit}
        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
      >
        Crea utente
      </button>
      {message && <p className="mt-4 text-sm text-center text-green-600">{message}</p>}
    </div>
  );
};

export default CreaUtente;
