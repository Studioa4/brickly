import express from 'express';
import { supabase } from '../lib/supabaseClient';

const router = express.Router();

router.get('/anagrafiche', async (req, res) => {
  const { data, error } = await supabase
    .from('anagrafiche')
    .select('id, nome, cognome')
    .order('cognome');

  if (error) {
    console.error("❌ Errore caricamento anagrafiche:", error);
    return res.status(500).json({ errore: "Errore nel recupero delle anagrafiche" });
  }

  res.json(data || []);
});

export default router;
