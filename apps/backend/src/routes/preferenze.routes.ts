import express from "express";
import { supabase } from "../lib/supabaseClient";
import { Request, Response } from "express";

const router = express.Router();

// GET /api/preferenze - preferenze_utente
router.get("/", async (req: Request, res: Response) => {
  const utente_id = req.utente?.id;
  if (!utente_id) return res.status(401).send("Non autorizzato");

  const { data, error } = await supabase
    .from("preferenze_utente")
    .select("*")
    .eq("utente_id", utente_id)
    .single();

  if (error) return res.status(500).json({ error: error.message });
  return res.json(data || {});
});

// PATCH /api/preferenze - preferenze_utente
router.patch("/", async (req: Request, res: Response) => {
  const utente_id = req.utente?.id;
  if (!utente_id) return res.status(401).send("Non autorizzato");

  const payload = { ...req.body, utente_id };

  const { error } = await supabase
    .from("preferenze_utente")
    .upsert(payload, { onConflict: "utente_id" });

  if (error) return res.status(500).json({ error: error.message });
  return res.sendStatus(204);
});

// GET /api/preferenze/:studio_id - preferenze_utente_studio
router.get("/:studio_id", async (req: Request, res: Response) => {
  const utente_id = req.utente?.id;
  const studio_id = req.params.studio_id;
  if (!utente_id) return res.status(401).send("Non autorizzato");

  const { data, error } = await supabase
    .from("preferenze_utente_studio")
    .select("*")
    .eq("utente_id", utente_id)
    .eq("studio_id", studio_id)
    .single();

  if (error) return res.status(500).json({ error: error.message });
  return res.json(data || {});
});

// PATCH /api/preferenze/:studio_id - preferenze_utente_studio
router.patch("/:studio_id", async (req: Request, res: Response) => {
  const utente_id = req.utente?.id;
  const studio_id = req.params.studio_id;
  if (!utente_id) return res.status(401).send("Non autorizzato");

  const payload = { ...req.body, utente_id, studio_id };

  const { error } = await supabase
    .from("preferenze_utente_studio")
    .upsert(payload, { onConflict: "utente_id,studio_id" });

  if (error) return res.status(500).json({ error: error.message });
  return res.sendStatus(204);
});

export default router;