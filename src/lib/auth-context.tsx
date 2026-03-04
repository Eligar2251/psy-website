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
import { createClient } from "@/lib/supabase";
import type { Session } from "@supabase/supabase-js";

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

export function AuthProvider({ children }: { children: ReactNode }) {
  const sb = createClient();

  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const ensureProfile = useCallback(
    async (uid: string, email?: string) => {
      // 1) пробуем прочитать профиль
      const { data: existing } = await sb
        .from("profiles")
        .select("*")
        .eq("id", uid)
        .maybeSingle();

      if (existing) {
        setProfile(existing as Profile);
        return;
      }

      // 2) если нет — создаём (policy profiles_insert_own должна быть)
      await sb.from("profiles").insert({
        id: uid,
        email: email ?? "",
        full_name: "",
        role: "user",
      });

      // 3) читаем ещё раз
      const { data: created } = await sb
        .from("profiles")
        .select("*")
        .eq("id", uid)
        .maybeSingle();

      setProfile((created as Profile) ?? null);
    },
    [sb]
  );

  const applySession = useCallback(
    async (session: Session | null) => {
      try {
        if (session?.user) {
          setUser({ id: session.user.id, email: session.user.email });
          // НЕ блокируем UI навсегда: ensureProfile в try/catch
          await ensureProfile(session.user.id, session.user.email ?? undefined);
        } else {
          setUser(null);
          setProfile(null);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [ensureProfile]
  );

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        const { data } = await sb.auth.getSession();
        if (!alive) return;
        await applySession(data.session);
      } catch {
        if (alive) setIsLoading(false);
      }
    })();

    const { data: sub } = sb.auth.onAuthStateChange(async (_event, session) => {
      if (!alive) return;
      await applySession(session);
    });

    return () => {
      alive = false;
      sub.subscription.unsubscribe();
    };
  }, [sb, applySession]);

  const signOut = useCallback(async () => {
    setUser(null);
    setProfile(null);
    await sb.auth.signOut();
    window.location.href = "/";
  }, [sb]);

  const refreshProfile = useCallback(async () => {
    if (!user) return;
    const { data } = await sb.from("profiles").select("*").eq("id", user.id).maybeSingle();
    setProfile((data as Profile) ?? null);
  }, [sb, user]);

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