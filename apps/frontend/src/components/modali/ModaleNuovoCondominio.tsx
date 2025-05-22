import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import GoogleIndirizzoFinder from "@/components/shared/GoogleIndirizzoFinder";
import SelectNazioni from "@/components/shared/SelectNazioni";
import SelectProvince from "@/components/shared/SelectProvince";

export default function ModaleNuovoCondominio({ open, onClose, idStudio, codiceFiscalePreinserito }) {

  const [form, setForm] = useState({
    tipologia: "Condominio",
    denominazione: "",
    alias: "",
    indirizzo: "",
    cap: "",
    comune: "",
    provincia: "",
    stato: "",
    codice_fiscale: "",
    latitudine: null,
    longitudine: null,
  });

  useEffect(() => {
  if (codiceFiscalePreinserito) {
    setForm((prev) => ({
      ...prev,
      codice_fiscale: codiceFiscalePreinserito,
    }));
  }
}, [codiceFiscalePreinserito]);

  const [showFinder, setShowFinder] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };
  console.log("✅ Pagina DatiGeneraliCondominio caricata");

  const handleSalva = async () => {
  const token = localStorage.getItem("token");
  const utente = JSON.parse(localStorage.getItem("utente"));
  const email = utente?.email;

  if (!token || !email) return toast.error("Autenticazione mancante");

  const res = await fetch("/api/condomini/nuovo", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...form, id_studio: idStudio }),
  });

  const json = await res.json();

  if (!res.ok) {
    return toast.error("Errore: " + (json?.error || "Creazione fallita"));
  }

  console.log("✅ Condominio creato:", json.condominio);

  // 🔗 Assegna il condominio all’utente
  const assegnazione = await fetch("/api/condomini/assegna", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id_condominio: json.condominio.id,
      id_studio: idStudio,
      email,
    }),
  });

  if (!assegnazione.ok) {
    const err = await assegnazione.json();
    console.warn("⚠️ Assegnazione fallita:", err);
    toast.warning("Condominio creato, ma non assegnato");
  } else {
    toast.success("Condominio creato e assegnato");
  }

  onClose(true);
};



  const handleReset = () => {
    setForm({
      tipologia: "Condominio",
      denominazione: "",
      alias: "",
      indirizzo: "",
      cap: "",
      comune: "",
      provincia: "",
      stato: "",
      codice_fiscale: "",
      latitudine: null,
      longitudine: null,
    });
    onClose(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={() => onClose(false)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>➕ Nuovo Condominio</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-3 gap-4">
        <input
          name="codice_fiscale"
          placeholder="Codice Fiscale"
          value={form.codice_fiscale}
          readOnly
          className="border rounded p-2 w-full bg-gray-100 text-gray-600 cursor-not-allowed"
          />
            
            <select
              name="tipologia"
              value={form.tipologia}
              onChange={handleChange}
              autoFocus // 👈 questo forza il focus qui
              className="border p-2 rounded col-span-2"
            >
              <option value="Condominio">Condominio</option>
              <option value="Casa">Casa</option>
              <option value="Centro Commerciale">Centro Commerciale</option>
              <option value="Residence">Residence</option>
              <option value="Residenza">Residenza</option>
              <option value="Supercondominio">Supercondominio</option>
            </select>

            <input
              name="denominazione"
              placeholder="Denominazione"
              value={form.denominazione}
              onChange={handleChange}
              className="border p-2 rounded col-span-3"
            />
            <input
              name="alias"
              placeholder="Alias (opzionale)"
              value={form.alias}
              onChange={handleChange}
              className="border p-2 rounded col-span-3"
            />

            <input
              name="indirizzo"
              placeholder="Indirizzo"
              value={form.indirizzo}
              onChange={handleChange}
              className="border p-2 rounded col-span-3"
            />

            <Button
              variant="outline"
              className="col-span-3"
              onClick={() => setShowFinder(true)}
            >
              📍 Cerca con Google Maps
            </Button>

            <input
              name="cap"
              placeholder="CAP"
              value={form.cap}
              onChange={handleChange}
              className="border p-2 rounded col-span-1"
            />
            <input
              name="comune"
              placeholder="Comune"
              value={form.comune}
              onChange={handleChange}
              className="border p-2 rounded col-span-1"
            />
            <SelectProvince
              value={form.provincia}
              onChange={(val) =>
                setForm((prev) => ({ ...prev, provincia: val }))
              }
            />
            <SelectNazioni
              value={form.stato}
              onChange={(val) =>
                setForm((prev) => ({
                  ...prev,
                  stato: val,
                  provincia: val.toLowerCase() === "italia" ? prev.provincia : "EE",
                }))
              }
            />
          </div>

          <DialogFooter className="mt-4">
            <Button variant="secondary" onClick={handleReset}>
              Annulla
            </Button>
            <Button onClick={handleSalva}>Salva</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <GoogleIndirizzoFinder
        open={showFinder}
        onClose={() => setShowFinder(false)}
        onConferma={(dati) => {
          setShowFinder(false);

          const indirizzoPulito = dati.indirizzo
            .replace(dati.cap, "")
            .replace(dati.comune, "")
            .replace(dati.provincia, "")
            .replace(dati.stato || "", "")
            .replace(/,\s*,*/g, "")
            .trim();

          setForm((prev) => ({
            ...prev,
            indirizzo: indirizzoPulito,
            cap: dati.cap,
            comune: dati.comune,
            provincia: dati.provincia,
            stato: dati.stato || "",
            latitudine: dati.latitudine,
            longitudine: dati.longitudine,
          }));
        }}
      />
    </>
  );
}
