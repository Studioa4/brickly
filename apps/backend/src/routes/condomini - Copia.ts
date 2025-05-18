import express from "express";
import jwt from "jsonwebtoken";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

// 🔐 Route 1: protetta con JWT - /api/condomini?studio_id=...
router.get("/", async (req, res) => {
  const studioId = req.query.studio_id as string;
  const auth = req.headers.authorization;

  if (!studioId || !auth?.startsWith("Bearer ")) {
    return res.status(400).json({ error: "studio_id o token mancante" });
  }

  const token = auth.split(" ")[1];

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: "Token non valido" });
    }

    const codiceFiscale = user.user_metadata?.codice_fiscale;
    if (!codiceFiscale) {
      return res.status(403).json({ error: "Codice fiscale mancante" });
    }

    const { data: tutti } = await supabase
      .from("condomini")
      .select("id, denominazione")
      .eq("id_studio", studioId);

    const { data: autorizzati } = await supabase
      .from("utenti_condomini")
      .select("id_condominio")
      .eq("codice_fiscale_anagrafica", codiceFiscale);

    const idAccesso = autorizzati?.map(r => r.id_condominio);
    const filtrati = tutti?.filter(c => idAccesso?.includes(c.id)) || [];

    return res.json(filtrati);
  } catch (err) {
    console.error("❌ Errore interno:", err);
    return res.status(500).json({ error: "Errore interno del server" });
  }
});

// ✅ Route 2: pubblica - /api/condomini/utente?email=...
router.get("/utente", async (req, res) => {
  const auth = req.headers.authorization;
  const studioId = req.query.studio_id as string;

  if (!auth?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token mancante" });
  }

  if (!studioId) {
    return res.status(400).json({ error: "studio_id mancante" });
  }

  const token = auth.split(" ")[1];

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: "Token non valido" });
    }

    const { data: condomini, error: fetchError } = await supabase
      .from("condomini")
      .select("id, denominazione")
      .eq("id_studio", studioId);

    if (fetchError) {
      console.error("❌ Errore lettura condomini:", fetchError);
      return res.status(500).json({ error: "Errore nel recupero dei condomini" });
    }

    return res.json(condomini || []);
  } catch (err) {
    console.error("❌ Errore interno:", err);
    return res.status(500).json({ error: "Errore interno del server" });
  }
});


export default router;
