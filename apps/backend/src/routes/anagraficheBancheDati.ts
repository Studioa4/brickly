
import express from "express";
import { supabaseBancheDati } from "../supabaseClient";

const router = express.Router();

router.post("/anagrafiche/banche-dati", async (req, res) => {
  const { codice_fiscale, nome, cognome } = req.body;

  const { error } = await supabaseBancheDati
    .from("anagrafiche")
    .insert([{ codice_fiscale, nome, cognome }]);

  if (error) {
    console.error("Errore inserimento BD:", error);
    return res.status(500).json({ errore: "Errore salvataggio banche_dati" });
  }

  res.json({ successo: true });
});

export default router;
