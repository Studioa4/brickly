import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

export default function ModaleNuovaAnagrafica({
  open,
  onClose,
  codiceFiscalePreinserito,
  datiDecodificati,
  tipoPersona,
}: {
  open: boolean;
  onClose: () => void;
  codiceFiscalePreinserito: string;
  datiDecodificati?: {
    giorno: string;
    mese: string;
    anno: string;
    sesso: string;
    luogo_nascita: string;
    provincia: string;
    nazione: string;
  };
  tipoPersona: "fisica" | "giuridica";
}) {
  const [form, setForm] = useState({
    codice_fiscale: codiceFiscalePreinserito || "",
    nome: "",
    cognome: "",
    ragione_sociale: "",
  });

  useEffect(() => {
    if (!open) {
      setForm({ codice_fiscale: "", nome: "", cognome: "", ragione_sociale: "" });
    } else {
      setForm(prev => ({
        ...prev,
        codice_fiscale: codiceFiscalePreinserito,
      }));
    }
  }, [open, codiceFiscalePreinserito]);

  const [salvataggioInCorso, setSalvataggioInCorso] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSalva = async () => {
    const payload = {
      codice_fiscale: form.codice_fiscale,
      tipo_persona: tipoPersona,
      nome: tipoPersona === "fisica" ? form.nome : null,
      cognome: tipoPersona === "fisica" ? form.cognome : null,
      ragione_sociale: tipoPersona === "giuridica" ? form.ragione_sociale : null,
    };

    if (!payload.codice_fiscale || !payload.tipo_persona) {
      toast.warn("Codice fiscale e tipo persona sono obbligatori");
      return;
    }

    if (tipoPersona === "fisica" && (!payload.nome || !payload.cognome)) {
      toast.warn("Nome e cognome sono obbligatori");
      return;
    }

    if (tipoPersona === "giuridica" && !payload.ragione_sociale) {
      toast.warn("Ragione sociale obbligatoria per persona giuridica");
      return;
    }

    setSalvataggioInCorso(true);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/anagrafiche-banche-dati", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Errore ${res.status}: ${text}`);
      }

      toast.success("Anagrafica salvata con successo");
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Errore durante il salvataggio");
    } finally {
      setSalvataggioInCorso(false);
    }
  };

  const dataCompleta = datiDecodificati
    ? `${datiDecodificati.giorno}/${datiDecodificati.mese}/${datiDecodificati.anno}`
    : "";

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nuova Anagrafica</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <input
            name="codice_fiscale"
            value={form.codice_fiscale}
            disabled
            className="w-full border p-2 rounded bg-gray-100"
          />

          {tipoPersona === "fisica" && (
            <>
              <input
                name="cognome"
                placeholder="Cognome"
                value={form.cognome}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
              <input
                name="nome"
                placeholder="Nome"
                value={form.nome}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </>
          )}

          {tipoPersona === "giuridica" && (
            <input
              name="ragione_sociale"
              placeholder="Ragione sociale"
              value={form.ragione_sociale}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          )}

          {datiDecodificati && tipoPersona === "fisica" && (
            <div className="text-sm bg-gray-50 border rounded p-3 space-y-1">
              <p><strong>Data di nascita:</strong> {dataCompleta}</p>
              <p><strong>Sesso:</strong> {datiDecodificati.sesso}</p>
              <p><strong>Luogo di nascita:</strong> {datiDecodificati.luogo_nascita}</p>
              <p><strong>Provincia:</strong> {datiDecodificati.provincia || "-"}</p>
              <p><strong>Nazione:</strong> {datiDecodificati.nazione}</p>
            </div>
          )}
        </div>

        <DialogFooter className="mt-4">
          <Button onClick={handleSalva} disabled={salvataggioInCorso}>
            {salvataggioInCorso ? "Salvataggio..." : "Salva"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
