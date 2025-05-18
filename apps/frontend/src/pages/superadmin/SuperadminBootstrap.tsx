
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/client';

const SuperadminBootstrap = () => {
  const navigate = useNavigate();
  const [canCreate, setCanCreate] = useState(false);
  const [form, setForm] = useState({
    email: '',
    password: '',
    nome: '',
    cognome: '',
    codice_fiscale: ''
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    api.get('/superadmin/bootstrap-check').then(res => {
      setCanCreate(res.data.canCreate);
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const res = await api.post('/superadmin/bootstrap-create', form);
      setMessage(res.data.message || 'Superadmin creato');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      setMessage(err.response?.data?.error || 'Errore');
    }
  };

  if (!canCreate) {
    return <p className="text-center mt-20 text-gray-600">Superadmin già creato o non autorizzato.</p>;
  }

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-6 shadow rounded">
      <h2 className="text-2xl font-bold mb-4 text-center">Crea Superadmin</h2>
      {['email', 'password', 'nome', 'cognome', 'codice_fiscale'].map((field) => (
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
        Crea superadmin
      </button>
      {message && <p className="mt-4 text-sm text-center text-green-600">{message}</p>}
    </div>
  );
};

export default SuperadminBootstrap;
