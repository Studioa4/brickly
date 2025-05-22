import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import BricklyGrid from "@/components/bricklygrid";
import ModalPDF from "@/components/modali/ModalPDF"; // ⬅️ import del nuovo modale PDF

export default function AccessoEdra() {
  const [dati, setDati] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [caricamento, setCaricamento] = useState(false);
  const [esito, setEsito] = useState("");
  const [pdfSelezionato, setPdfSelezionato] = useState<string | null>(null); // ⬅️ stato per apertura modale

  const fetchDati = () => {
    setLoading(true);

    fetch("/api/catasto/visure")
      .then(res => {
        if (!res.ok) throw new Error("Errore nella risposta dal server");
        return res.json();
      })
      .then(data => {
        setDati(Array.isArray(data) ? data : []);
      })
      .catch(err => {
        console.error("❌ Errore caricamento visure:", err);
        setDati([]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchDati();
  }, []);

  const lanciaBot = async () => {
    setCaricamento(true);
    setEsito("");

    try {
      const res = await fetch(`/api/edra/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({})
      });

      let result;
      try {
        result = await res.json();
      } catch {
        throw new Error("Risposta non valida dal server (non è JSON)");
      }

      if (!res.ok) throw new Error(result.errore || "Errore sconosciuto");

      setEsito("✅ Visure avviate con successo");
      toast.success("Bot Edra avviato");
      fetchDati();
    } catch (err: any) {
      console.error("Errore Edra:", err);
      setEsito("❌ Errore durante l'accesso a Sister");
      toast.error(err.message);
    } finally {
      setCaricamento(false);
    }
  };

  const colonne = [
    { headerName: "Comune", field: "comune", flex: 2 },
    { headerName: "Provincia", field: "provincia", flex: 1, cellClass: "text-center" },
    { headerName: "Sezione", field: "sezione", flex: 1 },
    { headerName: "Foglio", field: "foglio", flex: 1, cellClass: "text-left" },
    { headerName: "Particella", field: "particella", flex: 1, cellClass: "text-left" },
    { headerName: "Subalterno", field: "subalterno", flex: 1, cellClass: "text-left" },
    { headerName: "Rendita", field: "rendita", flex: 1, cellClass: "text-left" },
    { headerName: "Categoria", field: "categoria", flex: 1, cellClass: "text-center" },
    {
      headerName: "Proprietari",
      field: "proprietari",
      flex: 3,
      cellRenderer: () => (
        <em className="text-green-600">-- premi per visualizzare --</em>
      )
    },
    {
      headerName: "Visura",
      field: "visura",
      flex: 1,
      cellRenderer: (params: any) =>
        params.value ? (
          <img
            src="/img/pdf-icon.png" // ⚠️ metti qui il tuo file icon.svg in public/img
            alt="PDF"
            className="cursor-pointer w-6 h-6 mx-auto"
            onClick={() => setPdfSelezionato(params.value)}
          />
        ) : (
          "-"
        )
    }
  ];

  const getDettagliRiga = (riga: any) => {
    if (!riga.proprietari_dettaglio || riga.proprietari_dettaglio.length === 0) return null;
    return (
      <div className="p-2 bg-gray-50 border-t border-gray-300">
        <strong>Proprietari:</strong>
        <ul className="list-disc list-inside">
          {riga.proprietari_dettaglio.map((p: any, i: number) => (
            <li key={i}>
              {p.nome} {p.cognome} – CF: {p.codice_fiscale} – Quota: {p.quota}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Accesso Edra (Catasto)</h1>
        <button
          onClick={fetchDati}
          className="text-sm bg-blue-500 text-white px-3 py-1 rounded"
        >
          🔄 Ricarica visure
        </button>
      </div>

      <button
        onClick={lanciaBot}
        disabled={caricamento}
        className="mb-4 bg-green-600 text-white px-4 py-2 rounded"
      >
        {caricamento ? "Avvio in corso..." : "➕ Avvia recupero visure"}
      </button>

      {loading ? (
        <p>Caricamento in corso...</p>
      ) : (
        <BricklyGrid
          id="brickly-edra-grid"
          rowData={dati}
          columnDefs={colonne}
          getDetailRowContent={getDettagliRiga}
          masterDetail={true}
        />
      )}

      {esito && (
        <div className="mt-4 text-lg font-medium">
          {esito}
        </div>
      )}

      {/* 🔽 Modale per visualizzare PDF */}
      {pdfSelezionato && (
        <ModalPDF
          fileUrl={pdfSelezionato}
          onClose={() => setPdfSelezionato(null)}
          nomeFile="visura.pdf"
        />
      )}
    </div>
  );
}
