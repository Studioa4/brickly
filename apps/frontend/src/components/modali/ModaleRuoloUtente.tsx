import React, { useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "react-toastify";

interface ModaleRuoloUtenteProps {
  open: boolean;
  onClose: () => void;
  idUtenteStudio: string;
  ruoloAttuale?: number;
}

export default function ModaleRuoloUtente({ open, onClose, idUtenteStudio, ruoloAttuale }: ModaleRuoloUtenteProps) {
  const [ruoloId, setRuoloId] = useState<number | undefined>(ruoloAttuale);

  const handleSalva = async () => {
    if (!ruoloId) return toast.error("Seleziona un livello");

    try {
      const res = await fetch(`/api/utenti-studio/${idUtenteStudio}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ruolo_id: ruoloId })
      });

      if (!res.ok) throw new Error();

      toast.success("Livello aggiornato");
      onClose();
    } catch (err) {
      toast.error("Errore salvataggio ruolo");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <div className="p-4 space-y-4">
        <h2 className="text-xl font-semibold">Definisci livello utente</h2>

        <Select onValueChange={value => setRuoloId(Number(value))} defaultValue={ruoloAttuale?.toString() || ""}>
          <SelectTrigger>
            <SelectValue placeholder="Seleziona livello" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">1 - Solo visualizzazione</SelectItem>
            <SelectItem value="2">2 - Può caricare movimenti</SelectItem>
            <SelectItem value="3">3 - Può modificare movimenti</SelectItem>
            <SelectItem value="4">4 - Può eliminare movimenti</SelectItem>
            <SelectItem value="5">5 - Gestisce apertura/chiusura esercizi</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex justify-end space-x-2">
          <Button variant="secondary" onClick={onClose}>Annulla</Button>
          <Button onClick={handleSalva}>Salva</Button>
        </div>
      </div>
    </Dialog>
  );
}
