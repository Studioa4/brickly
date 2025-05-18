
import { Router } from 'express';
import { supabaseOperativo } from '../supabaseClient';

const router = Router();

// Recupera utenti dello studio
router.get('/', async (req, res) => {
  const { studio_id } = req.query;

  if (!studio_id) {
    return res.status(400).json({ message: 'studio_id è richiesto' });
  }

  const { data: utentiStudio, error } = await supabaseOperativo
    .from('utenti_studi')
    .select('id, id_utente, ruolo_id, attivo')
    .eq('id_studio', studio_id);

  if (error) return res.status(400).json({ message: error.message });

  const utentiIds = utentiStudio.map(us => us.id_utente);
  const ruoloIds = utentiStudio.map(us => us.ruolo_id).filter(id => id != null);

  const { data: anagrafiche, error: anagError } = await supabaseOperativo
    .from('anagrafiche')
    .select('id, email, nome, cognome')
    .in('id', utentiIds);

  if (anagError) return res.status(400).json({ message: anagError.message });

  const { data: ruoli, error: ruoloError } = await supabaseOperativo
    .from('ruoli')
    .select('id, nome, descrizione')
    .in('id', ruoloIds.length > 0 ? ruoloIds : ['__dummy__']);

  if (ruoloError) return res.status(400).json({ message: ruoloError.message });

  const risultato = utentiStudio.map(us => {
    const anagrafica = anagrafiche.find(a => a.id === us.id_utente);
    const ruolo = ruoli.find(r => r.id === us.ruolo_id);

    return {
      id: us.id,
      id_utente: us.id_utente,
      ruolo_id: us.ruolo_id,
      livello_permessi: us.ruolo_id,
      ruolo_nome: ruolo?.nome ?? '',
      ruolo_descrizione: ruolo?.descrizione ?? '',
      attivo: us.attivo,
      nome: anagrafica?.nome ?? '',
      cognome: anagrafica?.cognome ?? '',
      email: anagrafica?.email ?? '',
    };
  });

  res.json(risultato);
});

// Aggiorna permessi utente
router.post('/:id/permessi', async (req, res) => {
  const { id } = req.params;
  const { ruolo_id } = req.body;

  if (!ruolo_id || typeof ruolo_id !== 'number') {
    return res.status(400).json({ message: 'ruolo_id non valido' });
  }

  const { error } = await supabaseOperativo
    .from('utenti_studi')
    .update({ ruolo_id })
    .eq('id', id);

  if (error) return res.status(400).json({ message: error.message });
  res.json({ message: 'Permessi aggiornati con successo' });
});

// Attiva/Disattiva utente
router.post('/:id/attivo', async (req, res) => {
  const { id } = req.params;
  const { attivo } = req.body;

  const { error } = await supabaseOperativo
    .from('utenti_studi')
    .update({ attivo })
    .eq('id', id);

  if (error) return res.status(400).json({ message: error.message });
  res.json({ message: 'Stato aggiornato correttamente' });
});

// Assegna condomini a utente
router.post('/:id/condomini', async (req, res) => {
  const { id } = req.params;
  const { condomini_ids } = req.body;

  await supabaseOperativo
    .from('condomini_utenti')
    .delete()
    .eq('utente_id', id);

  const insertData = condomini_ids.map((cid: string) => ({
    utente_id: id,
    condominio_id: cid,
  }));

  const { error } = await supabaseOperativo
    .from('condomini_utenti')
    .insert(insertData);

  if (error) return res.status(400).json({ message: error.message });
  res.json({ message: 'Condomini assegnati correttamente' });
});

export default router;
