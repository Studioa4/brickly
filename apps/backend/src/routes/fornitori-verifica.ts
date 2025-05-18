import express from "express";
import { createClient } from "@supabase/supabase-js";
import { cercaFornitoreDaWeb } from "../utils/cercaFornitoreDaWeb";

const router = express.Router();

const supabase = createClient(
  process.env.SUPABASE_BD_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// POST /api/fornitori/verifica-tutti
router.post("/verifica-tutti", async (req, res) => {
  const { data, error } = await supabase
    .from("fornitori")
    .select("id, partita_iva, ragione_sociale, codice_fiscale, indirizzo, cap, citta, provincia, pec");

  if (error) {
    console.error("Errore Supabase:", error.message);
    return res.status(500).json({ error: "Errore nel recupero fornitori" });
  }

  const modifiche = [];

  for (const fornitore of data || []) {
    const web = await cercaFornitoreDaWeb(fornitore.partita_iva);
    if (!web) continue;

    const diff: any = { id: fornitore.id, partita_iva: fornitore.partita_iva, modifiche: {} };

    for (const key of ["ragione_sociale", "codice_fiscale", "indirizzo", "cap", "citta", "provincia", "pec"]) {
      const locale = (fornitore as any)[key]?.trim() || "";
      const remoto = (web as any)[key]?.trim() || "";
      if (locale !== remoto) {
        diff.modifiche[key] = { vecchio: locale, nuovo: remoto };
      }
    }

    if (Object.keys(diff.modifiche).length > 0) {
      modifiche.push(diff);
    }
  }

  res.json({ modifiche });
});

export default router;