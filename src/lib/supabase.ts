import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";

type GlobalWithSupabase = typeof globalThis & {
  __psySupabase?: SupabaseClient;
};

/**
 * Один Supabase client на весь браузер (даже если модуль случайно продублировался в бандле).
 * Это убирает "Multiple GoTrueClient instances detected".
 */
export function createClient(): SupabaseClient {
  const g = globalThis as GlobalWithSupabase;

  if (g.__psySupabase) return g.__psySupabase;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anon) {
    // Чтобы ошибка была понятной, а не "ничего не происходит"
    throw new Error(
      "Supabase env vars are missing. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY"
    );
  }

  g.__psySupabase = createSupabaseClient(url, anon, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      // Важно: фиксируем ключ, чтобы не появлялись :1 :2 :3
      storageKey: "psy-website-auth",
    },
  });

  return g.__psySupabase;
}