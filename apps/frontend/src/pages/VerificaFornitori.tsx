import React, { useState } from "react";

type Modifica = {
  id: string;
  partita_iva: string;
  modifiche: {
    [key: string]: { vecchio: string; nuovo: string };
  };
};

const VerificaFornitori = () => {
  const [differenze, setDifferenze] = useState<Modifica[]>([]);
  const [indice, setIndice] = useState(0);
  const [verificaAttiva, setVerificaAttiva] = useState(false);
  const [salvati, setSalvati] = useState(0);

  const avviaVerifica = async () => {
    setVerificaAttiva(true);
    setSalvati(0);
    setIndice(0);
    const res = await fetch("/api/fornitori/verifica-tutti", { method: "POST" });
    const json = await res.json();
    setDifferenze(json.modifiche || []);
  };

  const confermaAggiornamento = async () => {
    const diff = differenze[indice];
    const aggiornato: any = {};
    for (const campo in diff.modifiche) {
      aggiornato[campo] = diff.modifiche[campo].nuovo;
    }

    const res = await fetch(`/api/fornitori/${diff.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(aggiornato)
    });

    if (res.ok) setSalvati(salvati + 1);
    passaAlProssimo();
  };

  const passaAlProssimo = () => {
    if (indice + 1 < differenze.length) {
      setIndice(indice + 1);
    } else {
      setVerificaAttiva(false);
    }
  };

  if (!verificaAttiva) {
    return (
      <div className="p-4">
        <button
          onClick={avviaVerifica}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Avvia Verifica Fornitori
        </button>
        {differenze.length > 0 && (
          <p className="mt-4 text-sm text-gray-700">
            Verifica completata: {differenze.length} record da aggiornare, {salvati} aggiornati.
          </p>
        )}
      </div>
    );
  }

  const diff = differenze[indice];
  const modifiche = diff.modifiche;

  return (
    <div className="border rounded p-4 bg-white shadow-md">
      <h3 className="text-lg font-semibold mb-2">Differenze per {diff.partita_iva}</h3>
      {Object.entries(modifiche).map(([campo, val]) => (
        <div key={campo} className="mb-3">
          <p className="text-sm font-semibold">{campo.toUpperCase()}</p>
          <div className="flex gap-2">
            <span className="text-red-600 line-through">{val.vecchio}</span>
            <span className="text-blue-600">{val.nuovo}</span>
          </div>
        </div>
      ))}

      <div className="flex gap-4 mt-4">
        <button
          onClick={confermaAggiornamento}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Sì, aggiorna
        </button>
        <button
          onClick={passaAlProssimo}
          className="bg-gray-300 text-black px-4 py-2 rounded"
        >
          No, passa al prossimo
        </button>
      </div>

      <p className="text-sm text-gray-600 mt-2">
        {indice + 1} di {differenze.length}
      </p>
    </div>
  );
};

export default VerificaFornitori;