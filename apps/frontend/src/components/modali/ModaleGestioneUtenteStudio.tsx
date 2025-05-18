import React, { useEffect, useState } from "react";

type Abbinamento = {
  id: string;
  id_utente: string;
  livello_permessi: number;
};

type Props = {
  studioId: string;
  abbinamento?: Abbinamento;
  onClose: () => void;
  onSalvato: () => void;
};

export function ModaleGestioneUtenteStudio({ studioId, abbinamento, onClose, onSalvato }: Props) {
  const [anagrafiche, setAnagrafiche] = useState<any[]>([]);
  const [idUtente, setIdUtente] = useState<string>(abbinamento?.id_utente || "");
  const [livelloPermessi, setLivelloPermessi] = useState<number>(abbinamento?.livello_permessi || 1);

  const isModifica = !!abbinamento;

  useEffect(() => {
    fetch("/api/anagrafiche")
      .then(res => res.json())
      .then(setAnagrafiche)
      .catch(console.error);
  }, []);

  const salva = async () => {
    if (!idUtente || !livelloPermessi) {
      alert("Compila tutti i campi");
      return;
    }

    const metodo = isModifica ? "PUT" : "POST";
    const url = isModifica
      ? `/api/utenti-studio/${abbinamento!.id}`
      : "/api/utenti-studio";

    const res = await fetch(url, {
      method: metodo,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id_studio: studioId,
        id_utente: idUtente,
        livello_permessi: livelloPermessi
      })
    });

    if (!res.ok) {
      alert("Errore salvataggio");
      return;
    }

    onSalvato();
    onClose();
  };

  const elimina = async () => {
    if (!confirm("Sei sicuro di voler eliminare l'abbinamento?")) return;

    const res = await fetch(`/api/utenti-studio/${abbinamento!.id}`, {
      method: "DELETE"
    });

    if (!res.ok) {
      alert("Errore eliminazione");
      return;
    }

    onSalvato();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-md w-[500px]">
        <h2 className="text-xl font-bold mb-4">
          {isModifica ? "Modifica abbinamento" : "Nuovo abbinamento"}
        </h2>

        {!isModifica && (
          <div className="mb-3">
            <label className="block font-semibold mb-1">Utente</label>
            <select className="w-full border p-2 rounded" value={idUtente} onChange={e => setIdUtente(e.target.value)}>
              <option value="">-- Seleziona utente --</option>
              {anagrafiche.map(a => (
                <option key={a.id} value={a.id}>
                  {a.nome} {a.cognome}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="mb-3">
          <label className="block font-semibold mb-1">Livello Permessi</label>
          <select className="w-full border p-2 rounded" value={livelloPermessi} onChange={e => setLivelloPermessi(Number(e.target.value))}>
            {[1,2,3,4,5].map(num => (
              <option key={num} value={num}>Livello {num}</option>
            ))}
          </select>
        </div>

        <div className="text-right mt-4">
          <button onClick={onClose} className="bg-gray-300 px-4 py-2 rounded mr-2">Annulla</button>
          {isModifica && (
            <button onClick={elimina} className="bg-red-600 text-white px-4 py-2 rounded mr-2">
              Elimina
            </button>
          )}
          <button onClick={salva} className="bg-blue-600 text-white px-4 py-2 rounded">
            Salva
          </button>
        </div>
      </div>
    </div>
  );
}
