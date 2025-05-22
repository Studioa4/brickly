import { useEffect, useState } from "react";
import BricklyGrid from "@/components/bricklygrid";
import ModaleNuovoImpianto from "@/components/modali/ModaleNuovoImpianto";

interface Props {
  condominio: {
    id: string;
  };
}

export default function ContenutoImpianti({ condominio }: Props) {
  const [impianti, setImpianti] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mostraNuovo, setMostraNuovo] = useState(false);

  const fetchImpianti = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");

    const res = await fetch(`/api/impianti?condominio_id=${condominio.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Errore API impianti:", text);
      setImpianti([]);
      setLoading(false);
      return;
    }

    const data = await res.json();
    setImpianti(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchImpianti();
  }, [condominio.id]);

const colonne = [
  { headerName: "Tipo", field: "tipo", flex: 1 },
  { headerName: "Descrizione", field: "descrizione", flex: 2 },
  { headerName: "Marca/Modello", field: "marca_modello", flex: 1 },
  { headerName: "Anno", field: "anno_installazione", width: 120 },
  { headerName: "Parte comune", field: "struttura_nome", flex: 1 },
];


  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Anagrafica impianti</h1>
      </div>

      <button
        onClick={() => setMostraNuovo(true)}
        className="mb-4 bg-green-600 text-white px-4 py-2 rounded text-sm"
      >
        ➕ Aggiungi Impianto
      </button>

      {loading ? (
        <p>Caricamento impianti...</p>
      ) : (
        <BricklyGrid
          id={`impianti-${condominio.id}`}
          rowData={impianti}
          columnDefs={colonne}
        />
      )}

{mostraNuovo && (
  <ModaleNuovoImpianto
    open={mostraNuovo}
    onClose={() => {
      setMostraNuovo(false);
      setTimeout(fetchImpianti, 300);
    }}
    condominioId={condominio.id}
  />
)}

    </div>
  );
}
