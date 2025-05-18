import express, { Request, Response } from 'express';
import { supabaseOperativo } from '../supabaseClient';

const router = express.Router();

router.post('/', async (req: Request, res: Response) => {
  const { email, password } = req.body;
  console.log("➡️ LOGIN RICEVUTO:", email);

  try {
    const { data: authData, error: loginError } = await supabaseOperativo.auth.signInWithPassword({
      email,
      password,
    });

    if (loginError || !authData?.user) {
      console.error("❌ Errore login Supabase:", loginError);
      return res.status(401).json({ error: 'Credenziali non valide' });
    }

    const userId = authData.user.id;

    const { data: anag, error: anagError } = await supabaseOperativo
      .from('anagrafiche')
      .select('nome, cognome')
      .eq('id', userId)
      .maybeSingle();

    if (anagError) {
      console.error("❌ Errore anagrafiche:", anagError);
      return res.status(500).json({ error: 'Errore nel recupero dati anagrafici' });
    }

    const { data: superadminData, error: saError } = await supabaseOperativo
      .from('superadmin')
      .select('is_superadmin')
      .eq('email', email)
      .limit(1)
      .single();

    const is_superadmin = superadminData?.is_superadmin === true;

    if (saError && saError.code !== 'PGRST116') {
      console.warn("⚠️ Errore lettura superadmin:", saError);
    }

    const token = authData.session.access_token;

    // Aggiorna user_metadata con nome, cognome, is_superadmin
    await supabaseOperativo.auth.updateUser({
      data: {
        nome: anag?.nome || '',
        cognome: anag?.cognome || '',
        is_superadmin,
        codice_fiscale: authData.user.user_metadata?.codice_fiscale || userId // oppure il CF reale
      },
    });

    console.log("✅ Login riuscito:", {
      id: userId,
      token,
      user_metadata: authData.user.user_metadata,
    });

    res.json({
      token,
      user: {
        id: userId,
        email,
        nome: anag?.nome || '',
        cognome: anag?.cognome || '',
        is_superadmin,
      }
    });

  } catch (err) {
    console.error('🔥 Errore interno login:', err);
    res.status(500).json({ error: 'Errore interno' });
  }
});

export default router;
