import { Router } from "express";
import { supabaseBancheDati } from "../supabaseClient";

const router = Router();

// GET tutte le anagrafiche
router.get("/", async (req, res) => {
  const { data, error } = await supabaseBancheDati
    .from("anagrafiche")
    .select("id, codice_fiscale, nome, cognome, ragione_sociale, tipo_persona");

  if (error) return res.status(500).json({ error: error.message });

  res.json(data);
});

// POST nuova anagrafica
router.post("/", async (req, res) => {
  const { codice_fiscale, tipo_persona, nome, cognome, ragione_sociale } = req.body;

  if (!codice_fiscale || !tipo_persona) {
    return res.status(400).json({ error: "codice_fiscale e tipo_persona sono obbligatori" });
  }

  if (tipo_persona === "fisica" && (!nome || !cognome)) {
    return res.status(400).json({ error: "nome e cognome sono obbligatori per persone fisiche" });
  }

  if (tipo_persona === "giuridica" && !ragione_sociale) {
    return res.status(400).json({ error: "ragione_sociale è obbligatoria per persone giuridiche" });
  }

  const { data, error } = await supabaseBancheDati.from("anagrafiche").insert([
    {
      codice_fiscale,
      tipo_persona,
      nome: tipo_persona === "fisica" ? nome : null,
      cognome: tipo_persona === "fisica" ? cognome : null,
      ragione_sociale: tipo_persona === "giuridica" ? ragione_sociale : null,
    },
  ]);

  if (error) return res.status(500).json({ error: error.message });

  res.json({ success: true, data });
});

export default router;
