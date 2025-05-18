
import express from 'express';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const router = express.Router();

router.post('/', async (req, res) => {
  console.log('📥 Richiesta creazione superadmin ricevuta.');
  console.log('Request body:', req.body);

  const { email, password, nome, cognome, codice_fiscale } = req.body;
  const id_studio = 'INSERISCI_ID_STUDIO'; // <-- Sostituisci con il tuo ID studio reale

  if (!email || !password || !nome || !cognome || !codice_fiscale) {
    return res.status(400).json({ error: 'Tutti i campi sono richiesti' });
  }

  const { data, error: signUpError } = await supabase.auth.signUp({ email, password });

  if (signUpError || !data.user) {
    console.error('❌ Errore Supabase Auth:', signUpError?.message);
    return res.status(500).json({ error: signUpError?.message || 'Errore durante la registrazione' });
  }

  const user_id = data.user.id;

  const { error: anagraficaError } = await supabase
    .from('anagrafiche')
    .upsert([{ id: user_id, email, nome, cognome, codice_fiscale }], { onConflict: 'codice_fiscale' });

  if (anagraficaError) {
    console.error('❌ Errore inserimento in anagrafiche:', anagraficaError.message);
    return res.status(500).json({ error: 'Errore nel salvataggio anagrafica' });
  }

  const { error: studioError } = await supabase
    .from('utenti_studi')
    .insert([{ id_utente: user_id, id_studio, codice_fiscale_utente: codice_fiscale }]);

  if (studioError) {
    console.error('❌ Errore inserimento in utenti_studi:', studioError.message);
    return res.status(500).json({ error: 'Errore nel salvataggio utenti_studi' });
  }

  console.log('✅ Superadmin creato con successo. ID:', user_id);
  res.json({ message: 'Superadmin creato con successo' });
});

export default router;
