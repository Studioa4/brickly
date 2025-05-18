import React, { useEffect, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

interface Props {
  studioId: string;
  onApriPermessi: (utente: any) => void;
  onApriCondomini: (utente: any) => void;
  onModificaUtente: (utente: any) => void;
  onCambiaStatoAttivo: (utente: any) => void;
}

const UtentiStudioTable: React.FC<Props> = ({
  studioId,
  onApriPermessi,
  onApriCondomini,
  onModificaUtente,
  onCambiaStatoAttivo
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
  }, [studioId]);

  const columnDefs = [
{ headerName: "Nome", field: "nome", flex: 1 },
{ headerName: "Cognome", field: "cognome", flex: 1 },
{ headerName: "Email", field: "email", flex: 2 },

    {
      headerName: "Livello",
      field: "ruolo_nome",
      width: 100,
      cellStyle: { textAlign: "center", fontWeight: "bold" }
    },
    {
      headerName: "Permessi",
      cellRenderer: (p) => <button onClick={() => onApriPermessi(p.data)}>🔐</button>,
      width: 120,
      cellStyle: { textAlign: "center" }
    },
    {
      headerName: "Condomìni",
      cellRenderer: (p) => <button onClick={() => onApriCondomini(p.data)}>🏢</button>,
      width: 120,
      cellStyle: { textAlign: "center" }
    },
    {
      headerName: "Attivo",
      cellRenderer: (p) => (
        <button onClick={() => onCambiaStatoAttivo(p.data)}>
          {p.data.attivo ? "✅" : "❌"}
        </button>
      ),
      width: 120,
      cellStyle: { textAlign: "center" }
    },
    {
      headerName: "Modifica",
      cellRenderer: (p) => <button onClick={() => onModificaUtente(p.data)}>✏️</button>,
      width: 120,
      cellStyle: { textAlign: "center" }
    }
  ];

  return (
    <div className="ag-theme-alpine" style={{ height: 400, width: "100%" }}>
      <AgGridReact
        rowData={utenti}
        columnDefs={columnDefs}
        defaultColDef={{ resizable: true, sortable: true, filter: true }}
      />
    </div>
  );
};

export default UtentiStudioTable;
