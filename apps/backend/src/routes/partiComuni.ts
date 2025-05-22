import { Router } from "express";
import { supabaseOperativo } from "../supabaseClient";

const router = Router();

// GET
router.get("/", async (req, res) => {
  const { condominio_id } = req.query;
  if (!condominio_id) return res.status(400).json({ error: "condominio_id richiesto" });

  const { data, error } = await supabaseOperativo
    .from("parti_comuni_struttura")
    .select("*")
    .eq("condominio_id", condominio_id);

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// POST
router.post("/", async (req, res) => {
  const { nome, tipologia, note, condominio_id } = req.body;
  if (!nome || !condominio_id) {
    return res.status(400).json({ error: "nome e condominio_id sono obbligatori" });
  }

  const { data, error } = await supabaseOperativo
    .from("parti_comuni_struttura")
    .insert([{ nome, tipologia, note, condominio_id }])
    .select();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

export default router;
