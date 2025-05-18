
import express from 'express';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

const router = express.Router();

router.post('/', async (req, res) => {
  const { email, password, nome, cognome, codice_fiscale, studio_id } = req.body;

  if (!email || !password || !nome || !cognome || !codice_fiscale || !studio_id) {
    return res.status(400).json({ error: 'Tutti i campi sono obbligatori' });
  }

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password
  });

  if (authError || !authData.user) {
    return res.status(500).json({ error: authError?.message || 'Errore registrazione utente' });
  }

  const user_id = authData.user.id;

  const { error: anagraficaError } = await supabase
    .from('anagrafiche')
    .insert([{ id: user_id, email, nome, cognome, codice_fiscale }]);

  const { error: studioError } = await supabase
    .from('utenti_studi')
    .insert([{ utente_id: user_id, studio_id, ruolo: 'operatore' }]);

  if (anagraficaError || studioError) {
    return res.status(500).json({ error: 'Errore salvataggio anagrafica o associazione studio' });
  }

  res.json({ message: 'Utente creato con successo' });
});

export default router;
