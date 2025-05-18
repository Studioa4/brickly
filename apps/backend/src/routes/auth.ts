import express from 'express';
import { supabase } from '../lib/supabaseClient';

const router = express.Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (loginError) {
    console.error("❌ Errore login:", loginError);
    return res.status(401).json({ errore: "Credenziali non valide" });
  }

  const { user, session } = loginData;

  const { data: superadminData, error: saError } = await supabase
    .from('superadmin')
    .select('is_superadmin')
    .eq('email', email)
    .limit(1)
    .single();

  if (saError && saError.code !== 'PGRST116') {
    console.error("❌ Errore lettura superadmin:", saError);
    return res.status(500).json({ errore: "Errore accesso privilegi" });
  }

  const is_superadmin = superadminData?.is_superadmin === true;

  res.json({
    token: session?.access_token,
    utente: {
      id: user.id,
      email: user.email,
      is_superadmin,
    }
  });
});

export default router;
