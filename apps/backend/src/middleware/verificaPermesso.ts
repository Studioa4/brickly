
import { Request, Response, NextFunction } from 'express';
import { supabaseOperativo } from '../supabaseClient'; // o '../supabaseClients'

// Middleware che controlla se l'utente ha accesso a un modulo specifico
export function verificaPermesso(modulo: string) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const utenteStudioId = req.user?.utente_studio_id;
    if (!utenteStudioId) {
      return res.status(401).json({ error: 'Utente non autenticato' });
    }

    try {
      const result = await pool.query(
        'SELECT ${modulo} FROM utenti_studi_moduli WHERE utente_studio_id = $1',
        [utenteStudioId]
      );

      if (!result.rows[0]?.[modulo]) {
        return res.status(403).json({ error: 'Permesso negato al modulo ' + modulo });
      }

      next();
    } catch (err) {
      console.error('Errore nella verifica permesso modulo:', err);
      res.status(500).json({ error: 'Errore interno' });
    }
  };
}
