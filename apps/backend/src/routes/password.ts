
import express from 'express';
import { supabaseOperativo } from '../supabaseClient';

const router = express.Router();

router.get('/', async (req, res) => {
  const email = req.query.email;

  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: 'Email mancante o non valida' });
  }

  const { data, error } = await supabaseOperativo
    .from('password')
    .select('*')
    .eq('email', email)
    .single();

  if (error) {
    console.error('❌ Errore /api/password:', error.message);
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
});

export default router;
