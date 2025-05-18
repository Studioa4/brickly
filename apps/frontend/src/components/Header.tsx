import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Radio } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

function Header({ toggleRadio }: { toggleRadio: () => void }) {
  const [studioOptions, setStudioOptions] = useState<any[]>([]);
  const [condominiOptions, setCondominiOptions] = useState<any[]>([]);
  const [selectedStudio, setSelectedStudio] = useState<any>(null);
  const [selectedCondominio, setSelectedCondominio] = useState<any>(null);
  const [isStudioLocked, setIsStudioLocked] = useState(false);
  const navigate = useNavigate();
  const { utente, loading } = useAuth();

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("🎯 Token recuperato in Header:", token);
    const utenteRaw = localStorage.getItem("utente");
    if (!utenteRaw) return;

    const utente = JSON.parse(utenteRaw);
    if (!utente?.email) return;

    fetch(`/api/studi-utente-by-email?email=${encodeURIComponent(utente.email)}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        if (!Array.isArray(data)) return;
        const opts = data.map((s, idx) => ({
          value: s.id,
          label: s.denominazione || `Studio ${idx + 1}`,
        }));
        if (opts.length === 1) {
          const unico = opts[0];
          setSelectedStudio(unico);
          setStudioOptions(opts);
          setIsStudioLocked(true);
          localStorage.setItem("studio_id", unico.value);
          localStorage.setItem("studio_nome", unico.label);
        } else {
          setStudioOptions([{ value: "", label: "--seleziona studio--" }, ...opts]);
          setIsStudioLocked(false);
        }
      });
  }, []);

useEffect(() => {
  const token = localStorage.getItem("token");
  console.log("🎯 Token recuperato in Header:", token);

  if (!token || !selectedStudio?.value) {
    console.warn("⚠️ Token o studio non selezionato, salto caricamento condomini");
    return;
  }

  console.log("📡 Inizio chiamata a /api/condomini/utente");

  fetch(`/api/condomini/utente?studio_id=${selectedStudio.value}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then(res => res.json())
    .then(data => {
      console.log("📦 Risposta condomini:", data);

      if (!Array.isArray(data)) {
        console.error("❌ I dati dei condomini non sono un array:", data);
        return;
      }

      const opts = data.map((c: any) => ({
        value: c.id,
        label: c.denominazione || c.codice_fiscale,
      }));

      setCondominiOptions([{ value: "", label: "--tutti i condomini--" }, ...opts]);
    })
    .catch(err => {
      console.error("❌ Errore fetch condomini:", err);
    });
}, [selectedStudio]);

  const handleStudioChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = studioOptions.find(opt => opt.value === e.target.value);
    if (!selected) return;
    setSelectedStudio(selected);
    localStorage.setItem("studio_id", selected.value);
    localStorage.setItem("studio_nome", selected.label);
    setSelectedCondominio(null);
  };

  const handleCondominioChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = condominiOptions.find(opt => opt.value === e.target.value);
    if (!selected) return;
    setSelectedCondominio(selected);
    localStorage.setItem("condominio_id", selected.value);
    localStorage.setItem("condominio_nome", selected.label);
  };

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <header className="bg-slate-900 text-white px-4 py-2 flex justify-between items-center">
      <div className="flex items-center gap-4">
        <img src="/logo.png" alt="Brickly" className="h-8" />
      </div>

      {!loading && utente && (
        <div className="text-white text-sm">
          Benvenuto, {utente.nome || utente.email}
        </div>
      )}

      <div className="flex items-center gap-4">
        {studioOptions.length > 0 && (
          <select
            className="border p-2 rounded text-black"
            disabled={isStudioLocked}
            value={selectedStudio?.value ?? ""}
            onChange={handleStudioChange}
          >
            {studioOptions.map(opt => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        )}
        {condominiOptions.length > 0 && (
          <select
            className="border p-2 rounded text-black"
            value={selectedCondominio?.value ?? ""}
            onChange={handleCondominioChange}
          >
            {condominiOptions.map(opt => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        )}
        <button
          onClick={toggleRadio}
          className="p-2 rounded hover:bg-slate-800"
          title="Apri/Chiudi Radio"
        >
          <Radio className="w-5 h-5" />
        </button>
        <button onClick={logout} className="bg-red-600 text-white px-3 py-1 rounded">
          Esci
        </button>
      </div>
    </header>
  );
}

export default Header;
