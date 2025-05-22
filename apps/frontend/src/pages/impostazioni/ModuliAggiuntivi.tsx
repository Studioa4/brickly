import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "react-toastify";

export default function ModuliAggiuntivi() {
  const [studioId, setStudioId] = useState(() => localStorage.getItem("studio_id"));
  const [form, setForm] = useState({
    sister_username: "",
    sister_password: "",
    sister_pin: ""
  });

  // Polling solo per rilevare cambi successivi
  useEffect(() => {
    const interval = setInterval(() => {
      const nuovoId = localStorage.getItem("studio_id");
      setStudioId(prev => (prev !== nuovoId ? nuovoId : prev));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Carica i dati dei moduli al cambio studioId
  useEffect(() => {
    if (!studioId) return;

    fetch(`/api/studi/${studioId}/moduli`)
      .then(res => {
        if (!res.ok) throw new Error("Errore nella risposta API");
        return res.json();
      })
      .then(data => {
        setForm({
          sister_username: data.sister_username || "",
          sister_password: data.sister_password || "",
          sister_pin: data.sister_pin || ""
        });
      })
      .catch(err => {
        console.error("❌ Errore caricamento moduli:", err.message);
        toast.error("Errore nel caricamento dati studio");
      });
  }, [studioId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const salva = () => {
    if (!studioId) return;

    fetch(`/api/studi/${studioId}/moduli`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    })
      .then(res => {
        if (!res.ok) throw new Error("Errore salvataggio");
        toast.success("✅ Dati salvati correttamente");
      })
      .catch(err => toast.error("Errore: " + err.message));
  };

  if (!studioId) {
    return (
      <div className="p-4">
        {toast.error("⚠️ Seleziona prima uno studio per accedere ai moduli aggiuntivi.")}
        <p className="text-red-600">Studio non selezionato</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Moduli Aggiuntivi dello Studio</h1>

      <Tabs defaultValue="edra" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="edra">Accesso Sister (Edra)</TabsTrigger>
        </TabsList>

        <TabsContent value="edra">
          <div className="space-y-4">
            <div>
              <label className="block font-medium">Nome utente Sister</label>
              <input
                type="text"
                name="sister_username"
                className="border px-2 py-1 rounded w-full"
                value={form.sister_username}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block font-medium">Password Sister</label>
              <input
                type="password"
                name="sister_password"
                className="border px-2 py-1 rounded w-full"
                value={form.sister_password}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block font-medium">PIN Sister</label>
              <input
                type="text"
                name="sister_pin"
                className="border px-2 py-1 rounded w-full"
                value={form.sister_pin}
                onChange={handleChange}
              />
            </div>

            <button
              onClick={salva}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
            >
              Salva impostazioni
            </button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
