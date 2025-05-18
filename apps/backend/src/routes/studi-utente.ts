
import express, { Request, Response } from 'express';
import { supabaseOperativo } from '../supabaseClient';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
  const id_utente = req.query.id_utente as string;

  if (!id_utente) {
    return res.status(400).json({ error: 'id_utente mancante' });
  }

  try {
    const { data: relazioni, error: errRel } = await supabaseOperativo
      .from('utenti_studi')
      .select('id_studio')
      .eq('id_utente', id_utente);

    if (errRel) {
      console.error('Errore fetch utenti_studi:', errRel.message);
      return res.status(500).json({ error: 'Errore fetch utenti_studi' });
    }

    if (!relazioni || relazioni.length === 0) {
      return res.json([]);
    }

    const ids = relazioni.map(r => r.id_studio).filter(Boolean);

    console.log("🧪 ID studi trovati:", ids);

    if (ids.length === 0) {
      return res.json([]);
    }

    const { data: studi, error: errStudi } = await supabaseOperativo
      .from('studi')
      .select('id, denominazione')
      .in('id', ids);

    if (errStudi) {
      console.error('Errore fetch studi:', errStudi.message);
      return res.status(500).json({ error: 'Errore fetch studi' });
    }

    const output = studi.map(s => ({
      id_studio: s.id,
      nome: s.denominazione
    }));

    res.json(output);
  } catch (err) {
    console.error('Errore generale:', (err as Error).message);
    res.status(500).json({ error: 'Errore interno' });
  }
});

export default router;
