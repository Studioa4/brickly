
import express from 'express';
import { supabaseOperativo } from '../supabaseClient';

const router = express.Router();

router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const { ruolo } = req.body;

  if (!ruolo) {
    return res.status(400).json({ error: 'Ruolo richiesto' });
  }

  const { error } = await supabaseOperativo
    .from('anagrafiche')
    .update({ ruolo })
    .eq('id', id);

  if (error) {
    console.error('❌ Errore aggiornamento ruolo:', error.message);
    return res.status(500).json({ error: error.message });
  }

  res.json({ message: 'Ruolo aggiornato con successo' });
});

export default router;
