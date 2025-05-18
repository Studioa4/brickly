
import express, { Request, Response } from 'express';
import { dbOperativo } from '../db/db-operativo';
import { authMiddleware } from '../middleware/auth';

interface RequestConUtente extends Request {
  user?: {
    id: string;
    email?: string;
    utente_studio_id?: string;
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

  try {
    const result = await dbOperativo.query(
      `SELECT banche_dati_catasto, banche_dati_anagrafiche, banche_dati_fornitori,
              banche_dati_province_e_comuni, banche_dati_tabelle_fiscali
       FROM utenti_studi_moduli
       WHERE studio_id = $1 AND id_utente = $2
       LIMIT 1`,
      [studioId, utenteId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Permessi non trovati' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('❌ Errore REST /permessi (utente + studio):', (err as Error).message);
    res.status(500).json({ error: 'Errore nel recupero permessi' });
  }
});

export default router;
