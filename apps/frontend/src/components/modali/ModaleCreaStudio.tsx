import React, { useEffect, useState } from "react";

export function ModaleCreaStudio({ onClose, onCreato }: { onClose: () => void; onCreato: () => void }) {
  const [fornitori, setFornitori] = useState<any[]>([]);
  const [fornitoreSelezionato, setFornitoreSelezionato] = useState<any | null>(null);
  const [form, setForm] = useState({
    denominazione: "",
    codice_fiscale: "",
    p_iva: "",
    email: "",
    pec: "",
    telefono: "",
    indirizzo: "",
    logo_url: "",
    comune: ""
  });

  useEffect(() => {
    fetch("/api/fornitori?limit=1000")
      .then(res => res.json())
      .then(setFornitori);
  }, []);

  const selezionaFornitore = (cf: string) => {
    const f = fornitori.find(f => f.codice_fiscale === cf);
    if (f) {
      setFornitoreSelezionato(f);
      setForm({
        denominazione: f.denominazione ?? "",
        codice_fiscale: f.codice_fiscale ?? "",
        p_iva: f.partita_iva ?? "",
        email: f.email ?? "",
        pec: f.pec ?? "",
        telefono: f.telefono ?? "",
        indirizzo: f.indirizzo ?? "",
        logo_url: "",
        comune: f.citta ?? ""
      });
    }
  };

  const aggiornaCampo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const creaStudio = async () => {
    await fetch("/api/studi", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    onCreato();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 shadow-md w-[600px] max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-bold mb-4">Crea nuovo studio da fornitore</h2>

        <label className="block font-semibold mb-1">Seleziona fornitore</label>
        <select
          className="w-full border rounded p-2 mb-4"
          onChange={e => selezionaFornitore(e.target.value)}
          value={fornitoreSelezionato?.codice_fiscale ?? ""}
        >
          <option value="">-- Seleziona --</option>
          {fornitori.map((f) => (
            <option key={f.codice_fiscale} value={f.codice_fiscale}>
              {f.denominazione} ({f.codice_fiscale})
            </option>
          ))}
        </select>

        {Object.keys(form).map((key) => (
          <div className="mb-3" key={key}>
            <label className="block font-semibold mb-1">{key.replace("_", " ")}</label>
            <input
              type="text"
              name={key}
              value={(form as any)[key]}
              onChange={aggiornaCampo}
              className="w-full border rounded p-2"
            />
          </div>
        ))}

        <div className="mt-4 text-right">
          <button className="bg-gray-300 px-4 py-2 rounded mr-2" onClick={onClose}>Annulla</button>
          <button className="bg-green-600 text-white px-4 py-2 rounded" onClick={creaStudio}>Crea</button>
        </div>
      </div>
    </div>
  );
}
