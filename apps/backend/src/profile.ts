import express from 'express';
import jwt from 'jsonwebtoken';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

router.get('/api/profile', async (req, res) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token mancante' });
  }

  const token = auth.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    const { username, ruolo, userId } = decoded as any;

    // username è codice fiscale → cerchiamo nome + cognome
    const { data, error } = await supabase
      .from('anagrafiche')
      .select('nome, cognome')
      .eq('codice_fiscale', username)
      .single();

    if (error) {
      return res.status(200).json({ user: { username, ruolo } });
    }

    return res.status(200).json({
      user: {
        id: userId,
        username,
        ruolo,
        nome: data.nome,
        cognome: data.cognome
      }
    });
  } catch (err) {
    return res.status(401).json({ error: 'Token non valido' });
  }
});

export default router;
