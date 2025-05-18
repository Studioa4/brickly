
import React from 'react';
import { usePermessi } from '../context/PermessiContext';

type RouteProtettaProps = {
  modulo: keyof ReturnType<typeof usePermessi>['permessi'];
  children: React.ReactNode;
};

export const RouteProtetta: React.FC<RouteProtettaProps> = ({ modulo, children }) => {
  const { permessi, loading } = usePermessi();

  if (loading) return <p>Caricamento...</p>;

  if (!permessi || !permessi[modulo]) {
    return <p>Accesso negato a questa sezione.</p>;
  }

  return <>{children}</>;
};
