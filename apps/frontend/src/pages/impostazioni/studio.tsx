import { useEffect, useState } from "react";
import ModaleNuovoUtente from "@/components/modali/ModaleNuovoUtente";
import { ModaleGestioneUtenteStudio } from "@/components/modali/ModaleGestioneUtenteStudio";
import UtentiStudioTable from "@/components/UtentiStudioTable";
import ModalePermessiUtente from "@/components/modali/ModalePermessiUtente";
import ModaleAssegnaCondomini from "@/components/modali/ModaleAssegnaCondomini";

export default function PaginaUtenti() {
  const [studi, setStudi] = useState<any[]>([]);
  const [selectedStudio, setSelectedStudio] = useState("");
  const [modale, setModale] = useState<"nuovo" | "modifica" | "permessi" | "condomini" | null>(null);
  const [utenteSelezionato, setUtenteSelezionato] = useState<any>(null);
  const [gridTheme, setGridTheme] = useState("ag-theme-quartz");
  const [refreshToken, setRefreshToken] = useState(0);
  const [highlightedUserId, setHighlightedUserId] = useState<string | null>(null);

const aggiornaEChiudi = () => {
  setRefreshToken(prev => prev + 1);
  if (utenteSelezionato?.id) {
    setHighlightedUserId(utenteSelezionato.id);
    setTimeout(() => setHighlightedUserId(null), 2000); // evidenzia per 2s
  }
  setModale(null);
  setUtenteSelezionato(null);
};


  useEffect(() => {
    const prefs = JSON.parse(localStorage.getItem("gridPrefs") || "{}");
    setGridTheme(`ag-theme-${prefs.theme || "quartz"}`);
  }, []);

  useEffect(() => {
    const utente = JSON.parse(localStorage.getItem("utente") || "{}");
    const url = utente?.is_superadmin
      ? "/api/studi"
      : `/api/studi-utente-by-email?email=${encodeURIComponent(utente.email)}`;

    fetch(url)
      .then(res => res.json())
      .then(setStudi)
      .catch(console.error);
  }, []);

  const salvaPermessi = async (livello: number) => {
    const res = await fetch(`/api/utenti-studio/${utenteSelezionato.id}/permessi`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ruolo_id: Number(livello) })
    });
    const result = await res.json();
    if (!res.ok) alert(`Errore aggiornamento permessi: ${result.message}`);
  };

  const onCambiaStatoAttivo = async (utente) => {
    const nuovoStato = !utente.attivo;
    const conferma = window.confirm(`Vuoi ${nuovoStato ? "attivare" : "disattivare"} questo utente?`);
    if (conferma) {
      const res = await fetch(`/api/utenti-studio/${utente.id}/attivo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ attivo: nuovoStato })
      });
      if (!res.ok) {
        const err = await res.json();
        alert(`Errore aggiornamento stato: ${err.message}`);
      } else {
        setRefreshToken(prev => prev + 1);
      }
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Gestione Utenti</h1>

      <div className="flex items-center gap-4 mb-4">
        <select
          className="border p-2 rounded"
          value={selectedStudio}
          onChange={(e) => setSelectedStudio(e.target.value)}
        >
          <option value="">-- seleziona studio --</option>
          {studi.map((s) => (
            <option key={s.id} value={s.id}>
              {s.denominazione}
            </option>
          ))}
        </select>

        {selectedStudio && (
          <>
            <button
              onClick={() => setModale("nuovo")}
              className="bg-green-600 text-white px-3 py-1 rounded"
            >
              + Aggiungi utente
            </button>
            <button
              onClick={() => setRefreshToken(prev => prev + 1)}
              className="bg-blue-500 text-white px-3 py-1 rounded"
            >
              🔄 Refresh
            </button>
          </>
        )}
      </div>

      {selectedStudio && (
        <UtentiStudioTable
          studioId={selectedStudio}
          stileGrid={gridTheme}
          refreshToken={refreshToken}
          highlightedUserId={highlightedUserId} // 👈 qui
          onApriPermessi={(utente) => {
            setUtenteSelezionato(utente);
            setModale("permessi");
          }}
          onApriCondomini={(utente) => {
            setUtenteSelezionato(utente);
            setModale("condomini");
          }}
          onModificaUtente={(utente) => {
            setUtenteSelezionato(utente);
            setModale("modifica");
          }}
          onCambiaStatoAttivo={onCambiaStatoAttivo}
        />
      )}

      {modale === "nuovo" && (
        <ModaleNuovoUtente
          open={true}
          onClose={() => setModale(null)}
          idStudio={selectedStudio}
        />
      )}

      {modale === "modifica" && utenteSelezionato && (
        <ModaleGestioneUtenteStudio
          studioId={selectedStudio}
          abbinamento={utenteSelezionato}
          onClose={aggiornaEChiudi}
          onSalvato={() => alert("Utente aggiornato")}
        />
      )}

      {modale === "permessi" && utenteSelezionato && (
        <ModalePermessiUtente
          open={true}
          livelloCorrente={utenteSelezionato.ruolo_id}
          nomeUtente={`${utenteSelezionato.nome} ${utenteSelezionato.cognome}`}
          onClose={() => setModale(null)}
          onSalva={async (livello) => {
            await salvaPermessi(livello);
            aggiornaEChiudi();
          }}
        />
      )}

      {modale === "condomini" && utenteSelezionato && (
        <ModaleAssegnaCondomini
          open={true}
          idUtenteStudio={utenteSelezionato.id}
          idStudio={selectedStudio}
          onClose={() => {
            setModale(null);
            setUtenteSelezionato(null);
          }}
        />
      )}
    </div>
  );
}
