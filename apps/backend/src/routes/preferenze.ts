import express from "express";
import { supabaseOperativo } from "../supabaseClient";

const router = express.Router();

// GET /api/preferenze
router.get("/api/preferenze", async (req, res) => {
  const cf = (req as any).user?.codice_fiscale;
  if (!cf) return res.status(401).json({ error: "Utente non autenticato" });

  const { data, error } = await supabaseOperativo
    .from("preferenze_utente")
    .select("*")
    .eq("codice_fiscale", cf)
    .maybeSingle();

  if (error) return res.status(500).json({ error: error.message });

  res.json(data || { tema: "chiaro", layout_menu: "sidebar" });
});

// PATCH /api/preferenze
router.patch("/api/preferenze", async (req, res) => {
  const cf = (req as any).user?.codice_fiscale;
  const { tema, layout_menu } = req.body;

  if (!cf) return res.status(401).json({ error: "Utente non autenticato" });

  const { error } = await supabaseOperativo
    .from("preferenze_utente")
    .upsert({ codice_fiscale: cf, tema, layout_menu });

  if (error) return res.status(500).json({ error: error.message });

  res.status(200).json({ success: true });
});

export default router;
