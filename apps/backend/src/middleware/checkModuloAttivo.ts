import { Request, Response, NextFunction } from 'express';
import { supabaseOperativo } from '../supabaseClient'; // o supabaseClients, se usi quello

/**
 * Middleware per verificare se un modulo è attivo per lo studio selezionato.
 * @param codiceModulo es. 'catasto', 'fatture', 'sondaggi'
 */
export function checkModuloAttivo(codiceModulo: string) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const studioId = req.headers['x-studio-id'] as string;

    if (!studioId) {
      return res.status(400).json({ error: 'ID dello studio non fornito negli header.' });
    }

    const { data, error } = await supabaseOperativo
      .from('moduli_studio')
      .select('id')
      .eq('studio_id', studioId)
      .eq('attivo', true)
      .in('modulo_id', 
        supabaseOperativo
          .from('moduli')
          .select('id')
          .eq('codice', codiceModulo)
      );

    if (error) {
      console.error('Errore Supabase (moduli_studio):', error);
      return res.status(500).json({ error: 'Errore nella verifica modulo attivo.' });
    }

    if (!data || data.length === 0) {
      return res.status(403).json({ error: `Modulo '${codiceModulo}' non abilitato per questo studio.` });
    }

    next();
  };
}
