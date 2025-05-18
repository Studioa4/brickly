
import express from 'express';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

const router = express.Router();

router.post('/', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email e password richieste' });
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password
  });

  if (error) {
    console.error('❌ Errore registrazione Supabase:', error.message);
    return res.status(400).json({ error: error.message });
  }

  res.json({ message: 'Utente registrato con successo', data });
});

export default router;
