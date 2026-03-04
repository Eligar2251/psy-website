import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Profile } from "./types";

export async function createServerSupabase() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
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
            // Server Component — нельзя устанавливать cookies
          }
        },
      },
    }
  );
}

export async function getCurrentUser(): Promise<{
  user: { id: string; email?: string } | null;
  profile: Profile | null;
}> {
  try {
    const supabase = await createServerSupabase();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return { user: null, profile: null };
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    return {
      user: { id: user.id, email: user.email },
      profile: profile as Profile | null,
    };
  } catch {
    return { user: null, profile: null };
  }
}

export async function isAdmin(): Promise<boolean> {
  try {
    const { profile } = await getCurrentUser();
    return profile?.role === "admin";
  } catch {
    return false;
  }
}