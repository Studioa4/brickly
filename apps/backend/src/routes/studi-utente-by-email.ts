import express from 'express';
import { supabase } from '../lib/supabaseClient';

const router = express.Router();

router.get('/studi-utente-by-email', async (req, res) => {
  const { email } = req.query;

  console.log("📡 GET /studi-utente-by-email", email);

  if (!email) {
    return res.status(400).json({ errore: "Email mancante" });
  }

  const { data: anagrafiche, error: errorAnag } = await supabase
    .from('anagrafiche')
    .select('id')
    .eq('email', email);

  if (errorAnag || !anagrafiche || anagrafiche.length === 0) {
    console.error("❌ Nessuna anagrafica trovata per email:", email);
    return res.status(404).json({ errore: "Nessuna anagrafica trovata" });
  }

  const anagraficaIds = anagrafiche.map(a => a.id);

  const { data: studi, error: errorStudi } = await supabase
    .from('utenti_studi')
    .select('id_studio, studi:studi (id, denominazione)')
    .in('id_utente', anagraficaIds);

  if (errorStudi) {
    console.error("❌ Errore recupero studi per email:", errorStudi);
    return res.status(500).json({ errore: "Errore recupero studi", dettagli: errorStudi.message });
  }

  const risultati = studi.map(r => r.studi);
  res.json(risultati || []);
});

export default router;