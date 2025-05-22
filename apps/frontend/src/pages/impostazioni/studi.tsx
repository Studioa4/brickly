import { useEffect, useState } from "react";
import BricklyGrid from "@/components/bricklygrid";

export default function PaginaStudi() {
  const [studi, setStudi] = useState<any[]>([]);

  const caricaStudi = async () => {
    try {
      const res = await fetch("/api/studi");
      if (!res.ok) throw new Error("Errore nel recupero degli studi");
      const data = await res.json();
      setStudi(data);
    } catch (err) {
      console.error("❌ Errore caricaStudi:", err);
    }
  };

  useEffect(() => {
    caricaStudi();
  }, []);

  const columnDefs = [
    { headerName: "Denominazione", field: "denominazione", filter: "agTextColumnFilter" , flex: 2},
    { headerName: "Comune", field: "comune", filter: "agTextColumnFilter" , flex: 1},
    { headerName: "PEC", field: "pec", filter: "agTextColumnFilter" , flex: 1},
    { headerName: "Codice Fiscale", field: "codice_fiscale", filter: "agTextColumnFilter", width: 140},
    { headerName: "P.IVA", field: "p_iva", filter: "agTextColumnFilter" , width: 140},
            {
    headerName: "Azioni",
    field: "azioni",
    cellRenderer: (params: any) => (
      <button
        className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-2 py-1 rounded"
        onClick={() => alert(`Modifica studio: ${params.data.denominazione}`)}
      >
        ✏️
      </button>
    ),
    width: 100,
    cellStyle: { textAlign: "center" }
  }
];

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Gestione Studi</h1>
      <BricklyGrid
        rowData={studi}
        columnDefs={columnDefs}
        defaultColDef={{
          resizable: true,
          sortable: true,
          filter: true,
          floatingFilter: true,
        }}
      />
    </div>
  );
}