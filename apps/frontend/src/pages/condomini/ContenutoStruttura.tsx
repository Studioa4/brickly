import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import BricklyGrid from "@/components/bricklygrid";
import ModaleNuovaParteComune from "@/components/modali/ModaleNuovaParteComune";

export default function ContenutoStruttura({ condominio }) {
  const [strutture, setStrutture] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mostraNuovo, setMostraNuovo] = useState(false);

  const fetchStrutture = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    const res = await fetch(`/api/parti-comuni?condominio_id=${condominio.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Errore struttura:", text);
      setStrutture([]);
      setLoading(false);
      return;
    }

    const data = await res.json();
    setStrutture(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchStrutture();
  }, [condominio.id]);

  const colonne = [
  { headerName: "Tipologia", field: "tipologia", flex: 1 },
  { headerName: "Nome", field: "nome", flex: 1 },
  { headerName: "Descrizione", field: "descrizione", flex: 2 },
  ];

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Anagrafica parti comuni</h1>
      </div>

      <button
        onClick={() => setMostraNuovo(true)}
        className="mb-4 bg-green-600 text-white px-4 py-2 rounded text-sm"
      >
        ➕ Aggiungi Parte Comune
      </button>

      {loading ? (
        <p>Caricamento in corso...</p>
      ) : (
        <BricklyGrid
          id={`struttura-${condominio.id}`}
          rowData={strutture}
          columnDefs={colonne}
        />
      )}

      <ModaleNuovaParteComune
        open={mostraNuovo}
        onClose={() => {
          setMostraNuovo(false);
          setTimeout(() => fetchStrutture(), 300);
        }}
        condominioId={condominio.id}
      />
    </div>
  );
}
