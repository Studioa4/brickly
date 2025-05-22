import { useEffect, useState } from "react";
import BricklyGrid from "@/components/bricklygrid";
import NuovoFornitore from "../components/NuovoFornitore";

const FornitoriTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const columnDefs = [
    { headerName: "Ragione Sociale", field: "ragione_sociale", filter: "agTextColumnFilter" , flex: 2},
    { headerName: "PEC", field: "pec", filter: "agTextColumnFilter" , flex: 1},
    { headerName: "Indirizzo", field: "indirizzo", filter: "agTextColumnFilter" , flex: 1},
    { headerName: "CAP", field: "cap", filter: "agTextColumnFilter"  , width: 120},
    { headerName: "Città", field: "citta", filter: "agTextColumnFilter"  , width: 250},
    { headerName: "Provincia", field: "provincia", filter: "agTextColumnFilter"  , width: 100},
    { headerName: "P. IVA", field: "partita_iva", filter: "agTextColumnFilter" , width: 140},
    { headerName: "Codice Fiscale", field: "codice_fiscale", filter: "agTextColumnFilter" , width: 140}
  ];

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/fornitori?limit=9999");
      const json = await res.json();
      setData(json.data || []);
    } catch (error) {
      console.error("Errore nel caricamento fornitori:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onFornitoreInserito = () => {
    setShowForm(false);
    fetchData();
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Elenco Fornitori</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          {showForm ? "Annulla" : "+ Nuovo Fornitore"}
        </button>
      </div>

      {showForm && (
        <div className="mb-6">
          <NuovoFornitore onFornitoreInserito={onFornitoreInserito} />
        </div>
      )}

      {loading ? (
        <p>Caricamento...</p>
      ) : (
        <BricklyGrid
          rowData={data}
          columnDefs={columnDefs}
          defaultColDef={{
            resizable: true,
            sortable: true,
            filter: true,
            floatingFilter: true
          }}
        />
      )}
    </div>
  );
};

export default FornitoriTable;