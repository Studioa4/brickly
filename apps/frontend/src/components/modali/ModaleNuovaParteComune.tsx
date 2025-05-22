import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "react-toastify";

interface Props {
  open: boolean;
  onClose: () => void;
  condominioId: string;
}

export default function ModaleNuovaParteComune({ open, onClose, condominioId }: Props) {
  const [form, setForm] = useState({
    nome: "",
    tipologia: "",
    note: "",
  });

  const tipologieDisponibili = [
  "Cortile",
  "Edificio",
  "Giardino",
  "Lastrico solare",
  "Parcheggio",
  "Portineria",
  "Scala",
];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch("/api/parti-comuni", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...form,
        condominio_id: condominioId,
      }),
    });

    if (res.ok) {
      toast.success("Parte comune aggiunta.");
      onClose();
    } else {
      const msg = await res.text();
      toast.error("Errore nel salvataggio: " + msg);
    }
  };

  return open ? (
<Dialog open={open} onOpenChange={onClose}>
  <DialogContent className="space-y-3">
    <DialogHeader>
      <DialogTitle>Nuova Parte Comune</DialogTitle>
    </DialogHeader>

    <input
      name="nome"
      placeholder="Nome (es. Scala A)"
      value={form.nome}
      onChange={handleChange}
      className="w-full border p-2 rounded"
    />

    <select
      name="tipologia"
      value={form.tipologia}
      onChange={handleChange}
      className="w-full border p-2 rounded"
    >
      <option value="">-- Seleziona tipologia --</option>
      {[
        "Cortile",
        "Corsello cantine",
        "Corsello carraio",
        "Edificio",
        "Giardino",
        "Interrato",
        "Lastrico solare",
        "Parcheggio",
        "Portineria",
        "Scala",
        "Tetto",
      ].map((tipo) => (
        <option key={tipo} value={tipo}>
          {tipo}
        </option>
      ))}
    </select>

    <textarea
      name="descrizione"
      placeholder="Descrizione"
      value={form.descrizione}
      onChange={handleChange}
      className="w-full border p-2 rounded"
    />

    <textarea
      name="note"
      placeholder="Note (facoltative)"
      value={form.note}
      onChange={handleChange}
      className="w-full border p-2 rounded"
    />

    <DialogFooter>
      <Button onClick={handleSubmit}>Salva</Button>
      <Button variant="outline" onClick={onClose}>Annulla</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>

  ) : null;
}
