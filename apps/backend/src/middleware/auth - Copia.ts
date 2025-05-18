
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface RequestConUtente extends Request {
  user?: {
    id: string;
    email?: string;
  };
}

export const authMiddleware = (req: RequestConUtente, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Token mancante' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.decode(token) as { sub?: string; email?: string };

    if (!decoded || !decoded.sub) {
      return res.status(403).json({ error: 'Token non valido' });
    }

    req.user = {
      id: decoded.sub,
      email: decoded.email
    };

    next();
  } catch (err) {
    console.error('❌ Errore nella decodifica JWT:', (err as Error).message);
    return res.status(403).json({ error: 'Token non valido' });
  }
};
