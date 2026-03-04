import { createClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";

let supabaseBrowser: SupabaseClient | null = null;

export function getSupabaseBrowser() {
  if (supabaseBrowser) return supabaseBrowser;

  supabaseBrowser = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    }
  );

  return supabaseBrowser;
}