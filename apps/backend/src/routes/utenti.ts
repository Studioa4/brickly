
import express from 'express';
import { supabaseOperativo } from '../supabaseClient';

const router = express.Router();

router.get('/', async (_req, res) => {
  const { data, error } = await supabaseOperativo
    .from('anagrafiche')
    .select('id, email, nome, cognome, codice_fiscale, ruolo');

  if (error) {
    console.error('❌ Errore /superadmin/utenti:', error.message);
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
});

export default router;
