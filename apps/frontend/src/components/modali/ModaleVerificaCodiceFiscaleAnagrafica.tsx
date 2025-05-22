import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { isCodiceFiscaleValido } from "@/utils/isCodiceFiscaleValido";
import { decodeCodiceFiscale } from "@/utils/decodeCodiceFiscale";
import { isCodiceFiscaleNumericoValido } from "@/utils/isCodiceFiscaleNumericoValido";

export default function ModaleVerificaCodiceFiscaleAnagrafica({
  open,
  onSuccess,
  onClose,
}: {
  open: boolean;
  onSuccess: (cf: string, decoded: any, tipo: "fisica" | "giuridica") => void;
  onClose: () => void;
}) {
  const [cf, setCf] = useState("");
  const [tipo, setTipo] = useState<"fisica" | "giuridica">("fisica");
  const [loading, setLoading] = useState(false);
  const [decoded, setDecoded] = useState<any>(null);
  const [esiste, setEsiste] = useState<boolean | null>(null);

  useEffect(() => {
    if (!open) {
      setCf("");
      setDecoded(null);
      setEsiste(null);
      setTipo("fisica");
    }
  }, [open]);

  useEffect(() => {
    const eseguiVerifica = async () => {
      if ((tipo === "fisica" && cf.length !== 16) || (tipo === "giuridica" && cf.length !== 11)) return;

      if (tipo === "fisica") {
        if (!isCodiceFiscaleValido(cf)) {
          toast.error("Codice fiscale non valido (errore nel carattere di controllo)");
          return;
        }
        setLoading(true);
        const result = await decodeCodiceFiscale(cf);
        if (!result) {
          toast.error("Errore nella decodifica del codice fiscale");
          setLoading(false);
          return;
        }
        setDecoded(result);
      } else {
        if (!isCodiceFiscaleNumericoValido(cf)) {
          toast.error("Codice fiscale numerico non valido");
          return;
        }
        setDecoded(null);
      }

      try {
        const res = await fetch(`/api/anagrafiche-banche-dati/check-cf?cf=${cf}`);
        const json = await res.json();
        setEsiste(json.exists);

        if (json.exists) {
          toast.error("❌ Codice fiscale già presente in archivio");
        } else {
          toast.success("✔️ Codice valido e non presente. Pronto a creare l'anagrafica.");
        }
      } catch (err) {
        toast.error("Errore nella verifica dell'esistenza");
      } finally {
        setLoading(false);
      }
    };

    eseguiVerifica();
  }, [cf, tipo]);

  const conferma = () => {
    console.log("💥 conferma: cf =", cf, "decoded =", decoded, "tipo =", tipo);
    if (esiste || !cf.trim()) return;
    onSuccess(cf.trim(), decoded, tipo);
  };

  return (
    <Dialog open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Verifica Codice Fiscale</DialogTitle>
        </DialogHeader>

        <div className="flex items-center gap-4 mb-4">
          <label>
            <input
              type="radio"
              name="tipo"
              value="fisica"
              checked={tipo === "fisica"}
              onChange={() => setTipo("fisica")}
            />
            <span className="ml-1">Persona fisica</span>
          </label>
          <label>
            <input
              type="radio"
              name="tipo"
              value="giuridica"
              checked={tipo === "giuridica"}
              onChange={() => setTipo("giuridica")}
            />
            <span className="ml-1">Persona giuridica</span>
          </label>
        </div>

        <input
          type="text"
          value={cf}
          onChange={(e) => setCf(e.target.value.toUpperCase())}
          maxLength={tipo === "fisica" ? 16 : 11}
          placeholder={tipo === "fisica" ? "Codice fiscale (16 caratteri)" : "Codice fiscale (11 cifre)"}
          className="w-full border p-2 rounded text-center text-lg tracking-wide"
        />

        {!esiste && decoded && tipo === "fisica" && (
          <div className="mt-4 bg-green-50 p-3 rounded border text-sm space-y-2">
            <p><strong>Codice fiscale valido.</strong> Vuoi procedere a creare l'anagrafica?</p>
            <ul className="ml-4 list-disc">
              <li>Data nascita: {decoded.giorno}/{decoded.mese}/{decoded.anno}</li>
              <li>Sesso: {decoded.sesso}</li>
              <li>Luogo: {decoded.luogo_nascita} ({decoded.provincia})</li>
              <li>Nazione: {decoded.nazione}</li>
            </ul>
            <div className="mt-2">
              <Button onClick={conferma}>✅ Sì, continua</Button>
            </div>
          </div>
        )}

        {!esiste && tipo === "giuridica" && cf.length === 11 && isCodiceFiscaleNumericoValido(cf) && (
          <div className="mt-4 bg-green-50 p-3 rounded border text-sm">
            <p><strong>Codice fiscale valido.</strong> Vuoi procedere a creare l'anagrafica?</p>
            <div className="mt-2">
              <Button onClick={conferma}>✅ Sì, continua</Button>
            </div>
          </div>
        )}

        {esiste && (
          <div className="mt-4 bg-yellow-100 p-3 rounded border text-sm">
            Questo codice fiscale risulta già presente in archivio. Non è possibile procedere.
          </div>
        )}

        <DialogFooter className="mt-4">
          <Button variant="secondary" onClick={onClose} disabled={loading}>Annulla</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
