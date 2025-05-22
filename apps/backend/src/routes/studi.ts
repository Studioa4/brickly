import express from 'express';
import { supabase } from '../lib/supabaseClient'; // per GET /studi

const router = express.Router();

// 🔒 NON TOCCARE: la tua route originale
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

// ✅ Nuove route per Edra (usano supabase)
router.get('/studi/:id/moduli', async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from('studi')
    .select('sister_username, sister_password, sister_pin')
    .eq('id', id)
    .single();

  if (error) {
    console.error('❌ Errore lettura moduli studio:', error.message);
    return res.status(500).json({ errore: 'Errore lettura moduli', dettagli: error.message });
  }

  res.json(data);
});

router.patch('/studi/:id/moduli', async (req, res) => {
  const { id } = req.params;
  const { sister_username, sister_password, sister_pin } = req.body;

  const { error } = await supabase
    .from('studi')
    .update({ sister_username, sister_password, sister_pin })
    .eq('id', id);

  if (error) {
    console.error('❌ Errore aggiornamento moduli studio:', error.message);
    return res.status(500).json({ errore: 'Errore aggiornamento moduli', dettagli: error.message });
  }

  res.json({ messaggio: 'Moduli aggiornati con successo' });
});

export default router;
