import { Router } from "express";
import { supabaseOperativo } from "../supabaseClient";

const router = Router();

// 🔍 GET impianti per condominio (con nome parte comune)
router.get("/", async (req, res) => {
  const { condominio_id } = req.query;

  if (!condominio_id) {
    return res.status(400).json({ error: "condominio_id richiesto" });
  }

  const { data, error } = await supabaseOperativo
    .from("impianti")
    .select("*, struttura:parti_comuni_struttura(nome)")
    .eq("condominio_id", condominio_id);

  if (error) {
    console.error("❌ Errore GET impianti:", error.message);
    return res.status(500).json({ error: error.message });
  }

  // 🔄 Mappa il nome della parte comune per semplificare la griglia
  const dataConNome = (data || []).map((item) => ({
    ...item,
    struttura_nome: item.struttura?.nome || null,
  }));

  res.json(dataConNome);
});

// ➕ POST nuovo impianto
router.post("/", async (req, res) => {
  const {
    condominio_id,
    struttura_id,
    tipo,
    descrizione,
    marca_modello,
    anno_installazione,
  } = req.body;

  if (!condominio_id || !tipo) {
    return res.status(400).json({ error: "campi obbligatori mancanti" });
  }

  const { data, error } = await supabaseOperativo
    .from("impianti")
    .insert([
      {
        condominio_id,
        struttura_id: struttura_id || null,
        tipo,
        descrizione,
        marca_modello,
        anno_installazione: anno_installazione ? parseInt(anno_installazione) : null,
      },
    ])
    .select();

  if (error) {
    console.error("❌ Errore POST impianto:", error.message);
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
});

export default router;
