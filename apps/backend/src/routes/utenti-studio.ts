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

// ✅ GET: restituisce tutti gli ID condominio associati a un utente studio
router.get('/:id/condomini', async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabaseOperativo
    .from('utenti_studi_condomini')
    .select('id_condominio')
    .eq('id_utente_studio', id);

  if (error) {
    return res.status(500).json({ message: error.message });
  }

  const ids = data.map(item => item.id_condominio);
  res.json(ids);
});

// ✅ POST: salva i nuovi condomini assegnati (sovrascrivendo i precedenti)
router.post('/:id/condomini', async (req, res) => {
  const { id } = req.params;
  const { condomini_ids } = req.body;

  if (!Array.isArray(condomini_ids)) {
    return res.status(400).json({ message: "condomini_ids deve essere un array" });
  }

  // Elimina i record esistenti
  const { error: deleteError } = await supabaseOperativo
    .from('utenti_studi_condomini')
    .delete()
    .eq('id_utente_studio', id);

  if (deleteError) {
    return res.status(500).json({ message: deleteError.message });
  }

  // Inserisci i nuovi
  const nuoviRecord = condomini_ids.map((condominio_id: string) => ({
    id_utente_studio: id,
    id_condominio: condominio_id
  }));

  if (nuoviRecord.length > 0) {
    const { error: insertError } = await supabaseOperativo
      .from('utenti_studi_condomini')
      .insert(nuoviRecord);

    if (insertError) {
      return res.status(500).json({ message: insertError.message });
    }
  }

  res.status(200).json({ message: "Condomìni aggiornati correttamente" });
});

export default router;
