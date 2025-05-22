import { Router } from "express";
import { supabaseBancheDati } from "../supabaseClient";

const router = Router();

router.get("/", async (req, res) => {
  const codice = req.query.codice;

  if (!codice || typeof codice !== "string") {
    return res.status(400).json({ error: "Parametro 'codice' mancante o non valido" });
  }

  // 🔍 Prova ricerca tra comuni
  const { data: comuni, error: errComune } = await supabaseBancheDati
    .from("comuni")
    .select("nome_comune, provincia_id")
    .eq("codice_catastale", codice.toUpperCase());

  if (comuni && comuni.length > 0) {
    const comune = comuni[0];

    // Cerca la sigla della provincia
    let siglaProvincia = "";
    if (comune.provincia_id) {
      const { data: province } = await supabaseBancheDati
        .from("province")
        .select("sigla")
        .eq("id", comune.provincia_id);
      if (province && province.length > 0) {
        siglaProvincia = province[0].sigla;
      }
    }

    return res.json({
      luogo_nascita: comune.nome_comune,
      provincia: siglaProvincia,
      nazione: "Italia",
    });
  }

  // 🔍 Altrimenti cerca tra stati esteri
  const { data: stato, error: errStato } = await supabaseBancheDati
    .from("stati_esteri")
    .select("nazione")
    .eq("codice", codice.toUpperCase())
    .maybeSingle();

  if (stato) {
    return res.json({
      luogo_nascita: stato.nazione,
      provincia: "",
      nazione: stato.nazione,
    });
  }

  return res.status(404).json({ error: "Codice catastale non trovato" });
});

export default router;
