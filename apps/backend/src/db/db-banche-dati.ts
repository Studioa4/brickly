
import { Pool } from 'pg';

export const dbBancheDati = new Pool({
  connectionString: process.env.DB_BANCHE_DATI_URL || 'postgres://utente:password@localhost:5432/brickly_banche_dati',
});
