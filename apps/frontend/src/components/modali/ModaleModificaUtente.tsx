import React, { useState } from "react";

export function ModaleModificaUtente({
  utente,
  onClose,
  onSalvato
}: {
  utente: any;
  onClose: () => void;
  onSalvato: () => void;
}) {
  const [alias, setAlias] = useState(utente.alias_nome ?? '');
  const [ruolo, setRuolo] = useState(utente.ruolo ?? '');

  const salvaModifiche = async () => {
    await fetch(`/api/utenti-studio/${utente.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ alias_nome: alias, ruolo })
    });

    onSalvato(); // aggiorna lista
    onClose();   // chiudi modale
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 shadow-md w-[400px]">
        <h2 className="text-lg font-bold mb-4">Modifica utente</h2>

        <label className="block mb-2 font-semibold">Alias</label>
        <input
          className="w-full border rounded p-2 mb-4"
          value={alias}
          onChange={e => setAlias(e.target.value)}
        />

        <label className="block mb-2 font-semibold">Ruolo</label>
        <select
          className="w-full border rounded p-2 mb-4"
          value={ruolo}
          onChange={e => setRuolo(e.target.value)}
        >
          <option value="admin">Admin</option>
          <option value="operatore">Operatore</option>
          <option value="viewer">Viewer</option>
        </select>

        <div className="mt-6 text-right">
          <button className="bg-gray-300 px-4 py-2 rounded mr-2" onClick={onClose}>Chiudi</button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={salvaModifiche}>Salva</button>
        </div>
      </div>
    </div>
  );
}
