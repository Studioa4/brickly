import express from "express";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

// 🔐 Route 1: restituisce i condomìni visibili all’utente loggato per uno studio
router.get("/", async (req, res) => {
  const studioId = req.query.studio_id as string;
  const auth = req.headers.authorization;

  if (!studioId || !auth?.startsWith("Bearer ")) {
    return res.status(400).json({ error: "studio_id o token mancante" });
  }

  const token = auth.split(" ")[1];

try {
  const { data: { user }, error } = await supabase.auth.getUser(token);

  if (error || !user) {
    return res.status(401).json({ error: "Token non valido" });
  }

  const email = (user as any)?.email;
  console.log("🧪 Email Supabase:", email);
  console.log("🧪 Studio ID ricevuto:", studioId);

  // 1. Recupera id_utente_studio dalla tabella utenti_studi tramite email
  const { data: studioUser, error: userStudioError } = await supabase
    .from("utenti_studi")
    .select("id")
    .eq("id_studio", studioId)
    .eq("email", email)
    .maybeSingle();

  if (userStudioError || !studioUser) {
    console.warn("⚠️ Nessun record trovato in utenti_studi per questa email + studio");
    return res.status(403).json({ error: "Utente non associato allo studio selezionato" });
  }

  // 2. Recupera id_condominio dalla tabella ponte utenti_studi_condomini
  const { data: links, error: linkError } = await supabase
    .from("utenti_studi_condomini")
    .select("id_condominio")
    .eq("id_utente_studio", studioUser.id);

  if (linkError) throw linkError;

  const ids = links?.map(l => l.id_condominio) || [];

  if (ids.length === 0) {
    console.log("ℹ️ Nessun condominio abbinato all’utente per questo studio");
    return res.json([]);
  }

  // 3. Recupera i dati dei condomìni
  const { data: condomini, error: condError } = await supabase
    .from("condomini")
    .select("id, tipologia, denominazione, alias_denominazione, indirizzo, citta, provincia, codice_fiscale")
    .in("id", ids);

  console.log("✅ Condomìni restituiti:", condomini);

  if (condError) throw condError;

  return res.json(condomini || []);
} catch (err: any) {
  console.error("❌ Errore route /api/condomini:", err?.message || err);
  return res.status(500).json({ error: err?.message || "Errore interno del server" });
}


});

// ✅ Route 2: pubblica – tutti i condomìni dello studio (senza filtro utente)
router.get("/utente", async (req, res) => {
  const auth = req.headers.authorization;
  const studioId = req.query.studio_id as string;

  if (!auth?.startsWith("Bearer ")) return res.status(401).json({ error: "Token mancante" });
  if (!studioId) return res.status(400).json({ error: "studio_id mancante" });

  const token = auth.split(" ")[1];

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) return res.status(401).json({ error: "Token non valido" });

    const { data: condomini, error: fetchError } = await supabase
      .from("condomini")
      .select("id, denominazione")
      .eq("id_studio", studioId);

    if (fetchError) {
      console.error("❌ Errore lettura condomini:", fetchError);
      return res.status(500).json({ error: "Errore nel recupero dei condomini" });
    }

    return res.json(condomini || []);
  } catch (err) {
    console.error("❌ Errore interno:", err);
    return res.status(500).json({ error: "Errore interno del server" });
  }
});

// ✅ Route 3: usata nel modale per caricare tutti i condomìni e quelli già assegnati a un utente studio
router.get("/studio", async (req, res) => {
  const studioId = req.query.studio_id as string;
  const utenteStudioId = req.query.utente_studio_id as string;

  if (!studioId || !utenteStudioId) {
    return res.status(400).json({ error: "studio_id o utente_studio_id mancante" });
  }

  try {
    const { data: condomini, error: err1 } = await supabase
      .from("condomini")
      .select("id, denominazione")
      .eq("id_studio", studioId);

    if (err1) throw err1;

    const { data: assegnati, error: err2 } = await supabase
      .from("utenti_studi_condomini")
      .select("id_condominio")
      .eq("id_utente_studio", utenteStudioId);

    if (err2) throw err2;

    res.json({
      condomini: condomini || [],
      assegnati: assegnati?.map(a => a.id_condominio) || []
    });
  } catch (err) {
    console.error("❌ Errore backend:", err);
    return res.status(500).json({ error: "Errore caricamento condomini studio" });
  }
});

export default router;
