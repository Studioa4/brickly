
import express from "express";
import { supabaseOperativo } from "../supabaseClient";

const router = express.Router();

router.post("/anagrafiche/operativo", async (req, res) => {
  const { codice_fiscale, nome, cognome, alias_nome, email, studio_id } = req.body;

  const { error: insertError } = await supabaseOperativo
    .from("anagrafiche")
    .insert([{ codice_fiscale, nome, cognome, alias_nome, email, studio_id }]);

  if (insertError) {
    console.error("Errore inserimento operativo:", insertError);
    return res.status(500).json({ errore: "Errore salvataggio anagrafica operativo" });
  }

  const { data, error: selectError } = await supabaseOperativo
    .from("anagrafiche")
    .select("id")
    .eq("codice_fiscale", codice_fiscale)
    .maybeSingle();

  if (selectError || !data) {
    console.error("Errore recupero ID anagrafica:", selectError);
    return res.status(500).json({ errore: "Impossibile recuperare ID anagrafica" });
  }

  res.json({ successo: true, id_utente: data.id });
});

export default router;
