
import express from 'express';
import { dbOperativo } from '../db/db-operativo';
import { dbBancheDati } from '../db/db-banche-dati';

const router = express.Router();

router.get('/operativo', async (req, res) => {
  try {
    const result = await dbOperativo.query('SELECT NOW()');
    res.json({ operativo: result.rows[0] });
  } catch (err) {
    const error = err as Error;
    console.error('❌ Errore DB OPERATIVO:', error.message);
    res.status(500).json({ error: 'Errore connessione DB OPERATIVO' });
  }
});

router.get('/banche-dati', async (req, res) => {
  try {
    const result = await dbBancheDati.query('SELECT NOW()');
    res.json({ banche_dati: result.rows[0] });
  } catch (err) {
    const error = err as Error;
    console.error('❌ Errore DB BANCHE DATI:', error.message);
    res.status(500).json({ error: 'Errore connessione DB BANCHE DATI' });
  }
});

export default router;
