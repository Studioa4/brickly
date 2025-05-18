// backend/src/express.d.ts

export {}; // 👈 fondamentale: forza TS a trattarlo come modulo

import 'express';

declare namespace Express {
  export interface Request {
    utente?: {
      id: string;
      email?: string;
      nome?: string;
    };
  }
}
