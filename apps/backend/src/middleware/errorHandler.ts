
import { Request, Response, NextFunction } from 'express';

// Middleware finale di gestione errori
export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  if (res.headersSent) return next(err);

  if (err.status === 401 || err.status === 403) {
    return res.status(err.status).json({
      error: err.message || 'Accesso non autorizzato'
    });
  }

  console.error('Errore generico:', err);
  res.status(500).json({ error: 'Errore interno del server' });
}
