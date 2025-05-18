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

router.get('/api/studi-utente', async (req, res) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token mancante' });
  }

  const token = auth.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const codiceFiscale = decoded.username;

    const { data: rel, error: relErr } = await supabase
      .from('utenti_studi')
      .select('id_studio')
      .eq('codice_fiscale_utente', codiceFiscale);

    if (relErr || !rel) return res.status(200).json([]);

    const studioIds = rel.map(r => r.id_studio);

    const { data: studi, error } = await supabase
      .from('studi')
      .select('id, denominazione')
      .in('id', studioIds);

    if (error) return res.status(200).json([]);

    res.json(studi);
  } catch (err) {
    return res.status(401).json({ error: 'Token non valido' });
  }
});

router.get('/api/condomini', async (req, res) => {
  const studioId = req.query.studio_id;
  if (!studioId || typeof studioId !== 'string') {
    return res.status(400).json({ error: 'studio_id mancante' });
  }

  const { data, error } = await supabase
    .from('condomini')
    .select('id, denominazione')
    .eq('id_studio', studioId);

  if (error) return res.status(200).json([]);
  return res.json(data);
});

export default router;
