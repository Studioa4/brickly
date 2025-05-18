
import { createClient } from '@supabase/supabase-js';

export const supabaseOperativo = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export const supabaseBancheDati = createClient(
  process.env.SUPABASE_BD_URL!,
  process.env.SUPABASE_BD_ANON_KEY!
);
