import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import BricklyGrid from "@/components/bricklygrid";
import ModaleNuovoCondominio from "@/components/modali/ModaleNuovoCondominio";

export default function DatiGeneraliCondominio() {
  const [condomini, setCondomini] = useState([]);
  const [loading, setLoading] = useState(true);
  const [studioId, setStudioId] = useState(localStorage.getItem("studio_id"));
  const [mostraModale, setMostraModale] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // 🔁 Monitoraggio di eventuali cambi nello studio selezionato
  useEffect(() => {
    const interval = setInterval(() => {
      const id = localStorage.getItem("studio_id");
      if (id !== studioId) {
        setStudioId(id);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [studioId]);

  // 📡 Caricamento dati ogni volta che cambia lo studio
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token || !studioId || studioId === "undefined") {
      console.warn("⛔ studioId mancante o non valido:", studioId);
      setCondomini([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    fetch(`/api/condomini?studio_id=${studioId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async res => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Errore ${res.status}: ${text}`);
        }
        return res.json();
      })
      .then(data => {
        if (!Array.isArray(data)) throw new Error("Dati non validi");

        const normalizzati = data.map((c: any) => ({
          ...c,
          visualizzazione: c.alias_denominazione || c.denominazione,
        }));

        setCondomini(normalizzati);
      })
      .catch(err => {
        console.error("❌ Errore condomini:", err);
        toast.error("Errore durante il caricamento dei condomini.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [studioId, refreshKey]);

  const colonne = [
    { headerName: "Tipologia", field: "tipologia", width: 150 },
    { headerName: "Denominazione", field: "visualizzazione", flex: 1 },
    { headerName: "Indirizzo", field: "indirizzo", flex: 1 },
    { headerName: "Città", field: "citta", flex: 1 },
    { headerName: "Provincia", field: "provincia", width: 100 },
    { headerName: "Cod. fiscale", field: "codice_fiscale", width: 140 }
  ];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Anagrafica Condomini</h1>

      <button
        onClick={() => setMostraModale(true)}
        className="mb-4 bg-green-600 text-white px-4 py-2 rounded"
      >
        ➕ Aggiungi Condominio
      </button>

      {loading ? (
        <p>Caricamento in corso...</p>
      ) : (
        <BricklyGrid
          id="prefs-condomini"
          rowData={condomini}
          columnDefs={colonne}
        />
      )}

      <ModaleNuovoCondominio
        open={mostraModale}
        onClose={(deveAggiornare: boolean) => {
          setMostraModale(false);
          if (deveAggiornare) setRefreshKey(prev => prev + 1);
        }}
        idStudio={studioId}
      />
    </div>
  );
}
