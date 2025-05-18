import express from "express";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

router.get("/", async (req, res) => {
  const email = req.query.email as string;
  if (!email) {
    return res.status(400).json({ error: "Email mancante" });
  }

  const { data: utente, error: err1 } = await supabase
    .from("utenti")
    .select("id_studio")
    .eq("email", email)
    .single();

  if (err1 || !utente) {
    return res.status(404).json({ error: "Utente non trovato" });
  }

  const { data: condomini, error: err2 } = await supabase
    .from("condomini")
    .select("*")
    .eq("id_studio", utente.id_studio);

  if (err2) {
    return res.status(500).json({ error: "Errore lettura condomini" });
  }

  return res.json(condomini || []);
});

export default router;
