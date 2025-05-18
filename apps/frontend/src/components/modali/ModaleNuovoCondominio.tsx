import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import GoogleIndirizzoFinder from "@/components/shared/GoogleIndirizzoFinder";

export default function ModaleNuovoCondominio({ open, onClose, idStudio }) {
  const [form, setForm] = useState({
    tipologia: "Condominio",
    denominazione: "",
    alias: "",
    indirizzo: "",
    cap: "",
    comune: "",
    provincia: "",
    codice_fiscale: "",
    latitudine: null,
    longitudine: null,
  });

  const [showFinder, setShowFinder] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSalva = async () => {
    const token = localStorage.getItem("token");
    if (!token) return toast.error("Token mancante");

    const res = await fetch("/api/condomini/nuovo", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...form, id_studio: idStudio }),
    });

    if (res.ok) {
      toast.success("Condominio creato");
      onClose(true);
    } else {
      const err = await res.json();
      toast.error("Errore: " + (err?.error || "creazione fallita"));
    }
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
              maxLength={11}
              value={form.codice_fiscale}
              onChange={(e) => {
                const soloNumeri = e.target.value.replace(/\D/g, "");
                setForm((prev) => ({
                  ...prev,
                  codice_fiscale: soloNumeri.slice(0, 11),
                }));
              }}
              className="border p-2 rounded col-span-2"
            />
            <select
              name="tipologia"
              value={form.tipologia}
              onChange={handleChange}
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
              Cerca con Google Maps
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
            <input
              name="provincia"
              placeholder="Provincia"
              value={form.provincia}
              onChange={handleChange}
              className="border p-2 rounded col-span-1"
            />

          </div>

          <DialogFooter className="mt-4">
            <Button variant="secondary" onClick={() => onClose(false)}>
              Annulla
            </Button>
            <Button onClick={handleSalva}>Salva</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Finder esterno */}
      <GoogleIndirizzoFinder
        open={showFinder}
        onClose={() => setShowFinder(false)}
        onConferma={(dati) => {
          setShowFinder(false);
          setForm((prev) => ({
            ...prev,
            indirizzo: dati.indirizzo,
            cap: dati.cap,
            comune: dati.comune,
            provincia: dati.provincia,
            latitudine: dati.latitudine,
            longitudine: dati.longitudine,
          }));
        }}
      />
    </>
  );
}
