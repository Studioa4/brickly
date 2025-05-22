import { supabase } from "@/lib/supabase"; // adatta al tuo path
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const codiceFiscale = req.query.cf?.toString().trim();

  if (!codiceFiscale || !/^[0-9]{11}$/.test(codiceFiscale)) {
    return res.status(400).json({ error: "Codice fiscale non valido" });
  }

  const { data, error } = await supabase
    .from("condomini")
    .select("id, denominazione, id_studio, studi:studi(nome)")
    .eq("codice_fiscale", codiceFiscale)
    .maybeSingle();

  if (error) {
    console.error("Errore Supabase:", error);
    return res.status(500).json({ error: "Errore nel database" });
  }

  if (data) {
    return res.json({
      exists: true,
      nome_condominio: data.denominazione,
      id_studio: data.id_studio,
      nome_studio: data.studi?.nome || "Studio sconosciuto",
    });
  } else {
    return res.json({ exists: false });
  }
}
