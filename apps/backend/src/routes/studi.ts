import express from 'express';
import { supabase } from '../lib/supabaseClient';

const router = express.Router();

router.get('/studi', async (req, res) => {
  console.log("📡 GET /studi");

  const { data, error } = await supabase
    .from('studi')
    .select('*')
    .order('denominazione');

  if (error) {
    console.error('❌ Errore lettura studi:', error);
    return res.status(500).json({ errore: 'Errore lettura studi', dettagli: error.message });
  }

  res.json(data || []);
});

export default router;
