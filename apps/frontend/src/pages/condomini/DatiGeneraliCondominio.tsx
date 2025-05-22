import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import BricklyGrid from "@/components/bricklygrid";
import ModaleVerificaCodiceFiscale from "@/components/modali/ModaleVerificaCodiceFiscale";
import ModaleNuovoCondominio from "@/components/modali/ModaleNuovoCondominio";

export default function DatiGeneraliCondominio() {
  const [studioId, setStudioId] = useState<string | null>(() => {
    const val = localStorage.getItem("studio_id");
    return val && val !== "undefined" ? val : null;
  });

  const [condomini, setCondomini] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mostraVerificaCF, setMostraVerificaCF] = useState(false);
  const [mostraNuovo, setMostraNuovo] = useState(false);
  const [cfNuovo, setCfNuovo] = useState("");

  // 🔁 Polling ogni 1.5s per intercettare cambio studio anche se React non lo rileva
  useEffect(() => {
    const interval = setInterval(() => {
      const nuovoId = localStorage.getItem("studio_id");
      if (nuovoId && nuovoId !== studioId) {
        setStudioId(nuovoId);
      }
    }, 1500);
    return () => clearInterval(interval);
  }, [studioId]);

  // 🔃 Fetch condomini dallo studio selezionato
  const fetchCondomini = () => {
    const token = localStorage.getItem("token");

    if (!token || !studioId) {
      console.warn("⛔ Token o studioId non disponibili");
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
        console.error("❌ Errore caricamento condomini:", err);
        toast.error("Errore durante il caricamento dei condomini.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // 🚀 Richiama fetch a ogni cambio studioId
  useEffect(() => {
    if (studioId) fetchCondomini();
  }, [studioId]);

  const colonne = [
    { headerName: "Tipologia", field: "tipologia", width: 150 },
{
  headerName: "Denominazione",
  field: "visualizzazione",
  flex: 1,
  cellRenderer: (params: any) => {
    return (
      <span style={{ fontWeight: "bold" }}>
        {params.value}
      </span>
    );
  },
},

    { headerName: "Indirizzo", field: "indirizzo", flex: 1 },
    { headerName: "Città", field: "citta", flex: 1 },
    { headerName: "Provincia", field: "provincia", width: 100 },
    { headerName: "Cod. fiscale", field: "codice_fiscale", width: 140 },
  ];

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Anagrafica Condomini</h1>
        <button
          onClick={fetchCondomini}
          className="text-sm bg-blue-500 text-white px-3 py-1 rounded"
        >
          🔄 Ricarica
        </button>
      </div>

      <button
        onClick={() => setMostraVerificaCF(true)}
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

      <ModaleVerificaCodiceFiscale
        open={mostraVerificaCF}
        onClose={() => setMostraVerificaCF(false)}
        onSuccess={(cf) => {
          console.log("✅ CF verificato:", cf);
          toast.success("Codice fiscale valido. Apro modale nuovo...");
          setCfNuovo(cf);
          setMostraVerificaCF(false);
          setTimeout(() => setMostraNuovo(true), 200);
        }}
      />

      <ModaleNuovoCondominio
        open={mostraNuovo}
        onClose={() => {
          setMostraNuovo(false);
          setTimeout(() => fetchCondomini(), 300); // 🔁 refresh griglia dopo creazione
        }}
        idStudio={studioId}
        codiceFiscalePreinserito={cfNuovo}
      />
    </div>
  );
}
