import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Profile } from "@/lib/types";

export async function createServerSupabase() {
  const cookieStore = await cookies();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  return createServerClient(url, anon, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // server components: иногда нельзя сетить cookies
        }
      },
    },
  });
}

export async function getCurrentUser(): Promise<{
  user: { id: string; email?: string } | null;
  profile: Profile | null;
}> {
  try {
    const supabase = await createServerSupabase();
    const { data } = await supabase.auth.getUser();

    const u = data.user;
    if (!u) return { user: null, profile: null };

    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", u.id)
      .maybeSingle();

    return {
      user: { id: u.id, email: u.email },
      profile: (profile as Profile) ?? null,
    };
  } catch {
    return { user: null, profile: null };
  }
}

export async function isAdmin(): Promise<boolean> {
  const { profile } = await getCurrentUser();
  return profile?.role === "admin";
}