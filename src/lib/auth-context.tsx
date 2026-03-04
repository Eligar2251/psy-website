"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react";
import type { Profile } from "@/lib/types";

interface AuthUser {
  id: string;
  email?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  profile: Profile | null;
  isLoading: boolean;
  isAdmin: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  isLoading: true,
  isAdmin: false,
  signOut: async () => {},
  refreshProfile: async () => {},
});

// Создаём клиент напрямую через @supabase/supabase-js чтобы избежать проблем с типами @supabase/ssr
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

function getSupabase() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = useCallback(async (userId: string) => {
    try {
      const sb = getSupabase();
      const { data } = await sb
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (data) {
        setProfile(data as Profile);
      }
    } catch {
      // ignore
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    if (user) await fetchProfile(user.id);
  }, [user, fetchProfile]);

  useEffect(() => {
    let active = true;
    const sb = getSupabase();

    // Инициализация
    sb.auth.getSession().then(({ data: { session } }) => {
      if (!active) return;

      if (session?.user) {
        setUser({ id: session.user.id, email: session.user.email });
        fetchProfile(session.user.id).finally(() => {
          if (active) setIsLoading(false);
        });
      } else {
        setIsLoading(false);
      }
    });

    // Подписка на изменения auth
    const {
      data: { subscription },
    } = sb.auth.onAuthStateChange((_event, session) => {
      if (!active) return;

      if (session?.user) {
        setUser({ id: session.user.id, email: session.user.email });
        fetchProfile(session.user.id);
      } else {
        setUser(null);
        setProfile(null);
      }
      setIsLoading(false);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  const signOut = useCallback(async () => {
    setUser(null);
    setProfile(null);

    try {
      const sb = getSupabase();
      await sb.auth.signOut();
    } catch {
      // ignore
    }

    window.location.href = "/";
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isLoading,
        isAdmin: profile?.role === "admin",
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}