import { Router } from "express";
import { supabaseBancheDati } from "../supabaseClient";

const router = Router();

router.get("/", async (req, res) => {
  const cf = req.query.cf;

  if (!cf || typeof cf !== "string") {
    return res.status(400).json({ error: "Parametro 'cf' mancante o non valido" });
  }

  const { data, error } = await supabaseBancheDati
    .from("anagrafiche")
    .select("id")
    .eq("codice_fiscale", cf)
    .limit(1);

  if (error) {
    console.error("Errore Supabase:", error.message);
    return res.status(500).json({ error: "Errore nella verifica" });
  }

  return res.json({ exists: data.length > 0 });
});

export default router;
