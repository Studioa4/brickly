import dotenv from 'dotenv';
dotenv.config();

import { createClient } from '@supabase/supabase-js';

// ✅ Client con permessi amministrativi (solo nel backend!)
export const supabaseOperativo = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

// ✅ Client con permessi pubblici per banche dati (separato)
export const supabaseBancheDati = createClient(
  process.env.SUPABASE_BD_URL!,
  process.env.SUPABASE_BD_ANON_KEY!
);
