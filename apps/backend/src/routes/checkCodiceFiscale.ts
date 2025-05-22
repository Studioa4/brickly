import { Router } from "express";
import { supabaseOperativo } from "../supabaseClient";

const router = Router();

router.get("/", async (req, res) => {
  const codiceFiscale = req.query.cf as string;

  if (!codiceFiscale) {
    return res.status(400).json({ error: "Codice fiscale mancante" });
  }

  try {
    const { data: condominio, error } = await supabaseOperativo
      .from("condomini")
      .select("id_studio, denominazione")
      .eq("codice_fiscale", codiceFiscale)
      .maybeSingle();

    if (error) return res.status(500).json({ error: error.message });

    if (condominio) {
const { data: studio, error: errStudio } = await supabaseOperativo
  .from("studi")
  .select("denominazione")
  .eq("id", condominio.id_studio)
  .maybeSingle();

if (errStudio) {
  console.error("❌ Errore lettura studio:", errStudio.message);
}

return res.json({
  exists: true,
  id_studio: condominio.id_studio,
  nome_condominio: condominio.denominazione,
  nome_studio: studio?.denominazione ?? "Studio sconosciuto"
});

    }

    return res.json({ exists: false });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

export default router;
