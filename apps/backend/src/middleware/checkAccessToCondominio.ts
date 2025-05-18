/// <reference path="../types/express/index.d.ts" />
// src/middleware/checkAccessToCondominio.ts
import { Request, Response, NextFunction } from 'express';
import { supabaseOperativo } from '../supabaseClient'; // o '../supabaseClients'

export async function checkAccessToCondominio(req: Request, res: Response, next: NextFunction) {
  const utenteId = (req as any).user?.id;
  const studioId = req.headers['x-studio-id'] as string;
  const condominioId = req.params.condominioId || req.body.condominioId;

  if (!utenteId || !studioId || !condominioId) {
    return res.status(400).json({ error: 'Dati incompleti per la verifica accesso.' });
  }

  try {
    const { data, error } = await supabaseOperativo
    .from('utenti_condomini')
    .select('id')
    .eq('id_utente', utenteId)
    .eq('studio_id', studioId)
    .eq('id_condominio', condominioId)
    .maybeSingle();
  
  if (error) {
    console.error('Errore Supabase (utenti_condomini):', error);
    return res.status(500).json({ error: 'Errore nel controllo permessi.' });
  }
  
  if (!data) {
    return res.status(403).json({ error: 'Accesso negato a questo condominio.' });
  }
  
  if (!data) {
    return res.status(403).json({ error: 'Accesso negato a questo condominio.' });
  }

    next(); // tutto ok
  } catch (err) {
    console.error('Errore accesso condominio:', err);
    res.status(500).json({ error: 'Errore interno.' });
  }
}
