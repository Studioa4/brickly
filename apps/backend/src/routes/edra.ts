import express from "express";
import { avviaBrowserSister } from "../bot/avviaBrowserSister";

const router = express.Router();

// ✅ STEP 1: Apre semplicemente la pagina Sister in modalità visibile
router.post("/edra/start", async (req, res) => {
  try {
    await avviaBrowserSister(); // 🔁 nessun dato richiesto, solo apertura browser
    return res.json({ messaggio: "Browser Sister aperto correttamente" });
  } catch (err: any) {
    console.error("❌ Errore avvio browser Sister:", err);
    return res.status(500).json({ errore: "Errore Puppeteer", dettagli: err.message });
  }
});

// ✅ API mock per /catasto/visure per testare la griglia frontend
router.get("/catasto/visure", async (req, res) => {
  return res.json([
    {
      comune: "Roma",
      provincia: "RM",
      sezione: "A",
      foglio: "123",
      particella: "456",
      subalterno: "7",
      rendita: "450.00",
      categoria: "A/3",
      visura: "/mock/visura_roma.pdf",
      proprietari_dettaglio: [
        {
          nome: "Mario",
          cognome: "Rossi",
          codice_fiscale: "RSSMRA80A01H501Z",
          quota: "100/100"
        }
      ]
    }
  ]);
});

export default router;
