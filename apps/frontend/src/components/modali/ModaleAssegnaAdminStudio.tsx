import React, { useEffect, useState } from "react";

export function ModaleAssegnaAdminStudio({
  studio,
  onClose,
  onSalvato
}: {
  studio: any;
  onClose: () => void;
  onSalvato: () => void;
}) {
  const [email, setEmail] = useState(studio.email ?? "");
  const [telefono, setTelefono] = useState(studio.telefono ?? "");
  const [logoUrl, setLogoUrl] = useState(studio.logo_url ?? "");
  const [anagrafiche, setAnagrafiche] = useState<any[]>([]);
  const [codiceFiscaleSelezionato, setCodiceFiscaleSelezionato] = useState("");

  useEffect(() => {
    fetch("/api/anagrafiche")
      .then(res => res.json())
      .then(data => {
        console.log("📋 anagrafiche disponibili (banche_dati):", data);
        setAnagrafiche(data);
      });
  }, []);

  const salva = async () => {
    if (!codiceFiscaleSelezionato) {
      alert("⚠️ Devi selezionare un'anagrafica");
      return;
    }

    await fetch(`/api/studi/${studio.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, telefono, logo_url: logoUrl }),
    });

    const resSync = await fetch("/api/anagrafiche/copia-da-bd", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        codice_fiscale: codiceFiscaleSelezionato,
        studio_id: studio.id
      })
    });

    const syncResult = await resSync.json();
    const id_operativo = syncResult.id_operativo;

    if (!resSync.ok || !id_operativo) {
      alert("❌ Errore copia anagrafica nel DB operativo");
      return;
    }

    console.log("📨 POST admin studio:", {
      id_studio: studio.id,
      id_utente: id_operativo
    });

    const res = await fetch("/api/utenti-studio", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id_studio: studio.id,
        id_utente: id_operativo,
        ruolo: "admin"
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      alert("Errore: " + text);
      return;
    }

    onSalvato();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-md w-[500px] max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Completa studio & assegna admin</h2>

        <div className="mb-3">
          <label className="block font-semibold mb-1">Email</label>
          <input className="w-full border p-2 rounded" value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <div className="mb-3">
          <label className="block font-semibold mb-1">Telefono</label>
          <input className="w-full border p-2 rounded" value={telefono} onChange={e => setTelefono(e.target.value)} />
        </div>
        <div className="mb-3">
          <label className="block font-semibold mb-1">Logo URL</label>
          <input className="w-full border p-2 rounded" value={logoUrl} onChange={e => setLogoUrl(e.target.value)} />
        </div>
        <div className="mb-3">
          <label className="block font-semibold mb-1">Admin (codice fiscale)</label>
          <select className="w-full border p-2 rounded" value={codiceFiscaleSelezionato} onChange={e => setCodiceFiscaleSelezionato(e.target.value)}>
            <option value="">-- Seleziona --</option>
            {anagrafiche.map(a => (
              <option key={a.codice_fiscale} value={a.codice_fiscale}>
                {a.nome} {a.cognome} - {a.codice_fiscale}
              </option>
            ))}
          </select>
        </div>

        <div className="text-right mt-4">
          <button
            className="bg-gray-300 px-4 py-2 rounded mr-2"
            onClick={() => {
              if (confirm("⚠️ I dati dell’admin dello studio sono indispensabili. Sei sicuro di voler uscire senza completare?")) {
                onClose();
              }
            }}
          >
            Annulla
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={salva}>Conferma</button>
        </div>
      </div>
    </div>
  );
}
