import express from 'express';
import { createClient } from '@supabase/supabase-js';

const router = express.Router();

const supabaseBD = createClient(
  process.env.SUPABASE_BD_URL!,
  process.env.SUPABASE_BD_ANON_KEY!
);

router.get('/fornitori-bd', async (req, res) => {
  const { data, error } = await supabaseBD
    .from('fornitori')
    .select('*')
    .limit(1000);

  if (error) {
    console.error('❌ Errore banche_dati:', error);
    return res.status(500).json({ errore: error.message });
  }

  res.json(data);
});

export default router;
