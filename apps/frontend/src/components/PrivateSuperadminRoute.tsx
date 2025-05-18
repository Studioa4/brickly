
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

type Props = {
  children: JSX.Element;
};

const PrivateSuperadminRoute = ({ children }: Props) => {
  const { utente } = useAuth();

  if (!utente || utente.ruolo !== 'superadmin') {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateSuperadminRoute;
