import { Router } from 'express';
import { supabase } from '../lib/supabaseClient'; // Import corretto

const router = Router();

// Aggiorna permessi utente
router.post('/:id/permessi', async (req, res) => {
  const { id } = req.params;
  const { livello_permessi } = req.body;

  const { error } = await supabase
    .from('utenti_studio')
    .update({ livello_permessi })
    .eq('id', id);

  if (error) return res.status(400).json({ message: error.message });
  res.json({ message: 'Permessi aggiornati con successo' });
});

// Attiva/Disattiva utente
router.post('/:id/attivo', async (req, res) => {
  const { id } = req.params;
  const { attivo } = req.body;

  const { error } = await supabase
    .from('utenti_studio')
    .update({ attivo })
    .eq('id', id);

  if (error) return res.status(400).json({ message: error.message });
  res.json({ message: 'Stato aggiornato correttamente' });
});

// Assegna condomini a utente
router.post('/:id/condomini', async (req, res) => {
  const { id } = req.params;
  const { condomini_ids } = req.body;

  await supabase
    .from('condomini_utenti')
    .delete()
    .eq('utente_id', id);

  const insertData = condomini_ids.map((cid: string) => ({
    utente_id: id,
    condominio_id: cid,
  }));

  const { error } = await supabase
    .from('condomini_utenti')
    .insert(insertData);

  if (error) return res.status(400).json({ message: error.message });
  res.json({ message: 'Condomini assegnati correttamente' });
});

export default router;
