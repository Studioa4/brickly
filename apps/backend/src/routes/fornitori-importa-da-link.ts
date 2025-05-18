import express from "express";
import axios from "axios";
import * as cheerio from "cheerio";
import { createClient } from "@supabase/supabase-js";

const router = express.Router();
const supabase = createClient(
  process.env.SUPABASE_BD_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

router.post("/importa-da-link", async (req, res) => {
  const { url } = req.body;

  if (!url || !url.startsWith("https://www.ufficiocamerale.it/")) {
    return res.status(400).json({ error: "URL non valido" });
  }

  try {
    const { data: html } = await axios.get<string>(url, {
      headers: { "User-Agent": "Mozilla/5.0" }
    });

    const $ = cheerio.load(html);
    const ragione_sociale = $("h1.entry-title").text().trim();
    const contenuto = $(".entry-content p")
      .map((_, el) => $(el).text().trim())
      .get();

    const find = (label: string) =>
      contenuto.find(t => t.toLowerCase().includes(label.toLowerCase()))?.split(":")[1]?.trim() || "";

    const piva = find("Partita IVA");
    const cf = find("Codice Fiscale");
    const pec = find("PEC");

    const indirizzoFull = find("Indirizzo");
    const [indirizzo, capComune] = indirizzoFull.split(/\d{5}/);
    const cap = indirizzoFull.match(/\d{5}/)?.[0] || "";
    const comune = capComune?.trim().split(" ")[0] || "";
    const provincia = capComune?.trim().split(" ")[1]?.replace("(", "").replace(")", "") || "";

    console.log("🧩 Dati estratti:");
    console.log({ ragione_sociale, piva, cf, indirizzo, cap, comune, provincia, pec });

    if (!piva || !ragione_sociale || !pec) {
      return res.status(400).json({ error: "Dati incompleti, impossibile salvare" });
    }

    const nuovo = {
      ragione_sociale,
      partita_iva: piva,
      codice_fiscale: cf,
      indirizzo: indirizzo?.trim(),
      cap,
      citta: comune,
      provincia,
      pec
    };

    const { data, error } = await supabase
      .from("fornitori")
      .insert([nuovo])
      .select();

    if (error) {
      console.error("Errore Supabase:", error.message);
      return res.status(500).json({ error: "Errore durante il salvataggio" });
    }

    res.status(201).json(data[0]);
  } catch (err: any) {
    console.error("Errore scraping da link:", err.message);
    return res.status(500).json({ error: "Scraping fallito" });
  }
});

export default router;