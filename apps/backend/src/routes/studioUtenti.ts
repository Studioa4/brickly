import express from 'express';
import { supabase } from '../lib/supabaseClient';

const router = express.Router();

router.get('/utenti', async (req, res) => {
  // @ts-ignore
  const { id, is_superadmin, id_studio_corrente } = req.utente;

  try {
    if (is_superadmin) {
      const { data, error } = await supabase
        .from('utenti_studi')
        .select(`
          id,
          id_studio,
          alias_nome,
          ruolo,
          permessi,
          anagrafiche(nome, cognome),
          studi(denominazione)
        `)
        .order('id_studio');

      if (error) throw error;
      return res.json(data);
    }

    if (id_studio_corrente) {
      const { data, error } = await supabase
        .from('utenti_studi')
        .select(`
          id,
          id_studio,
          alias_nome,
          ruolo,
          permessi,
          anagrafiche(nome, cognome)
        `)
        .eq('id_studio', id_studio_corrente);

      if (error) throw error;
      return res.json(data);
    }

    const { data, error } = await supabase
      .from('anagrafiche')
      .select('nome, cognome')
      .eq('id', id)
      .single();

    if (error) throw error;
    return res.json([
      {
        id_studio: null,
        nome_reale: data.nome,
        cognome: data.cognome,
        alias_nome: null,
        ruolo: null,
        permessi: {},
      },
    ]);
  } catch (err) {
    console.error('Errore Supabase:', err);
    return res.status(500).json({ errore: 'Errore interno Supabase' });
  }
});

export default router;
