
import { Pool } from 'pg';

export const dbOperativo = new Pool({
  connectionString: process.env.DB_OPERATIVO_URL || 'postgres://utente:password@localhost:5432/brickly_operativo',
});
