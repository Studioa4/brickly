import express from "express";
import { createClient } from "@supabase/supabase-js";
import { cercaFornitoreConPlaywright } from "../utils/cercaFornitoreConPlaywright";

const router = express.Router();

const supabase = createClient(
  process.env.SUPABASE_BD_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET /api/fornitori
router.get("/", async (req, res) => {
  const { limit = 50, offset = 0, ...filters } = req.query;

  let query = supabase
    .from("fornitori")
    .select("id, ragione_sociale, codice_fiscale, partita_iva, indirizzo, cap, citta, provincia, pec", { count: "exact" })
    .order("ragione_sociale");

  for (const key in filters) {
    const value = filters[key];
    if (typeof value === "string" && value.trim() !== "") {
      query = query.ilike(key, `%${value}%`);
    }
  }

  query = query.range(Number(offset), Number(offset) + Number(limit) - 1);

  const { data, error, count } = await query;

  if (error) {
    console.error("Errore Supabase:", error.message);
    return res.status(500).json({ error: "Errore nel recupero fornitori" });
  }

  res.json({ data, total: count });
});

// GET /api/fornitori/ricerca/:piva (con Playwright)
router.get("/ricerca/:piva", async (req, res) => {
  const piva = req.params.piva;

  if (!/^[0-9]{11}$/.test(piva)) {
    return res.status(400).json({ error: "Partita IVA non valida" });
  }

  const dati = await cercaFornitoreConPlaywright(piva);
  if (!dati) {
    return res.status(404).json({ error: "Fornitore non trovato" });
  }

  res.json(dati);
});

// POST /api/fornitori
router.post("/", async (req, res) => {
  const nuovo = req.body;

  if (!nuovo?.partita_iva || nuovo.partita_iva.length !== 11) {
    return res.status(400).json({ error: "Partita IVA obbligatoria" });
  }

  const { data, error } = await supabase
    .from("fornitori")
    .insert([nuovo])
    .select();

  if (error) {
    console.error("Errore inserimento fornitore:", error.message);
    return res.status(500).json({ error: "Errore durante il salvataggio" });
  }

  res.status(201).json(data[0]);
});

// PUT /api/fornitori/:id
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const aggiornato = req.body;

  if (!id) {
    return res.status(400).json({ error: "ID mancante" });
  }

  const { data, error } = await supabase
    .from("fornitori")
    .update(aggiornato)
    .eq("id", id)
    .select();

  if (error) {
    console.error("Errore aggiornamento fornitore:", error.message);
    return res.status(500).json({ error: "Errore durante l'aggiornamento" });
  }

  res.status(200).json(data[0]);
});

export default router;