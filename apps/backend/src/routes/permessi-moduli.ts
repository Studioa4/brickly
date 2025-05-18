
import express, { Request, Response } from 'express';
import { supabaseOperativo } from '../supabaseClient';
import { authMiddleware } from '../middleware/auth';

interface RequestConUtente extends Request {
  user?: {
    id: string;
    email?: string;
  };
}

const router = express.Router();

router.get('/', authMiddleware, async (req: RequestConUtente, res: Response) => {
  const studioId = req.query.studio_id;
  const utenteId = (req as any).user?.id;

  if (!studioId || typeof studioId !== 'string') {
    return res.status(400).json({ error: 'studio_id mancante o non valido' });
  }

  if (!utenteId) {
    return res.status(401).json({ error: 'Utente non autenticato' });
  }

  // Step 1: trova l'id del record utenti_studi
  const { data: rel, error: relError } = await supabaseOperativo
    .from('utenti_studi')
    .select('id')
    .eq('id_utente', utenteId)
    .eq('id_studio', studioId)
    .maybeSingle();

  if (relError) {
    console.error('❌ Errore ricerca relazioni utenti_studi:', relError.message);
    return res.status(500).json({ error: 'Errore nella ricerca relazione utente-studio' });
  }

  if (!rel) {
    return res.status(404).json({ error: 'Relazione utente-studio non trovata' });
  }

  // Step 2: trova i permessi usando utenti_studi.id
  const { data, error } = await supabaseOperativo
    .from('utenti_studi_moduli')
    .select('banche_dati_catasto, banche_dati_anagrafiche, banche_dati_fornitori, banche_dati_province_e_comuni, banche_dati_tabelle_fiscali')
    .eq('utente_studio_id', rel.id)
    .maybeSingle();

  if (error) {
    console.error('❌ Errore Supabase REST /permessi-moduli:', error.message);
    return res.status(500).json({ error: 'Errore nel recupero permessi' });
  }

  if (!data) {
    return res.status(404).json({ error: 'Permessi non trovati' });
  }

  res.json(data);
});

export default router;
