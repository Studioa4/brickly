import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "react-toastify";

// ✅ Funzione per recuperare il token dinamico Supabase
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

        const resCondomini = await fetch(`/api/condomini?studio_id=${idStudio}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const dataCondomini = await resCondomini.json();

        if (!Array.isArray(dataCondomini)) {
          console.error("Dati non validi:", dataCondomini);
          setCondomini([]);
          return;
        }

        setCondomini(dataCondomini);

        const resAssegnati = await fetch(`/api/utenti-studio/${idUtenteStudio}/condomini`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const dataAssegnati = await resAssegnati.json();
        setSelectedIds(Array.isArray(dataAssegnati) ? dataAssegnati : []);
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

      toast.success("Condomìni assegnati con successo");
      onClose();
    } catch (err) {
      toast.error("Errore salvataggio condomìni");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assegna condomìni</DialogTitle>
        </DialogHeader>

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
