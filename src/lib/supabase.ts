import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseInstance: SupabaseClient | null = null;

export function getSupabase() {
  if (!supabaseInstance) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

    // Only create real client if env vars are set
    if (supabaseUrl !== 'https://placeholder.supabase.co' && supabaseAnonKey !== 'placeholder-key') {
      supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
    }
  }
  return supabaseInstance;
}
