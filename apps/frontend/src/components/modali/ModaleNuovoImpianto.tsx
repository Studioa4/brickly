import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface Props {
  open: boolean;
  onClose: () => void;
  condominioId: string;
}

export default function ModaleNuovoImpianto({ open, onClose, condominioId }: Props) {
  const [partiComuni, setPartiComuni] = useState([]);
  const [form, setForm] = useState({
    struttura_id: "",
    tipo: "",
    descrizione: "",
    marca_modello: "",
    anno_installazione: "",
    manutenzione: "",
    fornitore_nome: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const fetchPartiComuni = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(`/api/parti-comuni?condominio_id=${condominioId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    setPartiComuni(data || []);
  console.log("📦 Parti comuni caricate:", data);

  };

useEffect(() => {
  if (open && condominioId) {
    fetchPartiComuni();
  }
}, [open, condominioId]);


  const handleSubmit = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch("/api/impianti", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...form,
        condominio_id: condominioId,
        anno_installazione: form.anno_installazione ? parseInt(form.anno_installazione) : null,
      }),
    });

    if (res.ok) {
      toast.success("Impianto aggiunto.");
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
          <DialogTitle>Nuovo Impianto</DialogTitle>
        </DialogHeader>

        <select
          name="struttura_id"
          value={form.struttura_id}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value="">-- Seleziona parte comune --</option>
          {partiComuni.map((pc: any) => (
            <option key={pc.id} value={pc.id}>
              {pc.nome} ({pc.tipologia})
            </option>
          ))}
        </select>

        <input
          name="tipo"
          placeholder="Tipo (es. Ascensore, Cancello)"
          value={form.tipo}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <textarea
          name="descrizione"
          placeholder="Descrizione"
          value={form.descrizione}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <input
          name="marca_modello"
          placeholder="Marca/Modello"
          value={form.marca_modello}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <input
          name="anno_installazione"
          type="number"
          placeholder="Anno installazione"
          value={form.anno_installazione}
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
