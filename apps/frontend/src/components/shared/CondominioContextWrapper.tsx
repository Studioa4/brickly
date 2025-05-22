import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

interface Condominio {
  id: string;
  tipologia: string;
  denominazione: string;
  alias_denominazione?: string;
  indirizzo: string;
  cap: string;
  citta: string;
  provincia: string;
  codice_fiscale: string;
}

interface Props {
  renderContent: (condominio: Condominio) => React.ReactNode;
}

export default function CondominioContextWrapper({ renderContent }: Props) {
  const navigate = useNavigate();
  const [condominio, setCondominio] = useState<Condominio | null>(null);
  const erroreGestito = useRef(false);

  const fetchCondominio = async (id: string) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(`/api/condomini/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error(await res.text());

      const data = await res.json();
      if (!data?.id) throw new Error("Condominio non trovato");

      setCondominio(data);
    } catch (err) {
      console.error("❌ Errore caricamento condominio:", err);
      toast.error("Errore nel recupero del condominio selezionato.");
      navigate("/dashboard");
    }
  };

  // Primo caricamento condominio
  useEffect(() => {
    const condominioId = localStorage.getItem("condominio_id");
    const token = localStorage.getItem("token");

    if (!condominioId || !token) {
      if (!erroreGestito.current) {
        toast.error("⚠️ Nessun condominio selezionato. Ritorno alla dashboard...");
        navigate("/dashboard");
        erroreGestito.current = true;
      }
      return;
    }

    fetchCondominio(condominioId);
  }, [navigate]);

  // 🔁 Polling per rilevare cambio condominio selezionato nel localStorage
  useEffect(() => {
    const interval = setInterval(() => {
      const nuovoId = localStorage.getItem("condominio_id");

      if (nuovoId && nuovoId !== condominio?.id) {
        fetchCondominio(nuovoId); // refetch silenzioso
      }
    }, 1500);

    return () => clearInterval(interval);
  }, [condominio?.id]);

  if (!condominio) return null;

  return (
    <div className="p-6">
      <div className="text-center mb-8">
        <div className="text-xl font-semibold">
          {condominio.tipologia} {condominio.alias_denominazione || condominio.denominazione}
        </div>
        <div className="text-sm text-gray-700 mt-1">
          {condominio.indirizzo} – {condominio.cap}, {condominio.citta} ({condominio.provincia})
        </div>
        <div className="text-sm text-gray-600 mt-1">
          codice fiscale {condominio.codice_fiscale}
        </div>
      </div>
      {renderContent(condominio)}
    </div>
  );
}
