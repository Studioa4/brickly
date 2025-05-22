import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { isCodiceFiscaleNumericoValido } from "@/utils/isCodiceFiscaleNumericoValido";
import { getApiUrl } from "@/utils/api";

export default function ModaleVerificaCodiceFiscale({ open, onClose, onSuccess }) {
  const [cf, setCF] = useState("");
  const [stato, setStato] = useState("idle"); // idle | loading | esistente | nuovo
  const [risultato, setRisultato] = useState(null);

  const handleVerifica = async () => {
    const codice = cf.trim();

    if (!isCodiceFiscaleNumericoValido(codice)) {
      toast.error("Codice fiscale non valido (errore cifra di controllo)");
      return;
    }

    setStato("loading");

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/api/pub/condomini/check-cf?cf=${cf}`);
      const json = await res.json();

      if (json.exists) {
        setStato("esistente");
        setRisultato(json);
      } else {
        setStato("nuovo");
        setRisultato({ cf: codice });
      }
    } catch (err) {
      toast.error("Errore nella verifica");
      setStato("idle");
    }
  };

  const reset = () => {
    setCF("");
    setStato("idle");
    setRisultato(null);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={reset}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>🔎 Verifica codice fiscale</DialogTitle>
          <DialogDescription>
            Inserisci il codice fiscale numerico del condominio (11 cifre).
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <input
            className="border p-2 w-full rounded"
            maxLength={11}
            placeholder="Codice fiscale (11 cifre)"
            value={cf}
            onChange={(e) => {
              const numerico = e.target.value.replace(/\D/g, "").slice(0, 11);
              setCF(numerico);
            }}
          />

          {cf.length === 11 && (
            <p className={`text-sm ${isCodiceFiscaleNumericoValido(cf) ? "text-green-600" : "text-red-600"}`}>
              {isCodiceFiscaleNumericoValido(cf)
                ? "✔️ Codice fiscale valido"
                : "❌ Codice fiscale non valido"}
            </p>
          )}

          <Button onClick={handleVerifica} disabled={stato === "loading"}>
            Verifica
          </Button>

          {stato === "esistente" && (
<div className="text-sm border rounded p-3 bg-yellow-50 space-y-2">
  <p>🔐 Questo codice fiscale è già associato al condominio:</p>
  <p className="ml-2">🏢 <strong>{risultato.nome_condominio}</strong></p>
  <p className="ml-2">📁 Attualmente gestito da: <strong>{risultato.nome_studio}</strong></p>

  <div className="mt-2">
    <Button
      variant="outline"
      onClick={() => {
        toast.info("Richiesta di passaggio di consegne in preparazione...");
        // TODO: qui potrai aprire un modale o fare una fetch futura
      }}
    >
      ✉️ Richiedi passaggio di consegne
    </Button>
  </div>
</div>
          )}

          {stato === "nuovo" && (
            <div className="text-sm border rounded p-3 bg-green-50">
              ✅ Il codice fiscale non risulta associato a nessun condominio.
              <br />
              Vuoi attivare un nuovo condominio?
              <div className="mt-3">
                <Button
                  onClick={() => {
                    onSuccess(risultato.cf);
                    reset();
                  }}
                >
                  Sì, attiva ora
                </Button>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="mt-4">
          <Button variant="secondary" onClick={reset}>
            Annulla
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
