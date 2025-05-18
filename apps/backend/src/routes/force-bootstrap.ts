
import express from 'express';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

const router = express.Router();

router.post('/', async (_req, res) => {
  const { data, error } = await supabase.auth.admin.listUsers();
  if (error) {
    console.error('Errore recupero utenti:', error.message);
    return res.status(500).json({ error: error.message });
  }

  const users = data.users;

  const errors: string[] = [];
  for (const user of users) {
    const { error: deleteError } = await supabase.auth.admin.deleteUser(user.id);
    if (deleteError) {
      errors.push(`Errore su ${user.email}: ${deleteError.message}`);
    }
  }

  if (errors.length > 0) {
    return res.status(500).json({ error: 'Alcuni utenti non sono stati cancellati', details: errors });
  }

  res.json({ message: 'Tutti gli utenti Supabase Auth sono stati eliminati.' });
});

export default router;
