import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import BricklyGrid from "@/components/bricklygrid";

export default function PaginaCondomini() {
  const [condomini, setCondomini] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

useEffect(() => {
  const utente = JSON.parse(localStorage.getItem("utente") || "{}");

  if (!utente?.email) {
    toast.error("Utente non valido. Effettua nuovamente l'accesso.");
    navigate("/login");
    return;
  }

  fetch(`/api/condomini/utente?email=${encodeURIComponent(utente.email)}`)
    .then(res => {
      if (!res.ok) throw new Error("Errore nel recupero dei condomini");
      return res.json();
    })
    .then(data => {
      if (!Array.isArray(data)) throw new Error("Formato dati non valido");
      setCondomini(data);
      setLoading(false);
    })
    .catch((err) => {
      console.error("Errore nel caricamento dei condomini:", err);
      toast.error("Errore nel caricamento dei condomini.");
    });
}, []);

  const colonne = [
    { headerName: "Tipologia", field: "codice", flex: 1 },
    { headerName: "Denominazione", field: "visualizzazione", flex: 2 },
    { headerName: "Comune", field: "comune", flex: 1 },
    { headerName: "Provincia", field: "provincia", flex: 1 },
    { headerName: "Cod. fiscale", field: "codice_fiscale", flex: 2 },
    // puoi aggiungere altre colonne o pulsanti azione
  ];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Anagrafica Condomini</h1>
      {loading ? (
        <p>Caricamento in corso...</p>
      ) : (
        <BricklyGrid
          rowData={condomini}
          columnDefs={colonne}
        />
      )}
    </div>
  );
}
