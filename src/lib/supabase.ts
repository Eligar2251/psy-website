import { createBrowserClient } from "@supabase/ssr";
import { createClient as createJsClient } from "@supabase/supabase-js";

let browserClient: ReturnType<typeof createBrowserClient> | null = null;

export function createClient() {
  if (browserClient) return browserClient;

  browserClient = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  return browserClient;
}

export const supabase = createJsClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);