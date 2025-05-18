
import React, { useEffect, useRef, useState } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  idStudio: string;
}

interface Anagrafica {
  codice_fiscale: string;
  nome: string;
  cognome: string;
}

const ModaleNuovoUtente: React.FC<Props> = ({ open, onClose, idStudio }) => {
  const [cf, setCf] = useState("");
  const [anagrafica, setAnagrafica] = useState<Anagrafica | null>(null);
  const [alias, setAlias] = useState("");
  const [email, setEmail] = useState("");
  const [errore, setErrore] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [modalAnagrafica, setModalAnagrafica] = useState(false);
  const [focusEseguito, setFocusEseguito] = useState(false);
  const nomeRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (anagrafica && nomeRef.current && !focusEseguito) {
      nomeRef.current.focus();
      setFocusEseguito(true);
    }
  }, [anagrafica, focusEseguito]);

  const cercaAnagrafica = async () => {
    setErrore(null);
    setAnagrafica(null);
    setFocusEseguito(false);

    try {
      const res = await fetch("/api/utenti/verifica-codice-fiscale", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ codice_fiscale: cf.toUpperCase().trim() })
      });

      const data = await res.json();

      if (!data.valid) {
        throw new Error(data.error || "Codice fiscale non valido");
      }

      if (!data.found || !data.anagrafiche?.length) {
        setModalAnagrafica(true);
        return;
      }

      const ana = data.anagrafiche[0];
      setAnagrafica({
        codice_fiscale: ana.codice_fiscale,
        nome: ana.nome,
        cognome: ana.cognome
      });
    } catch (err: any) {
      setErrore(err.message || "Errore durante la ricerca");
    }
  };

  const confermaInserimento = async () => {
    if (!anagrafica) return;
    setLoading(true);
    setErrore(null);

    try {
      await fetch("/api/anagrafiche/banche-dati", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          codice_fiscale: anagrafica.codice_fiscale,
          nome: anagrafica.nome,
          cognome: anagrafica.cognome
        })
      });

      const resOp = await fetch("/api/anagrafiche/operativo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          codice_fiscale: anagrafica.codice_fiscale,
          nome: anagrafica.nome,
          cognome: anagrafica.cognome,
          alias_nome: alias,
          email,
          studio_id: idStudio
        })
      });

      const dataOp = await resOp.json();

      await fetch("/api/utenti-studio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_studio: idStudio,
          id_utente: dataOp.id_utente,
          attivo: false
        })
      });

      onClose();
    } catch (err: any) {
      console.error("❌ Errore salvataggio:", err);
      setErrore("Errore durante la creazione dell'utente");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-xl shadow-lg w-[500px]">
          <h2 className="text-xl font-bold mb-4">Nuovo utente dello studio</h2>

          <label className="block mb-2">Codice Fiscale</label>
          <input
            type="text"
            maxLength={16}
            value={cf}
            onChange={(e) => setCf(e.target.value.toUpperCase().slice(0, 16))}
            className="w-full border px-3 py-2 rounded mb-4"
            disabled={!!anagrafica}
          />

          {anagrafica && (
            <>
              <label className="block mb-2">Nome</label>
              <input
                ref={nomeRef}
                type="text"
                value={anagrafica.nome}
                onChange={(e) => setAnagrafica({ ...anagrafica, nome: e.target.value })}
                className="w-full border px-3 py-2 rounded mb-4"
              />

              <label className="block mb-2">Cognome</label>
              <input
                type="text"
                value={anagrafica.cognome}
                onChange={(e) => setAnagrafica({ ...anagrafica, cognome: e.target.value })}
                className="w-full border px-3 py-2 rounded mb-4"
              />

              <label className="block mb-2">Alias</label>
              <input
                type="text"
                value={alias}
                onChange={(e) => setAlias(e.target.value)}
                className="w-full border px-3 py-2 rounded mb-4"
              />

              <label className="block mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border px-3 py-2 rounded mb-4"
                required
              />
            </>
          )}

          <div className="flex justify-end space-x-2">
            <button onClick={onClose} className="border px-4 py-2 rounded">Esci</button>
            {!anagrafica ? (
              <button onClick={cercaAnagrafica} className="bg-blue-600 text-white px-4 py-2 rounded">Cerca</button>
            ) : (
              <button onClick={confermaInserimento} disabled={loading} className="bg-green-600 text-white px-4 py-2 rounded">
                {loading ? "Salvataggio..." : "Conferma"}
              </button>
            )}
          </div>

          {errore && <p className="text-red-500 mt-4">{errore}</p>}
        </div>
      </div>

      {modalAnagrafica && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 w-[500px]">
            <h2 className="text-lg font-bold mb-4">Crea nuova anagrafica</h2>
            <p className="mb-4">Il codice fiscale è valido ma non esiste nel database. Vuoi creare una nuova anagrafica?</p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setModalAnagrafica(false)} className="border px-4 py-2 rounded">Annulla</button>
              <button
                onClick={() => {
                  setAnagrafica({
                    codice_fiscale: cf.toUpperCase(),
                    nome: "",
                    cognome: ""
                  });
                  setModalAnagrafica(false);
                }}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Continua
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ModaleNuovoUtente;
