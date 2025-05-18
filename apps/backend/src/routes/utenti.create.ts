import express from 'express';
import { supabaseOperativo } from '../supabaseClient';
import { Pool } from 'pg';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

router.post('/utenti/create', async (req, res) => {
  const { codice_fiscale, ruolo } = req.body;
  const utenteCorrente = req.utente;
  const idStudio = utenteCorrente?.id_studio_corrente;
  const isSuperadmin = utenteCorrente?.is_superadmin;

  if (!codice_fiscale || !ruolo) {
    return res.status(400).json({ error: 'Parametri mancanti' });
  }

  if (!isSuperadmin && ruolo === 'admin') {
    return res.status(403).json({ error: 'Non autorizzato a creare admin' });
  }

  try {
    const { rows: anagraficheBD } = await pool.query(
      'SELECT * FROM banche_dati.anagrafiche WHERE codice_fiscale = $1',
      [codice_fiscale]
    );

    if (!anagraficheBD.length) {
      return res.status(404).json({ error: 'Codice fiscale non trovato in banche dati' });
    }

    const anagraficaBD = anagraficheBD[0];

    const { rows: anagraficheLocali } = await pool.query(
      'SELECT * FROM anagrafiche WHERE codice_fiscale = $1',
      [codice_fiscale]
    );

    let id_anagrafica;

    if (anagraficheLocali.length) {
      id_anagrafica = anagraficheLocali[0].id;
    } else {
      id_anagrafica = uuidv4();
      await pool.query(
        'INSERT INTO anagrafiche (id, codice_fiscale, nome, cognome, email) VALUES ($1, $2, $3, $4, $5)',
        [
          id_anagrafica,
          codice_fiscale,
          anagraficaBD.nome,
          anagraficaBD.cognome,
          anagraficaBD.email
        ]
      );
    }

    const { data, error } = await supabaseOperativo.auth.admin.createUser({
      email: anagraficaBD.email,
      email_confirm: false,
      user_metadata: {
        codice_fiscale,
        ruolo
      }
    });

    if (error) {
      return res.status(500).json({ error: 'Errore creazione utente Supabase', detail: error.message });
    }

    await pool.query(
      'INSERT INTO utenti_studi (id_studio, id_anagrafica, ruolo, attivo) VALUES ($1, $2, $3, true)',
      [idStudio, id_anagrafica, ruolo]
    );

    return res.json({ message: 'Utente creato con successo e invitato via email' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Errore interno' });
  }
});

export default router;
