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
  // ✅ Route 4: verifica se il codice fiscale è già associato a un condominio

  console.log("✅ Entrato nella route /checkCodiceFiscale");
  const codiceFiscale = req.query.cf as string;


  if (!codiceFiscale) {
    return res.status(400).json({ error: "Codice fiscale mancante" });
  }

  // Crea un nuovo client anonimo per evitare auth implicita
  const anonClient = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!);

  try {
    const { data: condominio, error } = await anonClient
      .from("condomini")
      .select("id_studio, denominazione")
      .eq("codice_fiscale", codiceFiscale)
      .maybeSingle();

    if (error) {
      console.error("Errore DB:", error.message);
      return res.status(500).json({ error: "Errore database" });
    }

    if (condominio) {
      const { data: studio, error: errStudio } = await anonClient
        .from("studi")
        .select("denominazione")
        .eq("id", condominio.id_studio)
        .maybeSingle();

      return res.json({
        exists: true,
        id_studio: condominio.id_studio,
        nome_condominio: condominio.denominazione,
        nome_studio: studio?.denominazione ?? "Studio sconosciuto",
      });
    }

    return res.json({ exists: false });
  } catch (err) {
    console.error("❌ Errore verifica CF:", err);
    return res.status(500).json({ error: "Errore interno" });
  }
});

// ✅ Route 5: carica il nuovo condominio

router.post("/nuovo", async (req, res) => {
  const body = req.body;

  if (!body || !body.codice_fiscale || !body.denominazione || !body.id_studio) {
    return res.status(400).json({ error: "Dati mancanti" });
  }

  try {
    const { data, error } = await supabase
      .from("condomini")
      .insert([
        {
          codice_fiscale: body.codice_fiscale,
          denominazione: body.denominazione,
          id_studio: body.id_studio,
          tipologia: body.tipologia ?? "Condominio",
          alias_denominazione: body.alias,
          indirizzo: body.indirizzo,
          citta: body.comune,
          provincia: body.provincia,
          cap: body.cap,
          stato: body.stato, 
          latitudine: body.latitudine,
          longitudine: body.longitudine,
        },
      ])
      .select();

    if (error) throw error;

    return res.json({ success: true, condominio: data?.[0] });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});


// ✅ Route 6: assegna il nuovo condominio all'utente selezionato
router.post("/assegna", async (req, res) => {
    console.log("📥 /assegna - ricevo:", req.body);
  const { id_studio, id_condominio, email } = req.body;

  if (!id_studio || !id_condominio || !email) {
    return res.status(400).json({ error: "Dati mancanti" });
  }

  try {
    // Trova l'id dell'utente_studio
    const { data: utenteStudio, error: userErr } = await supabase
      .from("utenti_studi")
      .select("id")
      .eq("id_studio", id_studio)
      .eq("email", email)
      .maybeSingle();

    if (userErr || !utenteStudio) {
      return res.status(404).json({ error: "Utente dello studio non trovato" });
    }

    // Inserisce nella tabella ponte
    const { error: insertErr } = await supabase
      .from("utenti_studi_condomini")
      .insert([
        {
          id_utente_studio: utenteStudio.id,
          id_condominio,
        },
      ]);

    if (insertErr) throw insertErr;

    return res.json({ success: true });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// apps/backend/src/routes/condomini.ts

// ✅ Recupera i dati completi del condominio dato un ID (usato dal wrapper)
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "ID mancante" });
  }

  try {
    const { data, error } = await supabase
      .from("condomini")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("❌ Errore Supabase:", error.message);
      return res.status(500).json({ error: error.message });
    }

    return res.json(data);
  } catch (err: any) {
    console.error("❌ Errore interno:", err.message);
    return res.status(500).json({ error: err.message });
  }
});


export default router;
