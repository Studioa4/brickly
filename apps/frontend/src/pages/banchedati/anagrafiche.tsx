import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import BricklyGrid from "@/components/bricklygrid";
import ModaleNuovaAnagrafica from "@/components/modali/ModaleNuovaAnagrafica";
import ModaleVerificaCodiceFiscaleAnagrafica from "@/components/modali/ModaleVerificaCodiceFiscaleAnagrafica";

export default function Anagrafiche() {
  const [anagrafiche, setAnagrafiche] = useState([]);
  const [loading, setLoading] = useState(true);

  const [mostraVerifica, setMostraVerifica] = useState(false);
  const [mostraModale, setMostraModale] = useState(false);
  const [modalePronto, setModalePronto] = useState(false);

  const [cfPreinserito, setCfPreinserito] = useState("");
  const [decodedCf, setDecodedCf] = useState<any>(null);
  const [tipoPersona, setTipoPersona] = useState<"fisica" | "giuridica">("fisica");

  const fetchAnagrafiche = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Token non disponibile");
      setLoading(false);
      return;
    }

    setLoading(true);

    fetch(`/api/anagrafiche-banche-dati`, {
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
        const normalizzati = data.map((a: any) => ({
          ...a,
          visualizzazione:
            a.tipo_persona === "fisica"
              ? `${a.cognome ?? ""} ${a.nome ?? ""}`.trim()
              : a.ragione_sociale,
        }));
        setAnagrafiche(normalizzati);
      })
      .catch(err => {
        console.error("❌ Errore caricamento anagrafiche:", err);
        toast.error("Errore durante il caricamento delle anagrafiche.");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAnagrafiche();
  }, []);

  useEffect(() => {
    if (modalePronto) {
      setMostraModale(true);
      setModalePronto(false);
    }
  }, [modalePronto]);

  const colonne = [
    {
      headerName: "Tipo",
      field: "tipo_persona",
      width: 120,
      filter: true,
      cellRenderer: (params: any) =>
        params.value === "fisica" ? "👤 Fisica" : "🏢 Giuridica",
    },
    {
      headerName: "Nominativo / Ragione sociale",
      field: "visualizzazione",
      flex: 2,
      cellRenderer: (params: any) => (
        <span style={{ fontWeight: "bold" }}>{params.value}</span>
      ),
    },
    { headerName: "Codice Fiscale", field: "codice_fiscale", flex: 1 },
  ];

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Anagrafiche</h1>
        <button
          onClick={fetchAnagrafiche}
          className="text-sm bg-blue-500 text-white px-3 py-1 rounded"
        >
          🔄 Ricarica
        </button>
      </div>

      <button
        onClick={() => setMostraVerifica(true)}
        className="mb-4 bg-green-600 text-white px-4 py-2 rounded"
      >
        ➕ Aggiungi Anagrafica
      </button>
{console.log("📢 mostraVerifica:", mostraVerifica)}
{mostraVerifica && <p>✅ STATO: mostraVerifica = TRUE</p>}


      {loading ? (
        <p>Caricamento in corso...</p>
      ) : (
        <BricklyGrid
          id="prefs-anagrafiche"
          rowData={anagrafiche}
          columnDefs={colonne}
        />
      )}

      <ModaleVerificaCodiceFiscaleAnagrafica
        open={mostraVerifica}
        onClose={() => setMostraVerifica(false)}
        onSuccess={(cf, decoded, tipo) => {
          setCfPreinserito(cf);
          setDecodedCf(decoded);
          setTipoPersona(tipo);
          setMostraVerifica(false);
          setModalePronto(true);
        }}
      />

      <ModaleNuovaAnagrafica
        open={mostraModale}
        onClose={() => {
          setMostraModale(false);
          setCfPreinserito("");
          setDecodedCf(null);
          setTimeout(() => fetchAnagrafiche(), 300);
        }}
        codiceFiscalePreinserito={cfPreinserito}
        datiDecodificati={decodedCf}
        tipoPersona={tipoPersona}
      />
    </div>
  );
}
