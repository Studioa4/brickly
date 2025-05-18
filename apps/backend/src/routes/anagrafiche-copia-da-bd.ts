import { checkAccessToCondominio } from '../middleware/checkAccessToCondominio';

import express from 'express';
import { supabaseBancheDati } from '../supabaseClient';

const router = express.Router();

router.get('/', checkAccessToCondominio, async (_req, res) => {
  const { data, error } = await supabaseBancheDati
    .from('anagrafiche')
    .select('*');

  if (error) {
    console.error('❌ Errore anagrafiche:', error.message);
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
});

export default router;
