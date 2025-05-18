import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ImpostazioniUtente() {
  const [utente, setUtente] = useState<{ nome: string; email: string } | null>(null);
  const [preferenze, setPreferenze] = useState({ tema: "chiaro", layout_menu: "sidebar" });

  useEffect(() => {
    fetch("/api/me", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
      .then(res => res.json())
      .then(data => setUtente(data))
      .catch(err => console.error("Errore nel caricamento dati utente:", err));

    fetch("/api/preferenze", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
      .then(res => res.json())
      .then(data => setPreferenze(data))
      .catch(err => console.error("Errore preferenze:", err));
  }, []);

  const salvaPreferenze = () => {
    fetch("/api/preferenze", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify(preferenze)
    })
      .then(res => {
        if (!res.ok) throw new Error("Errore salvataggio");
        alert("Preferenze salvate");
      })
      .catch(err => alert("Errore: " + err.message));
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Impostazioni utente</h1>

      <Tabs defaultValue="personali" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="personali">Dati personali</TabsTrigger>
          <TabsTrigger value="preferenze">Preferenze</TabsTrigger>
          <TabsTrigger value="sicurezza">Account & Sicurezza</TabsTrigger>
        </TabsList>

        <TabsContent value="personali">
          <div className="space-y-4">
            <p><strong>Nome:</strong> {utente?.nome || "..."}</p>
            <p><strong>Email:</strong> {utente?.email || "..."}</p>
            <button className="px-4 py-2 bg-blue-600 text-white rounded">Cambia password</button>
          </div>
        </TabsContent>

        <TabsContent value="preferenze">
          <div className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">Tema</label>
              <select
                className="border rounded px-2 py-1"
                value={preferenze.tema}
                onChange={e => setPreferenze({ ...preferenze, tema: e.target.value })}
              >
                <option value="chiaro">Chiaro</option>
                <option value="scuro">Scuro</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 font-medium">Layout menu</label>
              <select
                className="border rounded px-2 py-1"
                value={preferenze.layout_menu}
                onChange={e => setPreferenze({ ...preferenze, layout_menu: e.target.value })}
              >
                <option value="sidebar">Sidebar</option>
                <option value="windows">Classico stile Windows</option>
              </select>
            </div>

            <button
              onClick={salvaPreferenze}
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded"
            >
              Salva modifiche
            </button>
          </div>
        </TabsContent>

        <TabsContent value="sicurezza">
          <div className="space-y-2">
            <p><strong>Ultimo accesso:</strong> 06/05/2025 08:03</p>
            <p><strong>IP:</strong> 192.168.1.100</p>
            <button className="px-4 py-2 bg-red-500 text-white rounded">
              Esci da tutti i dispositivi
            </button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
