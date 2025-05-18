import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "react-toastify";

// ✅ Recupera token da localStorage
const getToken = (): string | null => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.warn("⚠️ Nessun token trovato nella chiave 'token' di localStorage");
    return null;
  }
  console.log("🎯 Token recuperato:", token);
  return token;
};

interface Condominio {
  id: string;
  denominazione: string;
}

interface ModaleAssegnaCondominiProps {
  open: boolean;
  onClose: () => void;
  idUtenteStudio: string;
  idStudio: string;
}

export default function ModaleAssegnaCondomini({
  open,
  onClose,
  idUtenteStudio,
  idStudio
}: ModaleAssegnaCondominiProps) {
  const [condomini, setCondomini] = useState<Condominio[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    if (!open || !idStudio || !idUtenteStudio) return;

    const fetchData = async () => {
      try {
        const token = getToken();
        if (!token) return;

       const res = await fetch(
  `/api/condomini/studio?studio_id=${idStudio}&utente_studio_id=${idUtenteStudio}`,
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);
const data = await res.json();

if (!Array.isArray(data.condomini)) {
  console.error("Dati non validi:", data);
  setCondomini([]);
  return;
}

setCondomini(data.condomini);
setSelectedIds(data.assegnati || []);

      } catch (err) {
        console.error("Errore durante il caricamento dati:", err);
      }
    };

    fetchData();
  }, [open, idStudio, idUtenteStudio]);

  const toggleSelection = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleSalva = async () => {
    try {
      const token = getToken();
      if (!token) return;

      const res = await fetch(`/api/utenti-studio/${idUtenteStudio}/condomini`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ condomini_ids: selectedIds })
      });

      if (!res.ok) throw new Error();

      toast.success("Condomìni assegnati con successo", { autoClose: 2000 });
      onClose();
    } catch (err) {
      toast.error("Errore salvataggio condomìni", { autoClose: 4000 });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assegna condomìni</DialogTitle>
          <DialogDescription>
            Seleziona i condomìni da abbinare all’utente selezionato. Puoi modificare i collegamenti attivi in qualsiasi momento.
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-2 mb-2">
  <Button
    variant="outline"
    onClick={() => setSelectedIds(condomini.map(c => c.id))}
  >
    Seleziona tutto
  </Button>
  <Button
    variant="outline"
    onClick={() => setSelectedIds([])}
  >
    Deseleziona tutto
  </Button>
  <Button
    variant="outline"
    onClick={() =>
      setSelectedIds(prev =>
        condomini.map(c => c.id).filter(id => !prev.includes(id))
      )
    }
  >
    Inverti selezione
  </Button>
</div>

        
        <div className="max-h-64 overflow-y-auto space-y-2">
          {condomini.map(c => (
            <div key={c.id} className="flex items-center space-x-2">
              <Checkbox
                id={`cond-${c.id}`}
                checked={selectedIds.includes(c.id)}
                onCheckedChange={() => toggleSelection(c.id)}
              />
              <label htmlFor={`cond-${c.id}`} className="text-sm">
                {c.denominazione}
              </label>
            </div>
          ))}
        </div>

        <DialogFooter className="mt-4">
          <Button variant="secondary" onClick={onClose}>Annulla</Button>
          <Button onClick={handleSalva}>Salva</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
