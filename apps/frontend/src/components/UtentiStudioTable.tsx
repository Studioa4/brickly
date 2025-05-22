import React, { useEffect, useState } from "react";
import BricklyGrid from "@/components/bricklygrid";

interface Props {
  studioId: string;
  stileGrid: string;
  refreshToken: number;
  onApriPermessi: (utente: any) => void;
  onApriCondomini: (utente: any) => void;
  onModificaUtente: (utente: any) => void;
  onCambiaStatoAttivo: (utente: any) => void;
  highlightedUserId?: string;
}

const UtentiStudioTable: React.FC<Props> = ({
  studioId,
  stileGrid,
  refreshToken,
  onApriPermessi,
  onApriCondomini,
  onModificaUtente,
  onCambiaStatoAttivo,
  highlightedUserId
}) => {
  const [utenti, setUtenti] = useState<any[]>([]);

  const caricaUtenti = async () => {
    if (!studioId) return;
    const res = await fetch(`/api/utenti-studio?studio_id=${studioId}`);
    const data = await res.json();
    setUtenti(data);
  };

  useEffect(() => {
    caricaUtenti();
  }, [studioId, refreshToken]);

  const columnDefs = [
    { headerName: "Nome", field: "nome", flex: 1 },
    { headerName: "Cognome", field: "cognome", flex: 1 },
    { headerName: "Email", field: "email", flex: 2 },
    {
      headerName: "Livello",
      field: "ruolo_nome",
      flex: 1,
      cellStyle: { textAlign: "center", fontWeight: "bold" }
    },
    {
      headerName: "Permessi",
      cellRenderer: (p: any) => (
        <button onClick={() => onApriPermessi(p.data)}>🔐</button>
      ),
      width: 120,
      suppressSizeToFit: true,
      cellStyle: { textAlign: "center" }
    },
    {
      headerName: "Condomìni",
      cellRenderer: (p: any) => (
        <span
          role="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onApriCondomini(p.data);
          }}
          style={{
            cursor: "pointer",
            display: "inline-block",
            padding: "4px",
            borderRadius: "4px",
            fontSize: "1.1rem"
          }}
          aria-label="Gestione condomìni utente"
        >
          🏢
        </span>
      ),
      width: 120,
      suppressSizeToFit: true,
      cellStyle: { textAlign: "center" }
    },
    {
      headerName: "Attivo",
      cellRenderer: (p: any) => (
        <button onClick={() => onCambiaStatoAttivo(p.data)}>
          {p.data.attivo ? "✅" : "❌"}
        </button>
      ),
      width: 120,
      suppressSizeToFit: true,
      cellStyle: { textAlign: "center" }
    },
    {
      headerName: "Modifica",
      cellRenderer: (p: any) => (
        <button onClick={() => onModificaUtente(p.data)}>✏️</button>
      ),
      width: 120,
      suppressSizeToFit: true,
      cellStyle: { textAlign: "center" }
    }
  ];

  return (
    <BricklyGrid
      id="prefs-utenti"
      rowData={utenti}
      columnDefs={columnDefs}
      getRowClass={(params) =>
        highlightedUserId && params.data.id === highlightedUserId
          ? "animate-fadeHighlight"
          : ""
      }
    />
  );
};

export default UtentiStudioTable;
