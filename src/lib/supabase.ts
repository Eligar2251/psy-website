import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";

type GlobalWithSupabase = typeof globalThis & {
  __psySupabase?: SupabaseClient;
};

export function createClient(): SupabaseClient {
  const g = globalThis as GlobalWithSupabase;

  if (g.__psySupabase) return g.__psySupabase;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anon) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY"
    );
  }

  g.__psySupabase = createSupabaseClient(url, anon, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      // чтобы не появлялись sb-xxx-auth-token:1 :2 :3
      storageKey: "psy-website-auth",
    },
  });

  return g.__psySupabase;
}