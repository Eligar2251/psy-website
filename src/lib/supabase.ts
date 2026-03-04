import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

type GlobalWithSB = typeof globalThis & {
  __psy_sb__?: SupabaseClient;
};

export function createClient(): SupabaseClient {
  const g = globalThis as GlobalWithSB;
  if (g.__psy_sb__) return g.__psy_sb__;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anon) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY"
    );
  }

  g.__psy_sb__ = createBrowserClient(url, anon, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      // фикс, чтобы не плодились токены :1 :2 :3
      storageKey: "psy-website-auth",
    },
  });

  return g.__psy_sb__;
}