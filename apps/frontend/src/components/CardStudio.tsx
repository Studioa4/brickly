import React from 'react';
import { Studio } from '@/types';

type Props = {
  studio?: Studio;
};

const CardStudio = ({ studio }: Props) => {
  if (!studio) {
    return <div className="text-red-500">Nessuno studio selezionato.</div>;
  }

  return (
    <div className="border p-4 rounded shadow bg-white space-y-2">
      <h2 className="text-xl font-bold text-blue-800">Studio selezionato</h2>
      <p><strong>Denominazione:</strong> {studio.denominazione}</p>
      <p><strong>Codice Fiscale:</strong> {studio.codice_fiscale}</p>
      <p><strong>ID Studio:</strong> {studio.id}</p>
    </div>
  );
};

export default CardStudio;
