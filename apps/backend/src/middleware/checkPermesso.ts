import { Request, Response, NextFunction } from 'express';
import { haPermesso, ModuloPermessi, Azione } from '../utils/permessi';

export function checkPermesso(modulo: ModuloPermessi, azione: Azione) {
  return function (req: Request, res: Response, next: NextFunction) {
    const utente = req.utente;

    if (!utente || !haPermesso(utente.permessi, modulo, azione)) {
      return res.status(403).json({ errore: 'Accesso non autorizzato' });
    }

    next();
  };
}
