import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      // This pulls the code from the browser's storage 
      // where you save it during the coach "login"
      'x-coach-code': localStorage.getItem('coach_code') || ''
    }
  }
});
