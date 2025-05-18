import React, { useState } from "react";

const NuovoFornitore = ({ onFornitoreInserito }: { onFornitoreInserito: () => void }) => {
  const [piva, setPiva] = useState("");
  const [form, setForm] = useState({
    ragione_sociale: "",
    codice_fiscale: "",
    indirizzo: "",
    cap: "",
    citta: "",
    provincia: "",
    pec: ""
  });
  const [step, setStep] = useState<"inserisci" | "completa" | "salvato">("inserisci");
  const [loading, setLoading] = useState(false);
  const [errore, setErrore] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const cercaFornitore = async () => {
    setErrore("");
    if (!/^[0-9]{11}$/.test(piva.trim())) {
      setErrore("La partita IVA deve contenere 11 cifre.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/fornitori/ricerca/${piva}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Fornitore non trovato");
      setForm(json);
      setStep("completa");
    } catch (err: any) {
      setErrore(err.message);
      setStep("completa"); // permette inserimento manuale anche se non trovato
    } finally {
      setLoading(false);
    }
  };

  const salvaFornitore = async () => {
    setLoading(true);
    setErrore("");
    try {
      const res = await fetch("/api/fornitori", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, partita_iva: piva })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Errore generico");
      setStep("salvato");
      onFornitoreInserito();
    } catch (err: any) {
      setErrore(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border p-4 rounded bg-white shadow-md">
      {step === "inserisci" && (
        <>
          <h3 className="text-lg font-semibold mb-2">Inserisci nuova partita IVA</h3>
          <input
            className="border px-2 py-1 w-full mb-2"
            type="text"
            value={piva}
            onChange={(e) => setPiva(e.target.value)}
            placeholder="Partita IVA"
          />
          <button onClick={cercaFornitore} className="bg-blue-500 text-white px-4 py-2 rounded" disabled={loading}>
            {loading ? "Ricerca..." : "Continua"}
          </button>
        </>
      )}

      {step === "completa" && (
        <>
          <h3 className="text-lg font-semibold mb-2">Compila i dati del fornitore</h3>
          {["ragione_sociale", "codice_fiscale", "indirizzo", "cap", "citta", "provincia", "pec"].map((field) => (
            <input
              key={field}
              className="border px-2 py-1 w-full mb-2"
              type="text"
              name={field}
              placeholder={field.replace("_", " ").toUpperCase()}
              value={(form as any)[field]}
              onChange={handleChange}
            />
          ))}
          <button
            onClick={salvaFornitore}
            className="bg-green-600 text-white px-4 py-2 rounded"
            disabled={loading}
          >
            {loading ? "Salvataggio..." : "Salva fornitore"}
          </button>
        </>
      )}

      {step === "salvato" && (
        <p className="text-green-700 font-semibold">Fornitore inserito correttamente ✅</p>
      )}

      {errore && <p className="text-red-600 mt-2">{errore}</p>}
    </div>
  );
};

export default NuovoFornitore;