import { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function Impostazioni() {
  const storedPrefs = JSON.parse(localStorage.getItem("gridPrefs") || "{}");
  const [theme, setTheme] = useState(storedPrefs.theme || "quartz");
  const [pageSize, setPageSize] = useState(storedPrefs.pageSize || 25);
  const [altRow, setAltRow] = useState(storedPrefs.altRow || "#f9f9f9");
  const [showConfirm, setShowConfirm] = useState(false);

  const [utente, setUtente] = useState<{ nome: string; cognome?: string; email: string } | null>(null);
  const [preferenze, setPreferenze] = useState({ tema: "chiaro", layout_menu: "sidebar" });

  useEffect(() => {
    const localUtente = localStorage.getItem("utente");
    if (localUtente) {
      setUtente(JSON.parse(localUtente));
    }

    fetch("/api/preferenze", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
      .then(res => res.json())
      .then(data => setPreferenze(data))
      .catch(err => console.error("Errore preferenze:", err));
  }, []);

  const salvaPreferenzeUtente = () => {
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
        alert("Preferenze utente salvate");
      })
      .catch(err => alert("Errore: " + err.message));
  };

  const handleReset = () => {
    const defaults = { theme: "quartz", pageSize: 25, altRow: "#f9f9f9" };
    setTheme(defaults.theme);
    setPageSize(defaults.pageSize);
    setAltRow(defaults.altRow);
    localStorage.setItem("gridPrefs", JSON.stringify(defaults));
  };

  const handleSave = () => {
    const prefs = { theme, pageSize, altRow };
    localStorage.setItem("gridPrefs", JSON.stringify(prefs));
    window.location.href = "/dashboard";
  };

  const nomeCompleto = [utente?.nome, utente?.cognome].filter(Boolean).join(" ");

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Impostazioni</h1>

      <Tabs defaultValue="utente" className="space-y-4">
        <TabsList>
          <TabsTrigger value="generali">Impostazioni Generali</TabsTrigger>
          <TabsTrigger value="utente">Impostazioni Utente</TabsTrigger>
        </TabsList>

        <TabsContent value="utente">
          <h2 className="text-lg font-semibold mb-2">Impostazioni Utente</h2>

          <Tabs defaultValue="personali" className="space-y-4">
            <TabsList>
              <TabsTrigger value="personali">Dati personali</TabsTrigger>
              <TabsTrigger value="preferenze">Preferenze UI</TabsTrigger>
              <TabsTrigger value="griglia">Preferenze Griglia</TabsTrigger>
              <TabsTrigger value="sicurezza">Sicurezza</TabsTrigger>
            </TabsList>

            <TabsContent value="personali">
              <div className="space-y-4">
                <p><strong>Nome:</strong> {nomeCompleto || "..."}</p>
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
                  onClick={salvaPreferenzeUtente}
                  className="mt-4 px-4 py-2 bg-green-600 text-white rounded"
                >
                  Salva modifiche
                </button>
              </div>
            </TabsContent>

            <TabsContent value="griglia">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tema griglia preferito</label>
                  <select
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                    className="border p-2 rounded w-full max-w-xs"
                  >
                    <option value="quartz">Quartz</option>
                    <option value="alpine">Alpine</option>
                    <option value="balham">Balham</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Colore righe alternate</label>
                  <input
                    type="color"
                    value={altRow}
                    onChange={(e) => setAltRow(e.target.value)}
                    className="h-10 w-20 border p-1 rounded"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Numero righe per pagina</label>
                  <select
                    value={pageSize}
                    onChange={(e) => setPageSize(parseInt(e.target.value))}
                    className="border p-2 rounded w-full max-w-xs"
                  >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                </div>

                <div className="pt-4 flex gap-4">
                  <button
                    onClick={handleReset}
                    className="text-sm text-red-600 hover:underline"
                  >
                    Ripristina impostazioni predefinite
                  </button>

                  <button
                    onClick={() => setShowConfirm(true)}
                    className="text-sm bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Salva ed esci
                  </button>
                </div>
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
        </TabsContent>

        <TabsContent value="generali">
          <p className="text-sm text-gray-500">Integrazione futura con impostazioni generali...</p>
        </TabsContent>
      </Tabs>

      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg space-y-4 w-full max-w-sm">
            <h3 className="text-lg font-semibold text-gray-800">Confermi le modifiche?</h3>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100"
              >
                No
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Sì, conferma
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}