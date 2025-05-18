import { checkAccessToCondominio } from '../middleware/checkAccessToCondominio';
import express from 'express';
import { supabase } from '../lib/supabaseClient';
import { createClient } from '@supabase/supabase-js';

const router = express.Router();

const supabaseBD = createClient(
  process.env.SUPABASE_BD_URL!,
  process.env.SUPABASE_BD_ANON_KEY!
);

router.post('/anagrafiche/copia-da-bd', checkAccessToCondominio, async (req, res) => {
  const { codice_fiscale, studio_id } = req.body;

  if (!codice_fiscale || !studio_id) {
    return res.status(400).json({ errore: "codice_fiscale e studio_id sono obbligatori" });
  }

  const { data: anagraficaBD, error: errBD } = await supabaseBD
    .from('anagrafiche')
    .select('*')
    .eq('codice_fiscale', codice_fiscale)
    .single();

  if (errBD || !anagraficaBD) {
    console.error("❌ Anagrafica non trovata nel DB banche_dati:", errBD);
    return res.status(404).json({ errore: "Anagrafica non trovata nel DB banche_dati" });
  }

  // Rimuoviamo id, created_at, updated_at dal record
  const { id, created_at, updated_at, ...anagraficaSenzaId } = anagraficaBD;
  const nuovoRecord = {
    ...anagraficaSenzaId,
    studio_id
  };

  const { data: inserita, error: errOp } = await supabase
    .from('anagrafiche')
    .insert([nuovoRecord])
    .select()
    .single();

  if (errOp || !inserita) {
    console.error("❌ Errore inserimento nel DB operativo:", errOp);
    return res.status(500).json({ errore: "Errore durante la copia nel DB operativo" });
  }

  return res.status(201).json({ id_operativo: inserita.id });
});

export default router;
