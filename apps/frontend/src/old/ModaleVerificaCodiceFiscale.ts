import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import comuni from "@/data/comuni_istat.json"; // Dizionario ISTAT con codici catastali

export default function ModaleVerificaCodiceFiscale({ open, onSuccess, onClose }: {
  open: boolean;
  onSuccess: (cf: string, decoded: any) => void;
  onClose: () => void;
}) {
  const [cf, setCf] = useState("");
  const [verificato, setVerificato] = useState(false);

  const mesi: { [key: string]: string } = {
    A: "01", B: "02", C: "03", D: "04", E: "05", F: "06",
    G: "07", H: "08", I: "09", J: "10", K: "11", L: "12"
  };

  const decodeCF = (cf: string) => {
    const anno = parseInt(cf.slice(6, 8), 10);
    const mese = mesi[cf[8]];
    let giorno = parseInt(cf.slice(9, 11), 10);
    const sesso = giorno > 40 ? "F" : "M";
    if (giorno > 40) giorno -= 40;
    const codiceComune = cf.slice(11, 15);
    const comuneInfo = comuni[codiceComune];

    return {
      sesso,
      giorno: giorno.toString().padStart(2, "0"),
      mese,
      anno: (anno >= 0 && anno <= 24 ? "20" : "19") + anno.toString().padStart(2, "0"),
      luogo_nascita: comuneInfo?.nome || "Comune sconosciuto",
      provincia: comuneInfo?.provincia || "",
      nazione: comuneInfo?.nazione || "Italia",
    };
  };

  useEffect(() => {
    if (cf.length === 16) {
      const regexCF = /^[A-Z]{6}[0-9]{2}[A-Z][0-9]{2}[A-Z][0-9]{3}[A-Z]$/;
      if (!regexCF.test(cf)) {
        toast.error("Codice fiscale non valido");
        setVerificato(false);
        return;
      }
      const dati = decodeCF(cf);
      setVerificato(true);
      toast.success("Codice fiscale valido. Procedi con inserimento anagrafica");
      setTimeout(() => onSuccess(cf, dati), 300);
    }
  }, [cf]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Verifica Codice Fiscale</DialogTitle>
        </DialogHeader>

        <input
          type="text"
          value={cf}
          onChange={(e) => setCf(e.target.value.toUpperCase())}
          maxLength={16}
          placeholder="Inserisci codice fiscale"
          className="w-full border p-2 rounded text-center text-lg tracking-wide"
        />

        <DialogFooter>
          <Button onClick={onClose} variant="ghost">Annulla</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
